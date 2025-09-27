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

// 🔹 POST: Skapa ny beställning med böcker och minska lagersaldo
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

    // 2. Lägg till böcker och uppdatera lager
    for (const bok of Bocker) {
      const { BokID, Antal } = bok;

      // a) Kontrollera att det finns tillräckligt i lager
      const [[bokInfo]] = await conn.query(
        'SELECT LagerAntal FROM böcker WHERE BokID = ?',
        [BokID]
      );

      if (!bokInfo) {
        throw new Error(`Bok med ID ${BokID} finns inte.`);
      }

      if (bokInfo.LagerAntal < Antal) {
        throw new Error(`Inte tillräckligt i lager för bok med ID ${BokID}.`);
      }

      // b) Lägg till i beställning_böcker
      await conn.query(
        'INSERT INTO beställning_böcker (BeställningID, BokID, Antal) VALUES (?, ?, ?)',
        [BeställningID, BokID, Antal]
      );

      // c) Minska lagersaldo
      await conn.query(
        'UPDATE böcker SET LagerAntal = LagerAntal - ? WHERE BokID = ?',
        [Antal, BokID]
      );
    }

    await conn.commit();
    res.status(201).json({ message: 'Beställning skapad och lagersaldo uppdaterat', BeställningID });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

export default router;

