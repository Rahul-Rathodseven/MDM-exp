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
require_fields($data, ["email", "password"]);

$email = trim($data["email"]);
$password = $data["password"];

$statement = $conn->prepare("SELECT id, name, email, password, role, created_at FROM users WHERE email = ?");
$statement->bind_param("s", $email);
$statement->execute();
$result = $statement->get_result();
$user = $result->fetch_assoc();
$statement->close();

if (!$user || !password_verify($password, $user["password"])) {
    send_json(401, [
        "success" => false,
        "message" => "Invalid email or password."
    ]);
}

unset($user["password"]);
$sessionUser = build_session_user($user, [
    "email" => $email,
    "role" => "user"
]);

if (!$sessionUser) {
    send_json(500, [
        "success" => false,
        "message" => "Login succeeded, but the user session could not be prepared."
    ]);
}

send_json(200, [
    "success" => true,
    "message" => "Login successful.",
    "user" => $sessionUser
]);
?>