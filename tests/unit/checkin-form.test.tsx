import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

// Mock heavy dependencies and API
vi.mock('@/lib/api', () => ({ getAvailablePrivateVenues: vi.fn(async () => []), createVenueAccount: vi.fn(async () => ({ id: 'a1', pin: '1234' })) }));
vi.mock('@/components/ui/popover', () => ({ Popover: ({ children }: any) => React.createElement('div', null, children), PopoverTrigger: ({ children }: any) => React.createElement('div', null, children), PopoverContent: ({ children }: any) => React.createElement('div', null, children) }));
vi.mock('@/components/ui/select', () => ({
  Select: ({ children }: any) => React.createElement('div', null, children),
  SelectTrigger: ({ children }: any) => React.createElement('div', null, children),
  SelectContent: ({ children }: any) => React.createElement('div', null, children),
  SelectItem: ({ children }: any) => React.createElement('div', null, children),
  SelectValue: ({ children }: any) => React.createElement('div', null, children),
}));
vi.mock('@/components/ui/input', () => ({ Input: (props: any) => React.createElement('input', { ...props }) }));
vi.mock('@/components/shared/loading', () => ({ LoadingBox: ({ children }: any) => React.createElement('div', null, children) }));
vi.mock('@/context/spirit-context', () => ({ getSpirit: () => ({ id: 1, name: 'sp' }), useSpirit: () => ({ spirits: [], setSpirits: () => {} }) }));

import CheckInForm from '@/components/employee/reception/checkin-form';

describe('CheckInForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders heading and form fields', () => {
    render(<CheckInForm /> as any);
    expect(screen.getByText(/Check-In: Reservar habitación/i)).toBeInTheDocument();
  });

  it('renders submit button enabled by default', () => {
    render(<CheckInForm /> as any);
    expect(screen.getByRole('button', { name: /Reservar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reservar/i })).not.toBeDisabled();
  });
});
