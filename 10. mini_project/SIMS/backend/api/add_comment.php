<?php
require_once 'db.php';
ensure_ticketing_schema($conn);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(405, [
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
}

$data = get_json_input();
require_fields($data, ['ticket_id', 'user_id', 'message']);

$ticketId = (int) $data['ticket_id'];
$userId = (int) $data['user_id'];
$message = trim($data['message']);

$user = fetch_user_by_id($conn, $userId);
if (!$user) {
    send_json(404, [
        'success' => false,
        'message' => 'User not found.'
    ]);
}

$ticket = fetch_ticket_with_context($conn, $ticketId);
if (!$ticket) {
    send_json(404, [
        'success' => false,
        'message' => 'Ticket not found.'
    ]);
}

if ($user['role'] !== 'admin' && !user_can_access_ticket($conn, $ticketId, $userId)) {
    send_json(403, [
        'success' => false,
        'message' => 'You are not allowed to comment on this ticket.'
    ]);
}

try {
    $comment = create_ticket_comment($conn, $ticketId, $userId, $message);
    create_activity_log($conn, $ticketId, 'Comment added', build_actor_label($user));

    send_json(201, [
        'success' => true,
        'message' => 'Comment added successfully.',
        'comment' => $comment
    ]);
} catch (Exception $exception) {
    send_json(500, [
        'success' => false,
        'message' => 'Failed to add comment.',
        'error' => $exception->getMessage()
    ]);
}
?>