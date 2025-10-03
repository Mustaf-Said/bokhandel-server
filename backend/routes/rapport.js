import express from 'express';
import { getDetailedOrdersReport } from '../controllers/rapportController.js';

const router = express.Router();

router.get('/rapport', getDetailedOrdersReport);

export default router;
