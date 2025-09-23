import express from 'express';
import db from '../db.js';

const router = express.Router();

// Hämta total kostnad per kund
router.get('/total-kostnad', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT k.KundID, k.Namn, SUM(bb.Antal * b.Pris) AS TotalPris
      FROM kunder k
      JOIN beställningar be ON k.KundID = be.KundID
      JOIN beställning_böcker bb ON be.BeställningID = bb.BeställningID
      JOIN böcker b ON bb.BokID = b.BokID
      GROUP BY k.KundID, k.Namn
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
