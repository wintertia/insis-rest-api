import { Router } from 'express';
import { SupplyController } from '../controllers/supply.controller';

const router = Router();
const supplyController = new SupplyController();

router.post('/', supplyController.addSupply);
router.get('/', supplyController.getAllSupplys);
router.get('/:id', supplyController.getSupplyById);
router.patch('/:id', supplyController.modifySupply);
router.delete('/:id', supplyController.removeSupply);

export default router;