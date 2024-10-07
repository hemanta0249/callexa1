const express = require('express');
const db = require('../models/Users'); // Assuming this is the MySQL connection file
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchUsers');

const JWT_SECRET = "Hemantisagoodboy@";

// Route 1 - Creating users
router.post('/createusers', [
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', "Enter a valid email").isEmail(),
    body('password', "Enter at least 5 digits password").isLength({ min: 5 })
], async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        const { name, email, password } = req.body;

        // Check if user with this email already exists
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Database error occurred");
            }

            if (results.length > 0) {
                success = false;
                return res.status(400).json({ success, error: "This email ID already exists" });
            }

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const securePass = await bcrypt.hash(password, salt);

            // Insert new user into MySQL
            db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, securePass], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Database error occurred");
                }

                const data = {
                    user: {
                        id: result.insertId
                    }
                };

                const authToken = jwt.sign(data, JWT_SECRET);
                success = true;
                res.json({ success, authToken });
            });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal error occurred");
    }
});

// Route 2 - Login router
router.post('/login', [
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password cannot be blank").isLength({ min: 5 })
], async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Check if user with this email exists
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Database error occurred");
            }

            if (results.length === 0) {
                return res.status(400).json({ success, error: "Please try to login with correct credentials" });
            }

            const user = results[0];

            // Compare password with hashed password
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                success = false;
                return res.status(400).json({ success, error: "Please try to login with correct credentials" });
            }

            const data = {
                user: {
                    id: user.id
                }
            };

            success = true;
            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({ success, authToken });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal error occurred");
    }
});

// Route 3 - Get user data
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Select user details excluding the password
        db.query('SELECT id, name, email, date FROM users WHERE id = ?', [userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Database error occurred");
            }

            if (results.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            res.json(results[0]);
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal error occurred");
    }
});

module.exports = router;
