require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Change to your MySQL username
    password: 'yourpassword', // Change to your MySQL password
    database: 'user_management'
});

db.connect(err => {
    if (err) throw err;
    console.log("✅ Connected to MySQL Database");
});

// User Registration
app.post('/register', async (req, res) => {
    const { username, password, dob, occupation, first_name, last_name } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO user_login (username, password, dob, occupation, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [username, hashedPassword, dob, occupation, first_name, last_name], (err, result) => {
        if (err) return res.status(400).json({ message: "Username already exists!" });
        res.status(201).json({ message: "User registered successfully!" });
    });
});

// User Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query("SELECT * FROM user_login WHERE username = ?", [username], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ message: "Invalid username or password!" });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid username or password!" });

        // Generate JWT token
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    });
});

// Get All Users (Protected)
app.get('/users', (req, res) => {
    db.query("SELECT username, dob, occupation, first_name, last_name FROM user_login", (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(results);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
