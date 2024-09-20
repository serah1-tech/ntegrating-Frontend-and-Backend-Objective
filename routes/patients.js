const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../config/db');

// Register a new patient
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.query('INSERT INTO patients (name, email, password) VALUES (?, ?, ?)', 
    [name, email, hashedPassword], (err) => {
        if (err) return res.status(500).send(err);
        res.status(201).send('Patient registered successfully');
    });
});

// Patient Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM patients WHERE email = ?', [email], (err, results) => {
        if (err || results.length === 0) return res.status(401).send('Unauthorized');
        const patient = results[0];
        if (bcrypt.compareSync(password, patient.password)) {
            req.session.patientId = patient.id;
            return res.send('Patient logged in successfully');
        }
        return res.status(401).send('Unauthorized');
    });
});

// Get all patients (Admin only)
router.get('/', (req, res) => {
    db.query('SELECT * FROM patients', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Update patient profile
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    db.query('UPDATE patients SET name = ? WHERE id = ?', [name, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Patient updated successfully');
    });
});

// Delete a patient
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM patients WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Patient deleted successfully');
    });
});

module.exports = router;
