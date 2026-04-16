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
require_fields($data, ['ticket_id', 'admin_user_id']);

$ticketId = (int) $data['ticket_id'];
$adminUserId = (int) $data['admin_user_id'];
$allowedStatuses = ['Open', 'In Progress', 'Closed'];
$allowedPriorities = ['Low', 'Medium', 'High'];

$hasStatus = isset($data['status']) && trim((string) $data['status']) !== '';
$hasPriority = isset($data['priority']) && trim((string) $data['priority']) !== '';

if (!$hasStatus && !$hasPriority) {
    send_json(422, [
        'success' => false,
        'message' => 'At least one of status or priority is required.'
    ]);
}

$adminUser = require_admin($conn, $adminUserId);
$currentTicket = fetch_ticket_with_context($conn, $ticketId);

if (!$currentTicket) {
    send_json(404, [
        'success' => false,
        'message' => 'Ticket not found.'
    ]);
}

$nextStatus = $currentTicket['status'];
$nextPriority = $currentTicket['priority'];
$nextSlaDeadline = $currentTicket['sla_deadline'] ?: calculate_sla_deadline($currentTicket['priority']);

if ($hasStatus) {
    $nextStatus = trim($data['status']);
    if (!in_array($nextStatus, $allowedStatuses, true)) {
        send_json(422, [
            'success' => false,
            'message' => 'Invalid status value.'
        ]);
    }
}

if ($hasPriority) {
    $nextPriority = trim($data['priority']);
    if (!in_array($nextPriority, $allowedPriorities, true)) {
        send_json(422, [
            'success' => false,
            'message' => 'Invalid priority value.'
        ]);
    }

    $nextSlaDeadline = calculate_sla_deadline($nextPriority);
}

$statusChanged = $currentTicket['status'] !== $nextStatus;
$priorityChanged = $currentTicket['priority'] !== $nextPriority;

if (!$statusChanged && !$priorityChanged) {
    send_json(200, [
        'success' => true,
        'message' => 'No changes were applied.',
        'ticket' => $currentTicket
    ]);
}

$conn->begin_transaction();

try {
    $statement = $conn->prepare('UPDATE tickets SET status = ?, priority = ?, sla_deadline = ? WHERE id = ?');
    $statement->bind_param('sssi', $nextStatus, $nextPriority, $nextSlaDeadline, $ticketId);

    if (!$statement->execute()) {
        throw new Exception($statement->error);
    }

    $statement->close();

    if ($statusChanged) {
        create_activity_log($conn, $ticketId, "Status changed to {$nextStatus}", build_actor_label($adminUser));
    }

    if ($priorityChanged) {
        create_activity_log($conn, $ticketId, "Priority changed to {$nextPriority}", build_actor_label($adminUser));
    }

    $conn->commit();

    $updatedTicket = fetch_ticket_with_context($conn, $ticketId);
    if ($statusChanged && $updatedTicket) {
        notify_ticket_status_changed($updatedTicket);
    }

    send_json(200, [
        'success' => true,
        'message' => 'Ticket updated successfully.',
        'ticket' => $updatedTicket
    ]);
} catch (Exception $exception) {
    $conn->rollback();
    send_json(500, [
        'success' => false,
        'message' => 'Failed to update ticket.',
        'error' => $exception->getMessage()
    ]);
}
?>