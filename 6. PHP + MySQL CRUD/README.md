# PHP CRUD User Management System

A complete CRUD application built with PHP and MySQL featuring secure database operations, data validation, sessions, and cookies.

## 🎯 Features

### Core CRUD Operations
- ✅ **Create**: Add new users with form validation
- ✅ **Read**: View all users or search by name/email/phone
- ✅ **Update**: Edit existing user information
- ✅ **Delete**: Remove users from database

### Security Features
- 🔒 **Prepared Statements**: Prevents SQL injection attacks
- ✅ **Input Validation**: Server-side validation for all fields
- 🍪 **Secure Cookies**: HTTP-only cookies for remember me functionality
- 📋 **Sessions**: Session management with timeout (30 minutes)
- 🛡️ **XSS Protection**: HTML entities encoding

### Data Validation
- **Name**: 2-50 characters, letters and spaces only
- **Email**: Valid email format, unique constraint
- **Phone**: 10-20 characters, numbers, +, and - allowed
- **Age**: 18-120 years
- **Address**: 5-200 characters

### User Experience
- 🎨 Beautiful responsive design
- 🔍 Search functionality (name, email, phone)
- 💬 Session messages for user feedback
- 🕐 Last visit tracking with cookies
- 📊 User count display
- 🎬 Smooth animations and transitions

## 📋 Setup Instructions

### Step 1: Create Database
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Create a new database named `user_management`
3. Import the `database.sql` file:
   - Click on the `user_management` database
   - Go to "Import" tab
   - Select and upload `database.sql`
   - Click "Import"

**OR** Run this SQL directly in phpMyAdmin SQL tab:
```sql
CREATE DATABASE IF NOT EXISTS user_management;
USE user_management;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    age INT NOT NULL CHECK (age >= 18 AND age <= 120),
    address VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_name (name),
    INDEX idx_phone (phone),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (name, email, phone, age, address) VALUES
('John Doe', 'john@example.com', '+1-234-567-8900', 28, '123 Main Street, New York, NY 10001'),
('Jane Smith', 'jane@example.com', '+1-234-567-8901', 32, '456 Oak Avenue, Los Angeles, CA 90001'),
('Michael Johnson', 'michael@example.com', '+1-234-567-8902', 25, '789 Pine Road, Chicago, IL 60601'),
('Emily Brown', 'emily@example.com', '+1-234-567-8903', 35, '321 Elm Boulevard, Houston, TX 77001'),
('David Wilson', 'david@example.com', '+1-234-567-8904', 29, '654 Maple Lane, Phoenix, AZ 85001');
```

### Step 2: Configure Database Connection
1. Open `config.php`
2. Update database credentials if needed:
   - `DB_HOST`: `localhost` (default)
   - `DB_USER`: `root` (default for XAMPP)
   - `DB_PASS`: `` (empty for XAMPP)
   - `DB_NAME`: `user_management`

### Step 3: Access the Application
1. Make sure XAMPP is running (Apache + MySQL)
2. Open browser and navigate to:
   ```
   http://localhost/Sample/MDM%20exp/6.%20PHP%20+%20MySQL%20CRUD/
   ```

## 📁 File Structure

```
6. PHP + MySQL CRUD/
├── index.php          # Main dashboard - List all users
├── create.php         # Add new user form
├── edit.php          # Edit user form
├── delete.php        # Delete user handler
├── config.php        # Database config & classes
├── database.sql      # Database setup script
└── README.md         # This file
```

## 🔧 Key Classes & Functions

### User Class
```php
$user = new User($pdo);

// Create
$user->create(['name', 'email', 'phone', 'age', 'address'])

// Read
$user->getAll()
$user->getById($id)
$user->search($query)

// Update
$user->update($id, ['name', 'email', 'phone', 'age', 'address'])

// Delete
$user->delete($id)
```

### Validator Class
```php
Validator::validateName($name)
Validator::validateEmail($email)
Validator::validatePhone($phone)
Validator::validateAge($age)
Validator::validateAddress($address)
```

## 🚀 Usage Examples

### Add a User
1. Click "➕ Add New User" button
2. Fill in all required fields
3. Click "✅ Create User"

### View Users
- Dashboard shows all users in table format
- See ID, Name, Email, Phone, Age, Address, Created Date

### Search Users
1. Enter search term in search box
2. Search by name, email, or phone number
3. Click "🔍 Search" button

### Edit User
1. Click "Edit" button next to user
2. Modify fields
3. Click "✅ Update User"

### Delete User
1. Click "Delete" button
2. Confirm deletion
3. User is removed from database

## 🔐 Security Features Explained

### Prepared Statements
```php
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$id]);
```
Prevents SQL injection by separating SQL code from data.

### Input Validation
- Server-side validation on all inputs
- Type checking and length limits
- Regex pattern matching for specific formats

### XSS Protection
```php
htmlspecialchars($user['name'])
```
Converts special characters to HTML entities.

### Session Security
- 30-minute inactivity timeout
- Automatic session regeneration
- HTTP-only cookies (no JavaScript access)

## 🎨 Customization

### Database Credentials
Edit `config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_user');
define('DB_PASS', 'your_password');
define('DB_NAME', 'your_database');
```

### Session Timeout
Edit `config.php`:
```php
$session_timeout = 1800; // 30 minutes in seconds
```

### Validation Rules
Modify `Validator` class methods in `config.php` to change:
- Name length and format
- Phone length and format
- Age range
- Address length

## 📱 Responsive Design
The application is fully responsive and works on:
- 🖥️ Desktop (1200px+)
- 💻 Tablet (768px - 1199px)
- 📱 Mobile (< 768px)

## ⚠️ Troubleshooting

### Database Connection Failed
- Check if MySQL is running in XAMPP
- Verify database credentials in `config.php`
- Ensure `user_management` database exists

### No Users Displayed
- Import `database.sql` to add sample data
- Check database connection
- Verify users table exists

### 404 Error
- Check URL path (case-sensitive on some servers)
- Verify files are in correct directory

### Validation Errors
- Check form field requirements in `create.php`/`edit.php`
- Review validation rules in `Validator` class

## 📝 License
This project is provided as-is for educational purposes.

## 🙋 Support
For issues or questions, review the code comments and validation rules in `config.php`.
