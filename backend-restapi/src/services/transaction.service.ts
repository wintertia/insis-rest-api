import Supply from '../models/supply.model';

const useSupply = async (supplyId: string, qty: number) => {
  const supply = await Supply.findById(supplyId);
  if (!supply) {
    throw new Error('Supply not found');
  }

  if (supply.qty < 1) {
    throw new Error('Supply is not available for use');
  }

  if (supply.qty < qty) {
    throw new Error('Not enough supply to use');
  }

  supply.qty -= qty;
  await supply.save();

  return { currentQty: supply.qty };
};

const restockSupply = async (supplyId: string, qty: number) => {
  const supply = await Supply.findById(supplyId);
  if (!supply) {
    throw new Error('Supply not found');
  }

  supply.qty += qty;
  supply.lastRestocked = new Date();
  await supply.save();

  return { currentQty: supply.qty };
};

export default { useSupply, restockSupply };
