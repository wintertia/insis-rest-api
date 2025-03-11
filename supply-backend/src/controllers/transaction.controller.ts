import { Request, Response } from 'express';
import transactionService from '../services/transaction.service';

export const useSupply = async (req: Request, res: Response) => {
  try {
    const supplyId = req.params.id; 
    const qty = Number(req.body.qty);
    const { currentQty } = await transactionService.useSupply(supplyId, qty);

    res.status(200).json({
      status: 'success',
      message: 'Successfully useed supply',
      data: {
        currentQty,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

export const restockSupply = async (req: Request, res: Response) => {
  try {
    const supplyId = req.params.id;
    const qty = Number(req.body.qty)
    const { currentQty } = await transactionService.restockSupply(supplyId, qty);

    res.status(200).json({
      status: 'success',
      message: 'Successfully restocked supply',
      data: {
        currentQty,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};
