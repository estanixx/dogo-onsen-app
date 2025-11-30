import { describe, it, expect } from 'vitest';
import { getInventoryItems, updateInventoryQuantity } from '@/lib/api';

describe('Inventory helpers', () => {
  it('getInventoryItems returns array', async () => {
    const items = await getInventoryItems();
    expect(Array.isArray(items)).toBe(true);
  });

  it('updateInventoryQuantity updates a mock item', async () => {
    const updated = await updateInventoryQuantity('1', 999);
    expect(updated).toHaveProperty('id', '1');
    expect(updated).toHaveProperty('quantity', 999);
  });
});
