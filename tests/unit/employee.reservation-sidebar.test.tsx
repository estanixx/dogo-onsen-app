import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock UI primitives to keep tests simple
vi.mock('@/components/ui/calendar', () => ({
  Calendar: ({ onSelect }: any) =>
    React.createElement('div', {
      'data-testid': 'mock-calendar',
      onClick: () => onSelect(new Date('2025-01-01')),
    }),
}));
vi.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: any) => React.createElement('div', null, children),
  PopoverTrigger: ({ children }: any) => React.createElement('div', null, children),
  PopoverContent: ({ children }: any) => React.createElement('div', null, children),
}));
vi.mock('@/components/ui/select', () => ({
  Select: ({ children }: any) => React.createElement('div', null, children),
  SelectTrigger: ({ children }: any) => React.createElement('div', null, children),
  SelectContent: ({ children }: any) => React.createElement('div', null, children),
  SelectItem: ({ children }: any) => React.createElement('div', null, children),
  SelectValue: ({ children }: any) => React.createElement('div', null, children),
}));

// Mock LoadingBox and ScrollArea and ReservationCard
vi.mock('@/components/shared/loading', () => ({
  LoadingBox: ({ children }: any) => React.createElement('div', null, children),
}));
vi.mock('@radix-ui/react-scroll-area', () => ({
  ScrollArea: ({ children }: any) => React.createElement('div', null, children),
}));
vi.mock('@/components/employee/service/reservation-card', () => ({
  __esModule: true,
  default: ({ reservation }: any) =>
    React.createElement(
      'div',
      { 'data-testid': `reservation-${reservation.id}` },
      `reservation-${reservation.id}`,
    ),
}));

// Mock sidebar hook so we can assert setOpen usage
vi.mock('@/components/ui/sidebar', () => ({ useSidebar: () => ({ setOpen: vi.fn() }) }));

// Mock API functions inside factory; we'll dynamically import the mocked module in beforeEach
vi.mock('@/lib/api', () => {
  const getTimeSlots = vi.fn(async () => ['09:00 AM', '10:00 AM']);
  const getReservations = vi.fn(async () => []);
  return { getTimeSlots, getReservations };
});
let getTimeSlots: any;
let getReservations: any;

import ReservationSidebar from '@/components/employee/service/reservation-sidebar';
import { Service } from '@/lib/types';

describe('ReservationSidebar', () => {
  beforeEach(async () => {
    const mod = await import('@/lib/api');
    getTimeSlots = mod.getTimeSlots;
    getReservations = mod.getReservations;
    vi.clearAllMocks();
  });

  it('fetches time slots on mount and shows no reservations message when empty', async () => {
    const service = { id: 'svc1', name: 'SVC' } as unknown as Service;
    render(<ReservationSidebar service={service} />);

    await waitFor(() => expect(getTimeSlots).toHaveBeenCalled());
    await waitFor(() => expect(getReservations).toHaveBeenCalled());

    expect(screen.getByText(/No existen reservaciones/i)).toBeInTheDocument();
  });

  it('renders reservations returned by API', async () => {
    // replace getReservations to return one reservation
    getReservations.mockImplementationOnce(async () => [
      { id: 'r1', name: 'Test', timeSlot: '09:00 AM' },
    ]);
    const service = { id: 'svc2', name: 'SVC2' } as unknown as Service;
    render(<ReservationSidebar service={service} />);

    await waitFor(() => expect(getReservations).toHaveBeenCalled());
    expect(screen.getByTestId('reservation-r1')).toBeInTheDocument();
  });
});
