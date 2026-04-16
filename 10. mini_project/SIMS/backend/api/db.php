<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'services' . DIRECTORY_SEPARATOR . 'MailService.php';

$dbHost = '127.0.0.1';
$dbName = 'sims_db';
$dbUser = 'root';
$dbPass = '';

function send_json($statusCode, $payload) {
    http_response_code($statusCode);
    echo json_encode($payload);
    exit;
}

function get_json_input() {
    $rawInput = file_get_contents('php://input');

    if (!$rawInput) {
        return [];
    }

    $data = json_decode($rawInput, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        send_json(400, [
            'success' => false,
            'message' => 'Invalid JSON payload.'
        ]);
    }

    return $data;
}

function get_request_data() {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

    if (stripos($contentType, 'multipart/form-data') !== false) {
        return $_POST;
    }

    return get_json_input();
}

function require_fields($data, $fields) {
    foreach ($fields as $field) {
        if (!isset($data[$field]) || trim((string) $data[$field]) === '') {
            send_json(422, [
                'success' => false,
                'message' => "Missing required field: {$field}"
            ]);
        }
    }
}

function run_schema_query($conn, $query, $message) {
    if (!$conn->query($query)) {
        send_json(500, [
            'success' => false,
            'message' => $message,
            'error' => $conn->error
        ]);
    }
}

function column_exists($conn, $table, $column) {
    $tableName = $conn->real_escape_string($table);
    $columnName = $conn->real_escape_string($column);
    $result = $conn->query("SHOW COLUMNS FROM `{$tableName}` LIKE '{$columnName}'");

    return $result && $result->num_rows > 0;
}

function fetch_user_by_id($conn, $userId) {
    $statement = $conn->prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?');
    $statement->bind_param('i', $userId);
    $statement->execute();
    $result = $statement->get_result();
    $user = $result->fetch_assoc();
    $statement->close();

    return $user;
}

function build_session_user($user, $fallback = []) {
    $candidate = is_array($user) ? $user : [];

    $id = isset($candidate['id']) ? (int) $candidate['id'] : (isset($fallback['id']) ? (int) $fallback['id'] : 0);
    $name = isset($candidate['name']) && $candidate['name'] !== '' ? $candidate['name'] : ($fallback['name'] ?? '');
    $email = isset($candidate['email']) && $candidate['email'] !== '' ? $candidate['email'] : ($fallback['email'] ?? '');
    $role = isset($candidate['role']) && $candidate['role'] !== '' ? $candidate['role'] : ($fallback['role'] ?? 'user');
    $createdAt = isset($candidate['created_at']) && $candidate['created_at'] !== '' ? $candidate['created_at'] : ($fallback['created_at'] ?? date('Y-m-d H:i:s'));

    if ($id <= 0 || $email === '') {
        return null;
    }

    return [
        'id' => $id,
        'name' => $name,
        'email' => $email,
        'role' => $role,
        'created_at' => $createdAt
    ];
}
function require_admin($conn, $userId) {
    $user = fetch_user_by_id($conn, (int) $userId);

    if (!$user || $user['role'] !== 'admin') {
        send_json(403, [
            'success' => false,
            'message' => 'Admin access is required.'
        ]);
    }

    return $user;
}

function ensure_users_schema($conn) {
    $query = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    run_schema_query($conn, $query, 'Failed to prepare users table.');
}

