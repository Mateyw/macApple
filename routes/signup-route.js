const express = require('express');
const bcrypt = require('bcryptjs');
const connection = require('../database/db-connection'); // Assuming you have a database connection module
const router = express.Router();

router.post('/signup', async (req, res) => {
    const {username, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    let error = null;
    let success = null;

    // Check if username already exists
    connection.query(
        'SELECT id FROM users WHERE username = ?',
        [username],
        (err, results) => {
            if (err) {
                return res.status(500).send('Database error: ' + err.message);
            }

            if (results.length > 0) {
                // If username exists
                res.render('signup.ejs', {
                    error: 'Username already exists. Please choose another one.',
                });
            } else {
                // Insert new user
                connection.query(
                    'INSERT INTO users (username, password) VALUES (?, ?)',
                    [username, hashedPassword],
                    (err, result) => {
                        if (err) {
                            return res
                                .status(500)
                                .send('Database error: ' + err.message);
                        }
                        res.render('signup.ejs', {
                            success: 'Registration successful!', error, success
                        });
                    },
                );
            }
        },
    );
});

module.exports = router;
