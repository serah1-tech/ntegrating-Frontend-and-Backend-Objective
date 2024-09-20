const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all doctors
router.get('/', (req, res) => {
    db.query('SELECT * FROM doctors', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Add a new doctor
router.post('/', (req, res) => {
    const { name, specialization, availability } = req.body;
    db.query('INSERT INTO doctors (name, specialization, availability) VALUES (?, ?, ?)', 
    [name, specialization, availability], (err) => {
        if (err) return res.status(500).send(err);
        res.status(201).send('Doctor added successfully');
    });
});

// Update a doctor's information
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, specialization, availability } = req.body;
    db.query('UPDATE doctors SET name = ?, specialization = ?, availability = ? WHERE id = ?',
    [name, specialization, availability, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Doctor updated successfully');
    });
});

// Delete a doctor
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM doctors WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Doctor deleted successfully');
    });
});

module.exports = router;