function ensure_ticketing_schema($conn) {
    ensure_users_schema($conn);

    $queries = [
        "CREATE TABLE IF NOT EXISTS inquiries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            subject VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            category VARCHAR(100) NOT NULL,
            attachment_path VARCHAR(255) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_inquiries_user
                FOREIGN KEY (user_id) REFERENCES users(id)
                ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS tickets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            inquiry_id INT NOT NULL,
            status ENUM('Open', 'In Progress', 'Closed') NOT NULL DEFAULT 'Open',
            priority ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
            sla_deadline DATETIME NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            CONSTRAINT fk_tickets_inquiry
                FOREIGN KEY (inquiry_id) REFERENCES inquiries(id)
                ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS activity_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ticket_id INT NOT NULL,
            action VARCHAR(255) NOT NULL,
            performed_by VARCHAR(150) NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_activity_logs_ticket
                FOREIGN KEY (ticket_id) REFERENCES tickets(id)
                ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS comments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ticket_id INT NOT NULL,
            user_id INT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_comments_ticket
                FOREIGN KEY (ticket_id) REFERENCES tickets(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_comments_user
                FOREIGN KEY (user_id) REFERENCES users(id)
                ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    ];

    foreach ($queries as $query) {
        run_schema_query($conn, $query, 'Ticketing tables are not ready. Remove broken sims_db tables and try again.');
    }

    if (!column_exists($conn, 'tickets', 'priority')) {
        run_schema_query(
            $conn,
            "ALTER TABLE tickets ADD COLUMN priority ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium' AFTER status",
            'Failed to add priority column to tickets.'
        );
    }

    if (!column_exists($conn, 'tickets', 'sla_deadline')) {
        run_schema_query(
            $conn,
            "ALTER TABLE tickets ADD COLUMN sla_deadline DATETIME NULL AFTER priority",
            'Failed to add sla_deadline column to tickets.'
        );
    }

    if (!column_exists($conn, 'inquiries', 'attachment_path')) {
        run_schema_query(
            $conn,
            "ALTER TABLE inquiries ADD COLUMN attachment_path VARCHAR(255) NULL AFTER category",
            'Failed to add attachment_path column to inquiries.'
        );
    }
}

function ensure_admin_seed($conn) {
    ensure_users_schema($conn);

    $adminName = 'System Admin';
    $adminEmail = 'admin@sims.local';
    $adminPasswordHash = password_hash('admin123', PASSWORD_DEFAULT);
    $adminRole = 'admin';

    $adminCheck = $conn->prepare('SELECT id FROM users WHERE email = ?');
    $adminCheck->bind_param('s', $adminEmail);
    $adminCheck->execute();
    $existingAdmin = $adminCheck->get_result()->fetch_assoc();
    $adminCheck->close();

    if (!$existingAdmin) {
        $seedAdmin = $conn->prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
        $seedAdmin->bind_param('ssss', $adminName, $adminEmail, $adminPasswordHash, $adminRole);

        if (!$seedAdmin->execute()) {
            send_json(500, [
                'success' => false,
                'message' => 'Failed to seed admin account.',
                'error' => $seedAdmin->error
            ]);
        }

        $seedAdmin->close();
    }
}

function bootstrap_database($conn, $dbName) {
    if (!$conn->query("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")) {
        send_json(500, [
            'success' => false,
            'message' => 'Failed to create database.',
            'error' => $conn->error
        ]);
    }

    if (!$conn->select_db($dbName)) {
        send_json(500, [
            'success' => false,
            'message' => 'Failed to select database.',
            'error' => $conn->error
        ]);
    }

    ensure_admin_seed($conn);
}

function build_actor_label($user) {
    $roleLabel = ucfirst($user['role'] ?? 'user');
    return trim(($user['name'] ?? 'System') . " ({$roleLabel})");
}

function create_activity_log($conn, $ticketId, $action, $performedBy) {
    $statement = $conn->prepare('INSERT INTO activity_logs (ticket_id, action, performed_by) VALUES (?, ?, ?)');
    $statement->bind_param('iss', $ticketId, $action, $performedBy);

    if (!$statement->execute()) {
        $error = $statement->error;
        $statement->close();
        throw new Exception($error);
    }

    $statement->close();
}

function calculate_sla_deadline($priority, $baseDateTime = 'now') {
    $priorityKey = strtolower(trim((string) $priority));
    $hoursMap = [
        'high' => 24,
        'medium' => 48,
        'low' => 72
    ];

    $hours = $hoursMap[$priorityKey] ?? 48;
    $deadline = new DateTime($baseDateTime);
    $deadline->modify("+{$hours} hours");

    return $deadline->format('Y-m-d H:i:s');
}

function ensure_uploads_directory() {
    $uploadDirectory = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'uploads';

    if (!is_dir($uploadDirectory)) {
        if (!@mkdir($uploadDirectory, 0777, true) && !is_dir($uploadDirectory)) {
            throw new Exception('Failed to create uploads directory.');
        }
    }

    return $uploadDirectory;
}

function sanitize_uploaded_file_name($originalName) {
    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    $baseName = pathinfo($originalName, PATHINFO_FILENAME);
    $baseName = preg_replace('/[^a-zA-Z0-9_-]/', '-', $baseName ?: 'attachment');
    $baseName = trim($baseName, '-');

    if ($baseName === '') {
        $baseName = 'attachment';
    }

    return $baseName . '-' . uniqid() . ($extension ? '.' . $extension : '');
}

function save_attachment_upload($inputName = 'attachment') {
    if (!isset($_FILES[$inputName]) || !is_array($_FILES[$inputName])) {
        return null;
    }

    $file = $_FILES[$inputName];

    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new Exception('Attachment upload failed.');
    }

    if (($file['size'] ?? 0) > 5 * 1024 * 1024) {
        throw new Exception('Attachment must be 5MB or smaller.');
    }

    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt'];
    $extension = strtolower(pathinfo($file['name'] ?? '', PATHINFO_EXTENSION));

    if (!in_array($extension, $allowedExtensions, true)) {
        throw new Exception('Unsupported attachment type.');
    }

    $uploadDirectory = ensure_uploads_directory();
    $safeName = sanitize_uploaded_file_name($file['name']);
    $targetPath = $uploadDirectory . DIRECTORY_SEPARATOR . $safeName;

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        throw new Exception('Failed to store uploaded attachment.');
    }

    return '/uploads/' . $safeName;
}

