import type { Request, Response } from 'express';
import SupplyService from '../services/supply.service';

export class SupplyController {
  async addSupply(req: Request, res: Response) {
    try { 
      const supply = await SupplyService.addSupply(req.body);
      res.status(201).json(supply);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Unknown error' });
      }
    }
  }

  async getAllSupplys(req: Request, res: Response) {
    try {
      const supplys = await SupplyService.getAllSupplys();
      res.json(supplys);
    } catch (error: any) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Unknown error' });
      }
    }
  }

  async getSupplyById(req: Request, res: Response) {
    try {
      const supply = await SupplyService.getSupplyById(req.params.id);
      if (!supply) {
        res.status(404).json({ message: 'Supply not found' });
        return;
      }
      res.json(supply);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Unknown error' });
      }
    }
  }

  async modifySupply(req: Request, res: Response) {
    try {
        const supply = await SupplyService.modifySupply(req.params.id, req.body);
        res.json(supply);
    } catch (error) {
        if (error instanceof Error && error.message.includes('Invalid supply ID format')) {
            res.status(400).json({ message: error.message }); 
        } else if (error instanceof Error && error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' }); 
        }
    }
  }

  async removeSupply(req: Request, res: Response) {
    try {
        const supply = await SupplyService.removeSupply(req.params.id);
        res.json({ message: 'Supply deleted successfully', supply });
    } catch (error) {
        if (error instanceof Error && error.message.includes('Invalid supply ID format')) {
            res.status(400).json({ message: error.message });
        } else if (error instanceof Error && error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
  }
}