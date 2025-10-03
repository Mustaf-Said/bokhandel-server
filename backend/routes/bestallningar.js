// routes/bestallningar.js
import express from 'express';
import { getAllOrders, createOrder, deleteOrder, getOrderById, updateOrder } from '../controllers/bestallningarController.js';

const router = express.Router();

// GET: Hämta alla beställningar
router.get('/', getAllOrders);
// GET: Hämta en specifik beställning
router.get('/:id', getOrderById);
// POST: Skapa ny beställning
router.post('/', createOrder);
//PUT: update beställning
router.put('/:id', updateOrder);
// DELETE: Ta bort en beställning
router.delete('/:id', deleteOrder);

export default router;
