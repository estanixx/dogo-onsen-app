import { describe, it, expect, vi } from 'vitest';
import { getAvailableTimeSlotsForService } from '@/lib/api';

describe('getAvailableTimeSlotsForService', () => {
  it('calls fetch and returns slots', async () => {
    const fakeSlots = ['09:00 AM', '10:00 AM'];
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(fakeSlots) } as any),
    );

    const slots = await getAvailableTimeSlotsForService('svc', new Date('2025-11-30'));
    expect(fetch).toHaveBeenCalled();
    expect(slots).toEqual(fakeSlots);
  });
});
