<?php
require_once 'config.php';

$userId = $_GET['id'] ?? null;

if (!$userId || !is_numeric($userId)) {
    $_SESSION['error'] = 'Invalid user ID';
    header('Location: index.php');
    exit;
}

$user = new User($pdo);
$userData = $user->getById($userId);

if (!$userData) {
    $_SESSION['error'] = 'User not found';
    header('Location: index.php');
    exit;
}

// Delete the user
$result = $user->delete($userId);

if ($result['valid']) {
    $_SESSION['message'] = $result['message'];
} else {
    $_SESSION['error'] = $result['error'];
}

header('Location: index.php');
exit;
?>
