// controllers/rapportController.js
import db from '../config/db.js';

export const getDetailedOrdersReport = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
         k.KundID,
  k.Namn,
  be.BeställningID,
  be.Datum,
  b.BokID,
  b.Titel,
  bb.Antal,
  b.Pris AS PrisPerStyck,
  (bb.Antal * b.Pris) AS PrisTotalPerBok
      FROM kunder k
      JOIN beställningar be ON k.KundID = be.KundID
      JOIN beställning_böcker bb ON be.BeställningID = bb.BeställningID
      JOIN böcker b ON bb.BokID = b.BokID
      ORDER BY be.BeställningID
    `);

    const ordersMap = new Map();

    for (const row of rows) {
      if (!ordersMap.has(row.BeställningID)) {
        ordersMap.set(row.BeställningID, {
          BeställningID: row.BeställningID,
          Datum: row.Datum,
          KundID: row.KundID,
          Namn: row.Namn,
          TotalPris: 0,
          Bocker: []
        });
      }

      const order = ordersMap.get(row.BeställningID);

      // Lägg till boken i listan
      order.Bocker.push({
        BokID: row.BokID,
        Titel: row.Titel,
        Antal: row.Antal,
        PrisPerStyck: parseFloat(row.PrisPerStyck),
        /* PrisTotalPerBok: parseFloat(row.PrisTotalPerBok) */
      });
      order.TotalPris += parseFloat(row.PrisTotalPerBok);


    }

    const orders = Array.from(ordersMap.values());

    res.json(orders);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
