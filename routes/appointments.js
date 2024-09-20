const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Book an appointment
router.post('/', (req, res) => {
    const { patient_id, doctor_id, appointment_date } = req.body;
    db.query('INSERT INTO appointments (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)', 
    [patient_id, doctor_id, appointment_date], (err) => {
        if (err) return res.status(500).send(err);
        res.status(201).send('Appointment booked successfully');
    });
});

// Get all appointments for a patient
router.get('/patient/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM appointments WHERE patient_id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Get all appointments for a doctor
router.get('/doctor/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM appointments WHERE doctor_id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Cancel an appointment
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE appointments SET status = "canceled" WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Appointment canceled successfully');
    });
});

module.exports = router;
