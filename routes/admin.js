const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../config/db');

// Admin Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM admins WHERE username = ?', [username], (err, results) => {
        if (err || results.length === 0) return res.status(401).send('Unauthorized');
        const admin = results[0];
        if (bcrypt.compareSync(password, admin.password)) {
            req.session.adminId = admin.id;
            return res.send('Admin logged in successfully');
        }
        return res.status(401).send('Unauthorized');
    });
});

// Manage Doctors
router.post('/doctors', (req, res) => {
    const { name, specialization, availability } = req.body;
    db.query('INSERT INTO doctors (name, specialization, availability) VALUES (?, ?, ?)', 
    [name, specialization, availability], (err) => {
        if (err) return res.status(500).send(err);
        res.status(201).send('Doctor added successfully');
    });
});

// View all patients
router.get('/patients', (req, res) => {
    db.query('SELECT * FROM patients', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

module.exports = router;
