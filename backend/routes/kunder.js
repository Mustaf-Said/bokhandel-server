// routes/kunder.js
import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/kunderController.js';

const router = express.Router();


router.get('/', getAllCustomers); // Hämta alla kunder
router.get('/:id', getCustomerById); // Hämta en specifik kund
router.post('/', addCustomer); // Lägg till ny kund
router.put('/:id', updateCustomer); // Uppdatera kund
router.delete('/:id', deleteCustomer); // Ta bort kund

export default router;
