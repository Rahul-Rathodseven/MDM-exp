<?php
require_once 'db.php';
ensure_ticketing_schema($conn);

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_json(405, [
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
}

$adminUserId = isset($_GET['admin_user_id']) ? (int) $_GET['admin_user_id'] : 0;
if ($adminUserId <= 0) {
    send_json(422, [
        'success' => false,
        'message' => 'Valid admin_user_id is required.'
    ]);
}

require_admin($conn, $adminUserId);

$status = isset($_GET['status']) ? trim($_GET['status']) : 'All';
$priority = isset($_GET['priority']) ? trim($_GET['priority']) : 'All';
$search = isset($_GET['search']) ? trim($_GET['search']) : '';

$query = "
    SELECT
        tickets.id,
        inquiries.subject,
        inquiries.message,
        inquiries.category,
        inquiries.attachment_path,
        tickets.status,
        tickets.priority,
        tickets.sla_deadline,
        tickets.created_at,
        tickets.updated_at,
        users.name AS requester_name,
        users.email AS requester_email
    FROM tickets
    INNER JOIN inquiries ON tickets.inquiry_id = inquiries.id
    INNER JOIN users ON inquiries.user_id = users.id
    WHERE 1 = 1
";

$types = '';
$params = [];

if ($status !== '' && $status !== 'All') {
    $query .= ' AND tickets.status = ?';
    $types .= 's';
    $params[] = $status;
}

if ($priority !== '' && $priority !== 'All') {
    $query .= ' AND tickets.priority = ?';
    $types .= 's';
    $params[] = $priority;
}

if ($search !== '') {
    $query .= ' AND (
        CAST(tickets.id AS CHAR) LIKE ? OR
        inquiries.subject LIKE ? OR
        inquiries.message LIKE ? OR
        inquiries.category LIKE ? OR
        users.name LIKE ? OR
        users.email LIKE ?
    )';
    $types .= 'ssssss';
    for ($index = 0; $index < 6; $index += 1) {
        $params[] = '%' . $search . '%';
    }
}

$query .= ' ORDER BY tickets.updated_at DESC';

$statement = $conn->prepare($query);
if ($types !== '') {
    $statement->bind_param($types, ...$params);
}
$statement->execute();
$result = $statement->get_result();

header('Content-Type: text/csv; charset=UTF-8');
header('Content-Disposition: attachment; filename="tickets-report.csv"');

$output = fopen('php://output', 'w');
fputcsv($output, ['Ticket ID', 'Subject', 'Category', 'Status', 'Priority', 'SLA Deadline', 'Requester Name', 'Requester Email', 'Attachment Path', 'Created At', 'Updated At']);

while ($row = $result->fetch_assoc()) {
    fputcsv($output, [
        $row['id'],
        $row['subject'],
        $row['category'],
        $row['status'],
        $row['priority'],
        $row['sla_deadline'],
        $row['requester_name'],
        $row['requester_email'],
        $row['attachment_path'],
        $row['created_at'],
        $row['updated_at']
    ]);
}

fclose($output);
$statement->close();
exit;
?>