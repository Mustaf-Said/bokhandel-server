// controllers/bestallningarController.js
import db from '../config/db.js';

// Hämta alla beställningar med boktitlar
export const getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT  k.KundID, k.Namn, b.Titel, bb.Antal, be.BeställningID, be.Datum
      FROM kunder k
      JOIN beställningar be ON k.KundID = be.KundID
      JOIN beställning_böcker bb ON be.BeställningID = bb.BeställningID
      JOIN böcker b ON bb.BokID = b.BokID
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Hämta en specifik beställning med böcker
export const getOrderById = async (req, res) => {
  const bestallningID = req.params.id;

  try {
    const [rows] = await db.query(`
      SELECT be.BeställningID, be.Datum, k.KundID, k.Namn, b.BokID, b.Titel, bb.Antal
      FROM beställningar be
      JOIN kunder k ON be.KundID = k.KundID
      JOIN beställning_böcker bb ON be.BeställningID = bb.BeställningID
      JOIN böcker b ON bb.BokID = b.BokID
      WHERE be.BeställningID = ?
    `, [bestallningID]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Beställning hittades inte' });
    }
    const datum = new Date(rows[0].Datum);
    const datumStr = datum.toLocaleDateString('sv-SE'); // exempel: '2025-10-02'

    // Strukturera svaret om du vill (gruppera böcker under beställning)
    const order = {
      BeställningID: rows[0].BeställningID,
      Datum: datumStr,
      KundID: rows[0].KundID,
      Namn: rows[0].Namn,
      Bocker: rows.map(row => ({
        BokID: row.BokID,
        Titel: row.Titel,
        Antal: row.Antal
      }))
    };

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Skapa ny beställning med böcker och minska lagersaldo
export const createOrder = async (req, res) => {
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
};

// Ta bort en beställning och återställ lagersaldo
export const deleteOrder = async (req, res) => {
  const bestallningID = req.params.id;

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // 1. Hämta böcker och antal för att kunna återställa lagersaldo
    const [bocker] = await conn.query(
      'SELECT BokID, Antal FROM beställning_böcker WHERE BeställningID = ?',
      [bestallningID]
    );

    // 2. Återställ lagersaldo
    for (const bok of bocker) {
      await conn.query(
        'UPDATE böcker SET LagerAntal = LagerAntal + ? WHERE BokID = ?',
        [bok.Antal, bok.BokID]
      );
    }

    // 3. Ta bort från beställning_böcker
    await conn.query(
      'DELETE FROM beställning_böcker WHERE BeställningID = ?',
      [bestallningID]
    );

    // 4. Ta bort själva beställningen
    await conn.query(
      'DELETE FROM beställningar WHERE BeställningID = ?',
      [bestallningID]
    );

    await conn.commit();
    res.json({ message: 'Beställning borttagen och lagersaldo återställt' });

  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

// Uppdatera en befintlig beställning (byt ut böcker & antal)
export const updateOrder = async (req, res) => {
  const bestallningID = req.params.id;
  const { Bocker } = req.body;

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // 🧹 1. Återställ lagersaldo för gamla böcker
    const [oldBocker] = await conn.query(
      'SELECT BokID, Antal FROM beställning_böcker WHERE BeställningID = ?',
      [bestallningID]
    );

    for (const bok of oldBocker) {
      await conn.query(
        'UPDATE böcker SET LagerAntal = LagerAntal + ? WHERE BokID = ?',
        [bok.Antal, bok.BokID]
      );
    }

    // 🗑️ 2. Ta bort gamla bokrader
    await conn.query(
      'DELETE FROM beställning_böcker WHERE BeställningID = ?',
      [bestallningID]
    );

    // ➕ 3. Lägg till nya böcker och minska lager
    for (const bok of Bocker) {
      const { BokID, Antal } = bok;

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

      await conn.query(
        'INSERT INTO beställning_böcker (BeställningID, BokID, Antal) VALUES (?, ?, ?)',
        [bestallningID, BokID, Antal]
      );

      await conn.query(
        'UPDATE böcker SET LagerAntal = LagerAntal - ? WHERE BokID = ?',
        [Antal, BokID]
      );
    }

    await conn.commit();
    res.json({ message: 'Beställning uppdaterad' });

  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};
