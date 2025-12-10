import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

// Mock getAllSpirits and useSpirit context
let _fakeSpirits: any[] = [];
vi.mock('@/lib/api', () => ({ getAllSpirits: vi.fn(async () => _fakeSpirits) }));
vi.mock('@/context/spirit-context', () => ({ useSpirit: () => ({ spirits: _fakeSpirits, setSpirits: (s: any) => { _fakeSpirits = s; } }) }));
vi.mock('@/components/shared/spirit-card', () => ({ __esModule: true, default: ({ spirit }: any) => React.createElement('div', { 'data-testid': `spirit-${spirit?.id}` }, `spirit-${spirit?.id}`) }));
vi.mock('@/components/shared/loading', () => ({ LoadingBox: ({ children }: any) => React.createElement('div', null, children) }));

import SpiritGrid from '@/components/employee/reception/spirit-grid';
import { getAllSpirits } from '@/lib/api';

describe('SpiritGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading then no spirits message when empty', async () => {
    (getAllSpirits as any).mockResolvedValue([]);
    render(<SpiritGrid />);
    await waitFor(() => expect(getAllSpirits).toHaveBeenCalled());
    expect(screen.getByText(/No hay espíritus registrados./i)).toBeInTheDocument();
  });

  it('renders spirit cards when API returns spirits', async () => {
    // Pre-seed the fake spirits so the mocked `useSpirit` returns them immediately
    _fakeSpirits = [{ id: 'sp1' }];
    (getAllSpirits as any).mockResolvedValue(_fakeSpirits);
    render(<SpiritGrid />);
    await waitFor(() => expect(getAllSpirits).toHaveBeenCalled());
    expect(screen.getByTestId('spirit-sp1')).toBeInTheDocument();
  });
});
