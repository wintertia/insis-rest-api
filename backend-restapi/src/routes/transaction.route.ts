import { Router } from 'express';
import * as transactionController from '../controllers/transaction.controller';

const router = Router();

router.post('/use/:id', transactionController.useSupply);
router.post('/restock/:id', transactionController.restockSupply);

export default router;