function fetch_ticket_with_context($conn, $ticketId) {
    $query = "
        SELECT
            tickets.id,
            tickets.inquiry_id,
            tickets.status,
            tickets.priority,
            tickets.sla_deadline,
            tickets.created_at,
            tickets.updated_at,
            inquiries.subject,
            inquiries.message,
            inquiries.category,
            inquiries.attachment_path,
            inquiries.user_id,
            users.name AS user_name,
            users.email AS user_email,
            users.role AS user_role
        FROM tickets
        INNER JOIN inquiries ON tickets.inquiry_id = inquiries.id
        INNER JOIN users ON inquiries.user_id = users.id
        WHERE tickets.id = ?
        LIMIT 1
    ";

    $statement = $conn->prepare($query);
    $statement->bind_param('i', $ticketId);
    $statement->execute();
    $ticket = $statement->get_result()->fetch_assoc();
    $statement->close();

    return $ticket;
}

function user_can_access_ticket($conn, $ticketId, $userId) {
    $statement = $conn->prepare(
        'SELECT tickets.id FROM tickets INNER JOIN inquiries ON tickets.inquiry_id = inquiries.id WHERE tickets.id = ? AND inquiries.user_id = ? LIMIT 1'
    );
    $statement->bind_param('ii', $ticketId, $userId);
    $statement->execute();
    $ticket = $statement->get_result()->fetch_assoc();
    $statement->close();

    return (bool) $ticket;
}

function fetch_ticket_activity_logs($conn, $ticketId) {
    $statement = $conn->prepare(
        'SELECT id, ticket_id, action, performed_by, timestamp FROM activity_logs WHERE ticket_id = ? ORDER BY timestamp ASC, id ASC'
    );
    $statement->bind_param('i', $ticketId);
    $statement->execute();
    $result = $statement->get_result();

    $logs = [];
    while ($row = $result->fetch_assoc()) {
        $logs[] = $row;
    }

    $statement->close();

    return $logs;
}

