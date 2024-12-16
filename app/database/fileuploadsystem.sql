-- database
CREATE DATABASE file_upload_system;
USE file_upload_system;

-- users table
CREATE TABLE users (
    id INT AUTO_INCREMENT NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

--user_profile table
CREATE TABLE user_profile (
    id INT AUTO_INCREMENT NOT NULL,
    user_id INT NOT NULL,
    cover_photo VARCHAR(255),
    profile_image VARCHAR(255),
    full_name VARCHAR(255) DEFAULT 'User',
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- files table
CREATE TABLE files (
    id INT AUTO_INCREMENT NOT NULL,
    user_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
