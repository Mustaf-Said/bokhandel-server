import express from 'express';
import db from '../db.js';

const router = express.Router();

// 🔹 GET: Hämta alla beställningar med boktitlar
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT k.KundID, k.Namn, b.Titel, bb.Antal, be.Datum
      FROM kunder k
      JOIN beställningar be ON k.KundID = be.KundID
      JOIN beställning_böcker bb ON be.BeställningID = bb.BeställningID
      JOIN böcker b ON bb.BokID = b.BokID
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 POST: Skapa ny beställning med böcker
router.post('/', async (req, res) => {
  const { KundID, Datum, Bocker } = req.body;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Skapa beställning
    const [bestallningResult] = await conn.query(
      'INSERT INTO beställningar (KundID, Datum) VALUES (?, ?)',
      [KundID, Datum]
    );

    const BeställningID = bestallningResult.insertId;

    // 2. Lägg till böcker
    for (const bok of Bocker) {
      await conn.query(
        'INSERT INTO beställning_böcker (BeställningID, BokID, Antal) VALUES (?, ?, ?)',
        [BeställningID, bok.BokID, bok.Antal]
      );
    }

    await conn.commit();
    res.status(201).json({ message: 'Beställning skapad', BeställningID });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

export default router;

