const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Database connection

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
    const { username, password, dob, occupation, first_name, last_name } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO user_login (username, password, dob, occupation, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)`;
        
        db.query(sql, [username, hashedPassword, dob, occupation, first_name, last_name], (err, result) => {
            if (err) return res.status(400).json({ message: "Username already exists!" });
            res.status(201).json({ message: "User registered successfully!" });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// User Login
router.post('/login', (req, res) => {
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
router.get('/users', (req, res) => {
    db.query("SELECT username, dob, occupation, first_name, last_name FROM user_login", (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(results);
    });
});

module.exports = router;
