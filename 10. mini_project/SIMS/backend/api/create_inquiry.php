<?php
require_once 'db.php';
ensure_ticketing_schema($conn);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(405, [
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
}

$data = get_request_data();
require_fields($data, ['user_id', 'subject', 'message', 'category']);

$userId = (int) $data['user_id'];
$subject = trim($data['subject']);
$message = trim($data['message']);
$category = trim($data['category']);
$priority = 'Medium';

$user = fetch_user_by_id($conn, $userId);
if (!$user) {
    send_json(404, [
        'success' => false,
        'message' => 'User not found.'
    ]);
}

$conn->begin_transaction();

try {
    $attachmentPath = save_attachment_upload('attachment');

    $inquiryStatement = $conn->prepare(
        'INSERT INTO inquiries (user_id, subject, message, category, attachment_path) VALUES (?, ?, ?, ?, ?)'
    );
    $inquiryStatement->bind_param('issss', $userId, $subject, $message, $category, $attachmentPath);

    if (!$inquiryStatement->execute()) {
        throw new Exception($inquiryStatement->error);
    }

    $inquiryId = $inquiryStatement->insert_id;
    $inquiryStatement->close();

    $status = 'Open';
    $slaDeadline = calculate_sla_deadline($priority);
    $ticketStatement = $conn->prepare('INSERT INTO tickets (inquiry_id, status, priority, sla_deadline) VALUES (?, ?, ?, ?)');
    $ticketStatement->bind_param('isss', $inquiryId, $status, $priority, $slaDeadline);

    if (!$ticketStatement->execute()) {
        throw new Exception($ticketStatement->error);
    }

    $ticketId = $ticketStatement->insert_id;
    $ticketStatement->close();

    create_activity_log($conn, $ticketId, 'Ticket created', build_actor_label($user));

    if ($attachmentPath) {
        create_activity_log($conn, $ticketId, 'Attachment added', build_actor_label($user));
    }

    $conn->commit();

    $ticket = fetch_ticket_with_context($conn, $ticketId);
    if ($ticket) {
        notify_ticket_submitted($ticket);
    }

    send_json(201, [
        'success' => true,
        'message' => 'Inquiry submitted successfully.',
        'ticket' => [
            'ticket_id' => $ticketId,
            'inquiry_id' => $inquiryId,
            'status' => $status,
            'priority' => $priority,
            'sla_deadline' => $slaDeadline,
            'attachment_path' => $attachmentPath
        ]
    ]);
} catch (Exception $exception) {
    $conn->rollback();
    send_json(500, [
        'success' => false,
        'message' => 'Failed to create inquiry.',
        'error' => $exception->getMessage()
    ]);
}
?>