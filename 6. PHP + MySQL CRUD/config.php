<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'user_management');

// Try to connect to database
try {
    $pdo = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Database Connection Failed: " . $e->getMessage());
}

// Session Configuration
session_start();
$session_timeout = 1800; // 30 minutes

// Check session timeout
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $session_timeout)) {
    session_destroy();
    $_SESSION = array();
}

$_SESSION['last_activity'] = time();

// Set secure cookie settings
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_samesite', 'Strict');

// Validation class
class Validator {
    public static function validateName($name) {
        $name = trim($name);
        if (empty($name) || strlen($name) < 2 || strlen($name) > 50) {
            return ['valid' => false, 'error' => 'Name must be between 2 and 50 characters'];
        }
        if (!preg_match('/^[a-zA-Z\s]+$/', $name)) {
            return ['valid' => false, 'error' => 'Name can only contain letters and spaces'];
        }
        return ['valid' => true, 'data' => $name];
    }

    public static function validateEmail($email) {
        $email = trim(strtolower($email));
        if (empty($email)) {
            return ['valid' => false, 'error' => 'Email is required'];
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['valid' => false, 'error' => 'Invalid email format'];
        }
        if (strlen($email) > 100) {
            return ['valid' => false, 'error' => 'Email is too long'];
        }
        return ['valid' => true, 'data' => $email];
    }

    public static function validatePhone($phone) {
        $phone = preg_replace('/[^0-9+-]/', '', $phone);
        if (empty($phone) || strlen($phone) < 10 || strlen($phone) > 20) {
            return ['valid' => false, 'error' => 'Phone must be between 10 and 20 characters'];
        }
        return ['valid' => true, 'data' => $phone];
    }

    public static function validateAge($age) {
        $age = intval($age);
        if ($age < 18 || $age > 120) {
            return ['valid' => false, 'error' => 'Age must be between 18 and 120'];
        }
        return ['valid' => true, 'data' => $age];
    }

    public static function validateAddress($address) {
        $address = trim($address);
        if (empty($address) || strlen($address) < 5 || strlen($address) > 200) {
            return ['valid' => false, 'error' => 'Address must be between 5 and 200 characters'];
        }
        return ['valid' => true, 'data' => $address];
    }
}

// User class
class User {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($data) {
        $validations = [
            'name' => Validator::validateName($data['name'] ?? ''),
            'email' => Validator::validateEmail($data['email'] ?? ''),
            'phone' => Validator::validatePhone($data['phone'] ?? ''),
            'age' => Validator::validateAge($data['age'] ?? ''),
            'address' => Validator::validateAddress($data['address'] ?? '')
        ];

        foreach ($validations as $field => $result) {
            if (!$result['valid']) {
                return $result;
            }
        }

        // Check if email already exists
        $checkEmail = $this->pdo->prepare("SELECT id FROM users WHERE email = ?");
        $checkEmail->execute([$validations['email']['data']]);
        if ($checkEmail->rowCount() > 0) {
            return ['valid' => false, 'error' => 'Email already exists'];
        }

        try {
            $sql = "INSERT INTO users (name, email, phone, age, address, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                $validations['name']['data'],
                $validations['email']['data'],
                $validations['phone']['data'],
                $validations['age']['data'],
                $validations['address']['data']
            ]);
            return ['valid' => true, 'message' => 'User created successfully'];
        } catch (PDOException $e) {
            return ['valid' => false, 'error' => 'Database error: ' . $e->getMessage()];
        }
    }

    public function getAll() {
        try {
            $sql = "SELECT * FROM users ORDER BY created_at DESC";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            return [];
        }
    }

    public function getById($id) {
        try {
            $sql = "SELECT * FROM users WHERE id = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$id]);
            return $stmt->fetch();
        } catch (PDOException $e) {
            return null;
        }
    }

    public function update($id, $data) {
        $user = $this->getById($id);
        if (!$user) {
            return ['valid' => false, 'error' => 'User not found'];
        }

        $validations = [
            'name' => Validator::validateName($data['name'] ?? $user['name']),
            'email' => Validator::validateEmail($data['email'] ?? $user['email']),
            'phone' => Validator::validatePhone($data['phone'] ?? $user['phone']),
            'age' => Validator::validateAge($data['age'] ?? $user['age']),
            'address' => Validator::validateAddress($data['address'] ?? $user['address'])
        ];

        foreach ($validations as $field => $result) {
            if (!$result['valid']) {
                return $result;
            }
        }

        // Check if email already exists (excluding current user)
        $checkEmail = $this->pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
        $checkEmail->execute([$validations['email']['data'], $id]);
        if ($checkEmail->rowCount() > 0) {
            return ['valid' => false, 'error' => 'Email already exists'];
        }

        try {
            $sql = "UPDATE users SET name = ?, email = ?, phone = ?, age = ?, address = ?, updated_at = NOW() WHERE id = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                $validations['name']['data'],
                $validations['email']['data'],
                $validations['phone']['data'],
                $validations['age']['data'],
                $validations['address']['data'],
                $id
            ]);
            return ['valid' => true, 'message' => 'User updated successfully'];
        } catch (PDOException $e) {
            return ['valid' => false, 'error' => 'Database error: ' . $e->getMessage()];
        }
    }

    public function delete($id) {
        try {
            $sql = "DELETE FROM users WHERE id = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$id]);
            if ($stmt->rowCount() > 0) {
                return ['valid' => true, 'message' => 'User deleted successfully'];
            }
            return ['valid' => false, 'error' => 'User not found'];
        } catch (PDOException $e) {
            return ['valid' => false, 'error' => 'Database error: ' . $e->getMessage()];
        }
    }

    public function search($query) {
        try {
            $searchTerm = '%' . $query . '%';
            $sql = "SELECT * FROM users WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? ORDER BY created_at DESC";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$searchTerm, $searchTerm, $searchTerm]);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            return [];
        }
    }
}

// Set session message if it exists
if (!isset($_SESSION['message'])) {
    $_SESSION['message'] = null;
}
if (!isset($_SESSION['error'])) {
    $_SESSION['error'] = null;
}

// Set a remember me cookie if user visits
if (!isset($_COOKIE['last_visit'])) {
    setcookie('last_visit', date('Y-m-d H:i:s'), time() + (30 * 24 * 60 * 60), '/');
} else {
    $_SESSION['last_visit'] = $_COOKIE['last_visit'];
}

// Update last visit
setcookie('last_visit', date('Y-m-d H:i:s'), time() + (30 * 24 * 60 * 60), '/');

?>
