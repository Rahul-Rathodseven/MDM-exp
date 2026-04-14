<?php
require_once 'config.php';

$errors = [];
$formData = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $formData = [
        'name' => $_POST['name'] ?? '',
        'email' => $_POST['email'] ?? '',
        'phone' => $_POST['phone'] ?? '',
        'age' => $_POST['age'] ?? '',
        'address' => $_POST['address'] ?? ''
    ];

    $user = new User($pdo);
    $result = $user->create($formData);

    if ($result['valid']) {
        $_SESSION['message'] = $result['message'];
        header('Location: index.php');
        exit;
    } else {
        $errors[] = $result['error'];
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add New User - User Management</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
            padding: 40px;
            animation: slideIn 0.4s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .header {
            margin-bottom: 30px;
            text-align: center;
        }

        .header h1 {
            color: #333;
            font-size: 28px;
            margin-bottom: 10px;
        }

        .header p {
            color: #666;
            font-size: 14px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 600;
            font-size: 14px;
        }

        input, textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 5px;
            font-size: 14px;
            font-family: inherit;
            transition: all 0.3s;
        }

        input:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.2);
        }

        textarea {
            resize: vertical;
            min-height: 100px;
        }

        .form-hint {
            font-size: 12px;
            color: #999;
            margin-top: 5px;
        }

        .alert {
            padding: 12px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid;
        }

        .alert-error {
            background: #fed7d7;
            border-color: #f56565;
            color: #742a2a;
        }

        .form-actions {
            display: flex;
            gap: 10px;
            margin-top: 30px;
        }

        button, .btn {
            flex: 1;
            padding: 14px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-submit {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-cancel {
            background: #e0e0e0;
            color: #333;
            text-decoration: none;
        }

        .btn-cancel:hover {
            background: #d0d0d0;
        }

        .required {
            color: #f56565;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>➕ Add New User</h1>
            <p>Fill in the form to create a new user account</p>
        </div>

        <?php if (!empty($errors)): ?>
            <?php foreach ($errors as $error): ?>
                <div class="alert alert-error">
                    ❌ <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>

        <form method="POST" novalidate>
            <div class="form-group">
                <label for="name">Full Name <span class="required">*</span></label>
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value="<?php echo htmlspecialchars($formData['name'] ?? ''); ?>"
                    placeholder="John Doe"
                    required
                >
                <div class="form-hint">Letters and spaces only, 2-50 characters</div>
            </div>

            <div class="form-group">
                <label for="email">Email <span class="required">*</span></label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value="<?php echo htmlspecialchars($formData['email'] ?? ''); ?>"
                    placeholder="john@example.com"
                    required
                >
                <div class="form-hint">Must be a valid email address</div>
            </div>

            <div class="form-group">
                <label for="phone">Phone <span class="required">*</span></label>
                <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value="<?php echo htmlspecialchars($formData['phone'] ?? ''); ?>"
                    placeholder="+1-234-567-8900"
                    required
                >
                <div class="form-hint">10-20 characters including numbers, +, and -</div>
            </div>

            <div class="form-group">
                <label for="age">Age <span class="required">*</span></label>
                <input 
                    type="number" 
                    id="age" 
                    name="age" 
                    value="<?php echo htmlspecialchars($formData['age'] ?? ''); ?>"
                    placeholder="25"
                    min="18"
                    max="120"
                    required
                >
                <div class="form-hint">Must be between 18 and 120 years</div>
            </div>

            <div class="form-group">
                <label for="address">Address <span class="required">*</span></label>
                <textarea 
                    id="address" 
                    name="address" 
                    placeholder="123 Main Street, City, Country"
                    required
                ><?php echo htmlspecialchars($formData['address'] ?? ''); ?></textarea>
                <div class="form-hint">5-200 characters</div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-submit">✅ Create User</button>
                <a href="index.php" class="btn btn-cancel">❌ Cancel</a>
            </div>
        </form>
    </div>
</body>
</html>
