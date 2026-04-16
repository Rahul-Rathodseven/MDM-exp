<?php
require_once "db.php";
ensure_users_schema($conn);

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    send_json(405, [
        "success" => false,
        "message" => "Method not allowed."
    ]);
}

$data = get_json_input();
require_fields($data, ["name", "email", "password"]);

$name = trim($data["name"]);
$email = trim($data["email"]);
$password = $data["password"];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_json(422, [
        "success" => false,
        "message" => "Please provide a valid email address."
    ]);
}

if (strlen($password) < 6) {
    send_json(422, [
        "success" => false,
        "message" => "Password must be at least 6 characters long."
    ]);
}

$checkStatement = $conn->prepare("SELECT id FROM users WHERE email = ?");
$checkStatement->bind_param("s", $email);
$checkStatement->execute();
$existingUser = $checkStatement->get_result()->fetch_assoc();
$checkStatement->close();

if ($existingUser) {
    send_json(409, [
        "success" => false,
        "message" => "An account with this email already exists."
    ]);
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$role = "user";

$statement = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
$statement->bind_param("ssss", $name, $email, $hashedPassword, $role);

if (!$statement->execute()) {
    $error = $statement->error;
    $statement->close();

    send_json(500, [
        "success" => false,
        "message" => "Registration failed.",
        "error" => $error
    ]);
}

$userId = $statement->insert_id;
$statement->close();

$user = build_session_user(fetch_user_by_id($conn, $userId), [
    "id" => $userId,
    "name" => $name,
    "email" => $email,
    "role" => $role
]);

if (!$user) {
    send_json(500, [
        "success" => false,
        "message" => "Registration succeeded, but the user session could not be prepared."
    ]);
}

send_json(201, [
    "success" => true,
    "message" => "Registration successful.",
    "user" => $user
]);
?>