-- Create a database
CREATE DATABASE HealthyYou;

-- Use the database
USE HealthyYou;

-- Create a table for users
CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    UserName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a table for health records
CREATE TABLE HealthRecords (
    RecordID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    RecordDate DATE NOT NULL,
    Weight DECIMAL(5, 2),
    Height DECIMAL(5, 2),
    BloodPressure VARCHAR(20),
    Notes TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Insert sample data into Users table
INSERT INTO Users (UserName, Email, PasswordHash) VALUES
('John Doe', 'john.doe@example.com', 'hashedpassword1'),
('Jane Smith', 'jane.smith@example.com', 'hashedpassword2');

-- Insert sample data into HealthRecords table
INSERT INTO HealthRecords (UserID, RecordDate, Weight, Height, BloodPressure, Notes) VALUES
(1, '2023-01-01', 70.5, 175.3, '120/80', 'Feeling good'),
(2, '2023-01-02', 65.0, 160.0, '110/70', 'Regular checkup');