import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

// Mock Image component from next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => React.createElement('img', props),
}));

import { SpiritInfo } from '@/components/room/shared/spirit-info';

describe('SpiritInfo', () => {
  it('shows spirit name, type and balance', () => {
    const account = {
      id: 'acc1',
      spiritId: 's1',
      spirit: {
        id: 1,
        name: 'Aqua',
        typeId: 't1',
        type: { id: 't1', name: 'Water', dangerScore: 1, image: '' },
        individualRecord: '',
      },
      venueId: 'v1',
      startTime: new Date(),
      endTime: new Date(),
      pin: '1234',
      eiltBalance: 120,
    } as any;

    render(<SpiritInfo account={account} />);

    expect(screen.getByText('Aqua')).toBeInTheDocument();
    expect(screen.getByText('Water')).toBeInTheDocument();
    expect(screen.getByText(/120 EILT/)).toBeInTheDocument();
  });
});
