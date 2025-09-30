// routes/rapport.js
import express from 'express';
import { getTotalCostPerCustomer } from '../controllers/rapportController.js';

const router = express.Router();

// Definiera vägen för att hämta total kostnad per kund
router.get('/total-kostnad', getTotalCostPerCustomer);

export default router;
