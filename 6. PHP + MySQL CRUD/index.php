<?php
require_once 'config.php';

$user = new User($pdo);
$users = [];
$search_query = '';

// Handle search
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['search'])) {
    $search_query = $_POST['search'] ?? '';
    if (!empty($search_query)) {
        $users = $user->search($search_query);
    }
} else {
    $users = $user->getAll();
}

// Get message from session
$message = $_SESSION['message'] ?? null;
$error = $_SESSION['error'] ?? null;
$_SESSION['message'] = null;
$_SESSION['error'] = null;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management - PHP CRUD</title>
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
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            background: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .header h1 {
            color: #333;
            margin-bottom: 5px;
            font-size: 32px;
        }

        .header p {
            color: #666;
            font-size: 14px;
        }

        .session-info {
            background: #f0f4ff;
            border-left: 4px solid #667eea;
            padding: 12px;
            border-radius: 4px;
            margin-top: 15px;
            font-size: 13px;
            color: #333;
        }

        .session-info strong {
            color: #667eea;
        }

        .controls {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }

        .btn {
            padding: 12px 25px;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-danger {
            background: #f56565;
            color: white;
        }

        .btn-danger:hover {
            background: #e53e3e;
        }

        .btn-warning {
            background: #ecc94b;
            color: #333;
        }

        .btn-warning:hover {
            background: #d6bc21;
        }

        .search-box {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            display: flex;
            gap: 10px;
        }

        .search-box input {
            flex: 1;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 5px;
            font-size: 14px;
        }

        .search-box input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.2);
        }

        .alert {
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .alert-success {
            background: #c6f6d5;
            border: 2px solid #48bb78;
            color: #22543d;
        }

        .alert-error {
            background: #fed7d7;
            border: 2px solid #f56565;
            color: #742a2a;
        }

        .table-responsive {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        td {
            padding: 15px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 14px;
        }

        tbody tr:hover {
            background: #f7f7f7;
        }

        .action-buttons {
            display: flex;
            gap: 8px;
        }

        .btn-small {
            padding: 6px 12px;
            font-size: 12px;
            border-radius: 4px;
            text-decoration: none;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
        }

        .btn-edit {
            background: #4299e1;
            color: white;
        }

        .btn-edit:hover {
            background: #3182ce;
            transform: translateY(-1px);
        }

        .btn-delete {
            background: #f56565;
            color: white;
        }

        .btn-delete:hover {
            background: #e53e3e;
            transform: translateY(-1px);
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #666;
        }

        .empty-state svg {
            width: 80px;
            height: 80px;
            margin-bottom: 20px;
            opacity: 0.5;
        }

        .user-count {
            background: white;
            padding: 15px 20px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #666;
        }

        .user-count strong {
            color: #667eea;
            font-weight: 700;
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 24px;
            }

            table {
                font-size: 12px;
            }

            th, td {
                padding: 10px;
            }

            .controls {
                flex-direction: column;
            }

            .search-box {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>👥 User Management System</h1>
            <p>Complete CRUD operations with PHP and MySQL</p>
            <div class="session-info">
                <strong>Session Status:</strong> Active | 
                <strong>Users in Database:</strong> <span id="userCount"><?php echo count($user->getAll()); ?></span> | 
                <strong>Last Visit:</strong> <?php echo $_SESSION['last_visit'] ?? 'First visit'; ?>
            </div>
        </div>

        <div class="controls">
            <a href="create.php" class="btn btn-primary">➕ Add New User</a>
            <a href="index.php" class="btn btn-warning">🔄 Reset Search</a>
        </div>

        <?php if ($message): ?>
            <div class="alert alert-success">
                ✅ <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="alert alert-error">
                ❌ <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <div class="search-box">
            <form method="POST" style="display: flex; gap: 10px; width: 100%;">
                <input 
                    type="text" 
                    name="search" 
                    placeholder="Search by name, email, or phone..." 
                    value="<?php echo htmlspecialchars($search_query); ?>"
                    autocomplete="off"
                >
                <button type="submit" class="btn btn-primary">🔍 Search</button>
            </form>
        </div>

        <?php if (!empty($users)): ?>
            <div class="user-count">
                Showing <strong><?php echo count($users); ?></strong> user(s)
            </div>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Age</th>
                            <th>Address</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($users as $u): ?>
                            <tr>
                                <td>#<?php echo htmlspecialchars($u['id']); ?></td>
                                <td><?php echo htmlspecialchars($u['name']); ?></td>
                                <td><?php echo htmlspecialchars($u['email']); ?></td>
                                <td><?php echo htmlspecialchars($u['phone']); ?></td>
                                <td><?php echo htmlspecialchars($u['age']); ?></td>
                                <td><?php echo htmlspecialchars($u['address']); ?></td>
                                <td><?php echo date('M d, Y', strtotime($u['created_at'])); ?></td>
                                <td>
                                    <div class="action-buttons">
                                        <a href="edit.php?id=<?php echo $u['id']; ?>" class="btn btn-small btn-edit">Edit</a>
                                        <a href="delete.php?id=<?php echo $u['id']; ?>" class="btn btn-small btn-delete" onclick="return confirm('Are you sure?')">Delete</a>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php else: ?>
            <div class="table-responsive">
                <div class="empty-state">
                    <p>📭 No users found</p>
                    <p style="font-size: 13px; margin-top: 10px;">Add a new user or try a different search</p>
                </div>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>
