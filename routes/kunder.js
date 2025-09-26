import express from 'express';
import db from '../db.js';

const router = express.Router();

// Hämta alla kunder
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM kunder');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 🔹 GET: Hämta en specifik kund baserat på KundID
router.get('/:id', async (req, res) => {
  const { id } = req.params; // Hämtar KundID från URL-parametern

  try {
    const [rows] = await db.query('SELECT * FROM kunder WHERE KundID = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Kund ej hittad' });
    }

    res.json(rows[0]); // Skicka tillbaka den specifika kunden (första raden)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lägg till ny kund
router.post('/', async (req, res) => {
  const { Namn, Email, Mobile } = req.body;

  // Kontrollera att e-postadressen följer formatet username@bokhandel.com
  const emailRegex = /^[a-zA-Z0-9._%+-]+@bokhandel\.com$/;
  if (!Email || !emailRegex.test(Email)) {
    return res.status(400).json({ error: 'Ogiltig emailadress. Måste vara i formatet: username@bokhandel.com' });
  }

  // Kontrollera att mobilnummer är exakt 10 siffror
  const mobileRegex = /^\d{10}$/;
  if (!Mobile || !mobileRegex.test(Mobile)) {
    return res.status(400).json({ error: 'Ogiltigt mobilnummer. Måste vara exakt 10 siffror.' });
  }

  // Kontrollera att Namn inte redan finns i databasen
  try {
    const [existingUser] = await db.query('SELECT * FROM kunder WHERE Namn = ?', [Namn]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Användarnamnet är redan registrerat.' });
    }

    // Om alla valideringar går igenom, lägg till kunden
    const [result] = await db.query(
      'INSERT INTO kunder (Namn, Email, Mobile) VALUES (?, ?, ?)',
      [Namn, Email, Mobile]
    );
    res.status(201).json({ message: 'Kund tillagd', KundID: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔄 PUT: Uppdatera kund
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Namn, Email, Mobile } = req.body;

  // Kontrollera att alla nödvändiga fält är med
  if (!Namn || !Email || !Mobile) {
    return res.status(400).json({ error: 'Alla fält (Namn, Email, Mobile) måste anges.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE kunder SET Namn = ?, Email = ?, Mobile = ? WHERE KundID = ?',
      [Namn, Email, Mobile, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ingen kund hittades med det angivna ID:t.' });
    }

    res.json({ message: 'Kund uppdaterad' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE: Ta bort kund och alla relaterade beställningar
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Ta bort alla relaterade beställningar först
    await conn.query('DELETE FROM beställning_böcker WHERE BeställningID IN (SELECT BeställningID FROM beställningar WHERE KundID = ?)', [id]);
    await conn.query('DELETE FROM beställningar WHERE KundID = ?', [id]);

    // Ta bort kunden
    const [result] = await conn.query('DELETE FROM kunder WHERE KundID = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ingen kund hittades med det angivna ID:t.' });
    }

    await conn.commit();
    res.json({ message: 'Kund och relaterade beställningar har tagits bort.' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});


export default router;
