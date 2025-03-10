import mongoose, { Schema, type Document } from 'mongoose';

export interface ISupply extends Document {
  name: string;
  qty: number;
  unit: string;
  description: string;
  category: string;
  supplier: string;
  cost: number;
  location: string;
  lastRestocked: Date;
}

const SupplySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    unit: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    supplier: { type: String, required: true },
    cost: { type: Number, required: true },
    location: { type: String, required: true },
    lastRestocked: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

export default mongoose.model<ISupply>('Supply', SupplySchema);