function fetch_ticket_comments($conn, $ticketId) {
    $statement = $conn->prepare(
        "SELECT comments.id, comments.ticket_id, comments.user_id, comments.message, comments.created_at, users.name AS user_name, users.role AS user_role
         FROM comments
         INNER JOIN users ON comments.user_id = users.id
         WHERE comments.ticket_id = ?
         ORDER BY comments.created_at ASC, comments.id ASC"
    );
    $statement->bind_param('i', $ticketId);
    $statement->execute();
    $result = $statement->get_result();

    $comments = [];
    while ($row = $result->fetch_assoc()) {
        $comments[] = $row;
    }

    $statement->close();

    return $comments;
}

function create_ticket_comment($conn, $ticketId, $userId, $message) {
    $statement = $conn->prepare('INSERT INTO comments (ticket_id, user_id, message) VALUES (?, ?, ?)');
    $statement->bind_param('iis', $ticketId, $userId, $message);

    if (!$statement->execute()) {
        $error = $statement->error;
        $statement->close();
        throw new Exception($error);
    }

    $commentId = $statement->insert_id;
    $statement->close();

    $commentStatement = $conn->prepare(
        "SELECT comments.id, comments.ticket_id, comments.user_id, comments.message, comments.created_at, users.name AS user_name, users.role AS user_role
         FROM comments
         INNER JOIN users ON comments.user_id = users.id
         WHERE comments.id = ?
         LIMIT 1"
    );
    $commentStatement->bind_param('i', $commentId);
    $commentStatement->execute();
    $comment = $commentStatement->get_result()->fetch_assoc();
    $commentStatement->close();

    return $comment;
}

function get_mail_service() {
    static $mailService = null;

    if ($mailService === null) {
        $mailService = new MailService();
    }

    return $mailService;
}

function build_ticket_received_email($ticket) {
    $ticketId = $ticket['id'] ?? 'N/A';
    $status = $ticket['status'] ?? 'Open';
    $priority = $ticket['priority'] ?? 'Medium';

    return implode(PHP_EOL, [
        'Your inquiry has been received.',
        '',
        "Ticket ID: #{$ticketId}",
        "Status: {$status}",
        "Priority: {$priority}",
        '',
        'Our team will review your request and update the ticket as it progresses.'
    ]);
}

function build_status_changed_email($ticket) {
    $ticketId = $ticket['id'] ?? 'N/A';
    $status = $ticket['status'] ?? 'Unknown';
    $priority = $ticket['priority'] ?? 'Medium';

    return implode(PHP_EOL, [
        'Your ticket status has been updated.',
        '',
        "Ticket ID: #{$ticketId}",
        "New Status: {$status}",
        "Priority: {$priority}",
        '',
        'You can log in to SIMS to view the latest ticket details and activity timeline.'
    ]);
}

function notify_ticket_submitted($ticket) {
    if (empty($ticket['user_email'])) {
        return false;
    }

    $subject = 'Your inquiry has been received';
    $body = build_ticket_received_email($ticket);

    return get_mail_service()->sendMail($ticket['user_email'], $subject, $body);
}

function notify_ticket_status_changed($ticket) {
    if (empty($ticket['user_email'])) {
        return false;
    }

    $subject = 'Your ticket status has changed';
    $body = build_status_changed_email($ticket);

    return get_mail_service()->sendMail($ticket['user_email'], $subject, $body);
}

$conn = new mysqli($dbHost, $dbUser, $dbPass);

if ($conn->connect_error) {
    send_json(500, [
        'success' => false,
        'message' => 'Database connection failed.',
        'error' => $conn->connect_error
    ]);
}

$conn->set_charset('utf8mb4');
bootstrap_database($conn, $dbName);
?>