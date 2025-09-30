// controllers/kunderController.js
import db from '../config/db.js';

// Hämta alla kunder
export const getAllCustomers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM kunder');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Hämta en specifik kund baserat på KundID
export const getCustomerById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM kunder WHERE KundID = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Kund ej hittad' });
    }

    res.json(rows[0]); // Skicka tillbaka den specifika kunden (första raden)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lägg till ny kund
export const addCustomer = async (req, res) => {
  const { Namn, Email, Mobile } = req.body;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@bokhandel\.com$/;
  if (!Email || !emailRegex.test(Email)) {
    return res.status(400).json({ error: 'Ogiltig emailadress. Måste vara i formatet: username@bokhandel.com' });
  }

  const mobileRegex = /^\d{10}$/;
  if (!Mobile || !mobileRegex.test(Mobile)) {
    return res.status(400).json({ error: 'Ogiltigt mobilnummer. Måste vara exakt 10 siffror.' });
  }

  try {
    const [existingUser] = await db.query('SELECT * FROM kunder WHERE Namn = ?', [Namn]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Användarnamnet är redan registrerat.' });
    }

    const [result] = await db.query(
      'INSERT INTO kunder (Namn, Email, Mobile) VALUES (?, ?, ?)',
      [Namn, Email, Mobile]
    );
    res.status(201).json({ message: 'Kund tillagd', KundID: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Uppdatera kund
export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { Namn, Email, Mobile } = req.body;

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
};

// Ta bort kund och relaterade beställningar
export const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Ta bort relaterade beställningar först
    await conn.query('DELETE FROM beställning_böcker WHERE BeställningID IN (SELECT BeställningID FROM beställningar WHERE KundID = ?)', [id]);
    await conn.query('DELETE FROM beställningar WHERE KundID = ?', [id]);

    // Ta bort kunden
    const [result] = await conn.query('DELETE FROM kunder WHERE KundID = ?', [id]);

    if (result.affectedRows === 0) {
      await conn.rollback();
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
};
