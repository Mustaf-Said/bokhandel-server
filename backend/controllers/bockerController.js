// controllers/bockerController.js
import db from '../config/db.js';
// Hämta alla böcker
export const getBooks = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM böcker WHERE LagerAntal > 0');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Hämta en specifik bok
export const getBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM böcker WHERE BokID = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bok ej hittad' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lägg till en ny bok
export const addBook = async (req, res) => {
  const { Titel, Författare, Pris, LagerAntal } = req.body;

  if (!Titel || !Författare || !Pris || LagerAntal == null) {
    return res.status(400).json({ error: 'Alla fält måste fyllas i.' });
  }

  if (Pris <= 0 || LagerAntal <= 0) {
    return res.status(400).json({ error: 'Pris och LagerAntal måste vara större än 0.' });
  }

  try {
    const [existingBooks] = await db.query(
      'SELECT * FROM böcker WHERE Titel = ? AND Författare = ?',
      [Titel, Författare]
    );

    if (existingBooks.length > 0) {
      return res.status(409).json({ error: 'Boken finns redan i systemet.' });
    }

    const [result] = await db.query(
      'INSERT INTO böcker (Titel, Författare, Pris, LagerAntal) VALUES (?, ?, ?, ?)',
      [Titel, Författare, Pris, LagerAntal]
    );

    res.status(201).json({ message: 'Bok tillagd', BokID: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Uppdatera en bok
export const updateBook = async (req, res) => {
  const { id } = req.params;
  const { Titel, Författare, Pris, LagerAntal } = req.body;

  if (!Titel || !Författare || !Pris || LagerAntal == null) {
    return res.status(400).json({ error: 'Alla fält måste fyllas i.' });
  }

  if (Pris <= 0 || LagerAntal <= 0) {
    return res.status(400).json({ error: 'Pris och LagerAntal måste vara större än 0.' });
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
};

// Ta bort en bok och relaterade poster i beställning_böcker
export const deleteBook = async (req, res) => {
  const { id } = req.params;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Ta bort alla rader i beställning_böcker som refererar till boken
    await conn.query('DELETE FROM beställning_böcker WHERE BokID = ?', [id]);

    // Ta bort boken
    const [result] = await conn.query('DELETE FROM böcker WHERE BokID = ?', [id]);

    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Ingen bok hittades med det angivna ID:t.' });
    }

    await conn.commit();
    res.json({ message: 'Boken och relaterade poster har tagits bort.' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};
