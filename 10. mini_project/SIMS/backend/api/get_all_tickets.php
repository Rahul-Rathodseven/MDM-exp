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

$query = "
    SELECT
        tickets.id,
        tickets.status,
        tickets.priority,
        tickets.sla_deadline,
        tickets.created_at,
        tickets.updated_at,
        inquiries.subject,
        inquiries.message,
        inquiries.category,
        inquiries.attachment_path,
        users.name AS user_name,
        users.email AS user_email
    FROM tickets
    INNER JOIN inquiries ON tickets.inquiry_id = inquiries.id
    INNER JOIN users ON inquiries.user_id = users.id
    ORDER BY tickets.updated_at DESC
";

$result = $conn->query($query);

if (!$result) {
    send_json(500, [
        'success' => false,
        'message' => 'Failed to fetch tickets.',
        'error' => $conn->error
    ]);
}

$tickets = [];
while ($row = $result->fetch_assoc()) {
    $tickets[] = $row;
}

send_json(200, [
    'success' => true,
    'tickets' => $tickets
]);
?>