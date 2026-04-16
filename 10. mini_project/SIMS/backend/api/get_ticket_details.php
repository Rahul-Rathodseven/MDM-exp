<?php
require_once 'db.php';
ensure_ticketing_schema($conn);

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_json(405, [
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
}

$ticketId = isset($_GET['ticket_id']) ? (int) $_GET['ticket_id'] : 0;
$userId = isset($_GET['user_id']) ? (int) $_GET['user_id'] : 0;
$adminUserId = isset($_GET['admin_user_id']) ? (int) $_GET['admin_user_id'] : 0;

if ($ticketId <= 0) {
    send_json(422, [
        'success' => false,
        'message' => 'Valid ticket_id is required.'
    ]);
}

if ($adminUserId > 0) {
    require_admin($conn, $adminUserId);
    $ticket = fetch_ticket_with_context($conn, $ticketId);
} else {
    if ($userId <= 0) {
        send_json(422, [
            'success' => false,
            'message' => 'Valid user_id or admin_user_id is required.'
        ]);
    }

    $user = fetch_user_by_id($conn, $userId);
    if (!$user) {
        send_json(404, [
            'success' => false,
            'message' => 'User not found.'
        ]);
    }

    if (!user_can_access_ticket($conn, $ticketId, $userId)) {
        send_json(404, [
            'success' => false,
            'message' => 'Ticket not found.'
        ]);
    }

    $ticket = fetch_ticket_with_context($conn, $ticketId);
}

if (!$ticket) {
    send_json(404, [
        'success' => false,
        'message' => 'Ticket not found.'
    ]);
}

$activityLogs = fetch_ticket_activity_logs($conn, $ticketId);

send_json(200, [
    'success' => true,
    'ticket' => $ticket,
    'activity_logs' => $activityLogs
]);
?>