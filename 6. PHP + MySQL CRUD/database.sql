-- Create Database
CREATE DATABASE IF NOT EXISTS user_management;
USE user_management;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    age INT NOT NULL CHECK (age >= 18 AND age <= 120),
    address VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for better performance
    INDEX idx_email (email),
    INDEX idx_name (name),
    INDEX idx_phone (phone),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Data
INSERT INTO users (name, email, phone, age, address) VALUES
('John Doe', 'john@example.com', '+1-234-567-8900', 28, '123 Main Street, New York, NY 10001'),
('Jane Smith', 'jane@example.com', '+1-234-567-8901', 32, '456 Oak Avenue, Los Angeles, CA 90001'),
('Michael Johnson', 'michael@example.com', '+1-234-567-8902', 25, '789 Pine Road, Chicago, IL 60601'),
('Emily Brown', 'emily@example.com', '+1-234-567-8903', 35, '321 Elm Boulevard, Houston, TX 77001'),
('David Wilson', 'david@example.com', '+1-234-567-8904', 29, '654 Maple Lane, Phoenix, AZ 85001');
