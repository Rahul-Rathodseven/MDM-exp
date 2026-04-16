<?php
require_once 'db.php';
ensure_ticketing_schema($conn);

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_json(405, [
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
}

$userId = isset($_GET['user_id']) ? (int) $_GET['user_id'] : 0;

if ($userId <= 0) {
    send_json(422, [
        'success' => false,
        'message' => 'Valid user_id is required.'
    ]);
}

$user = fetch_user_by_id($conn, $userId);
if (!$user) {
    send_json(404, [
        'success' => false,
        'message' => 'User not found.'
    ]);
}

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
        tickets.updated_at
    FROM tickets
    INNER JOIN inquiries ON tickets.inquiry_id = inquiries.id
    WHERE inquiries.user_id = ?
    ORDER BY tickets.created_at DESC
";

$statement = $conn->prepare($query);
$statement->bind_param('i', $userId);
$statement->execute();
$result = $statement->get_result();

$tickets = [];
while ($row = $result->fetch_assoc()) {
    $tickets[] = $row;
}

$statement->close();

send_json(200, [
    'success' => true,
    'tickets' => $tickets
]);
?>