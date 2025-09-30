// routes/bestallningar.js
import express from 'express';
import { getAllOrders, createOrder, deleteOrder } from '../controllers/bestallningarController.js';

const router = express.Router();

// GET: Hämta alla beställningar
router.get('/', getAllOrders);

// POST: Skapa ny beställning
router.post('/', createOrder);

// DELETE: Ta bort en beställning
router.delete('/:id', deleteOrder);

export default router;
