import express from 'express';
import db from '../db.js';

const router = express.Router();

// 🔹 GET /bocker – Hämta alla böcker
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM böcker');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 POST /bocker – Lägg till ny bok
router.post('/', async (req, res) => {
  const { Titel, Författare, Pris, LagerAntal } = req.body;

  if (!Titel || !Författare || !Pris || LagerAntal == null) {
    return res.status(400).json({ error: 'Alla fält måste fyllas i.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO böcker (Titel, Författare, Pris, LagerAntal) VALUES (?, ?, ?, ?)',
      [Titel, Författare, Pris, LagerAntal]
    );
    res.status(201).json({ message: 'Bok tillagd', BokID: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔄 PUT /bocker/:id – Uppdatera en bok
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Titel, Författare, Pris, LagerAntal } = req.body;

  if (!Titel || !Författare || !Pris || LagerAntal == null) {
    return res.status(400).json({ error: 'Alla fält (Titel, Författare, Pris, LagerAntal) måste anges.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE böcker SET Titel = ?, Författare = ?, Pris = ?, LagerAntal = ? WHERE BokID = ?',
      [Titel, Författare, Pris, LagerAntal, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ingen bok hittades med det angivna ID:t.' });
    }

    res.json({ message: 'Boken uppdaterades' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  DELETE /bocker/:id – Ta bort en bok
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM böcker WHERE BokID = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ingen bok hittades med det angivna ID:t.' });
    }

    res.json({ message: 'Boken har tagits bort.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



export default router;
