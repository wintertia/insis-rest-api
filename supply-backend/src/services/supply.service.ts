import type { ISupply } from '../models/supply.model';
import Supply from '../models/supply.model';
import { isValidObjectId } from 'mongoose';

export class SupplyService {
    async addSupply(supplyData: Partial<ISupply>): Promise<ISupply> {
        const supply = new Supply(supplyData);
        return await supply.save();
    }

    async getAllSupplys(): Promise<ISupply[]> {
        return await Supply.find();
    }

    async getSupplyById(id: string): Promise<ISupply | null> {
        return await Supply.findById(id);
    }

    async modifySupply(
        id: string,
        supplyData: Partial<ISupply>
    ): Promise<ISupply | null> {
        try {
            if (!isValidObjectId(id)) {
                throw new Error(`Invalid supply ID format: ${id}`);
            }
    
            const updatedSupply = await Supply.findByIdAndUpdate(id, supplyData, { new: true });
            
            if (!updatedSupply) {
                throw new Error(`Supply with ID ${id} not found`);
            }
            
            return updatedSupply;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to update supply');
        }
    }

    async removeSupply(id: string): Promise<ISupply | null> {
        try {
            if (!isValidObjectId(id)) {
                throw new Error(`Invalid supply ID format: ${id}`);
            }
     
            const deletedSupply = await Supply.findByIdAndDelete(id);
            
            if (!deletedSupply) {
                throw new Error(`Supply with ID ${id} not found`);
            }
            
            return deletedSupply;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to delete supply');
        }
     }
}

export default new SupplyService();