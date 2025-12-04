import { describe, it, expect, vi } from 'vitest';
import * as api from '@/lib/api';

describe('lib/api', () => {
  it('getAvailableServices calls fetch and returns parsed JSON', async () => {
    const fakeServices = [{ id: '1', name: 'Test Service' }];
    globalThis.fetch = vi.fn(
      () => Promise.resolve({ ok: true, json: () => Promise.resolve(fakeServices) } as any), // eslint-disable-line @typescript-eslint/no-explicit-any
    );

    const services = await api.getAvailableServices();
    expect(fetch).toHaveBeenCalled();
    expect(services).toEqual(fakeServices);
  });
});
