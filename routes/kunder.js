const express = require('express');
const router = express.Router();
const db = require('../db');

// Hämta alla kunder
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM kunder');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lägg till ny kund
router.post('/', async (req, res) => {
  const { Namn, Email, Mobile } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO kunder (Namn, Email, Mobile) VALUES (?, ?, ?)',
      [Namn, Email, Mobile]
    );
    res.status(201).json({ message: 'Kund tillagd', KundID: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
