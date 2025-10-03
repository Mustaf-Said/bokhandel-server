// routes/bocker.js
import express from 'express';
import {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook
} from '../controllers/bockerController.js';

const router = express.Router();


router.get('/', getBooks); // Hämta alla böcker
router.get('/:id', getBookById); // Hämta en specifik bok
router.post('/', addBook); // Lägg till en ny bok
router.put('/:id', updateBook); // Uppdatera en bok
router.delete('/:id', deleteBook); // Ta bort en bok

export default router;
