import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Control flag to let the mocked Calendar auto-select a date or not
(globalThis as any).__TEST_CALENDAR_AUTOSELECT = false;

// Mock Calendar to optionally auto-select a date depending on the global flag
vi.mock('@/components/ui/calendar', () => ({
  Calendar: ({ onSelect }: any) => {
    const React = require('react');
    React.useEffect(() => {
      if ((globalThis as any).__TEST_CALENDAR_AUTOSELECT) {
        onSelect(new Date('2025-12-10'));
      }
    }, []);
    return React.createElement('div', { 'data-testid': 'mock-calendar', onClick: () => onSelect(new Date('2025-12-10')) });
  },
}));

// Mock TimeSlotSelector to render available slots and call onSelect when clicked
vi.mock('@/components/shared/time-slot-selector', () => ({
  __esModule: true,
  default: ({ availableTimeSlots, onSelect }: any) => {
    return React.createElement(
      'div',
      null,
      availableTimeSlots.map((s: string) =>
        React.createElement('button', { key: s, onClick: () => onSelect(s) }, s),
      ),
    );
  },
}));

// Mock ToggleGroup to call onValueChange with clicked button's data-value
vi.mock('@/components/ui/toggle-group', () => ({
  ToggleGroup: ({ children, onValueChange }: any) => {
    return React.createElement(
      'div',
      {
        onClick: (e: any) => {
          const btn = (e.target as HTMLElement).closest && (e.target as HTMLElement).closest('button');
          if (btn) {
            const v = btn.getAttribute('data-value');
            if (onValueChange) onValueChange(v);
          }
        },
      },
      children,
    );
  },
}));

// Mock TableItem to render seat buttons with data-value attributes and enable/disable according to props
vi.mock('@/components/employee/banquet/table-item', () => ({
  __esModule: true,
  default: ({ table, selectedTime }: any) => {
    const React = require('react');
    return React.createElement(
      'div',
      { 'data-testid': `table-${table.id}` },
      React.createElement('div', null, `table-${table.id}`),
      table.availableSeats.map((s: any) =>
        React.createElement(
          'button',
          {
            key: s.seatNumber,
            'data-value': String(s.id),
            disabled: !(s.available && table.available && !!selectedTime),
          },
          String(s.seatNumber),
        ),
      ),
    );
  },
}));

// Mock router
const mockRefresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: mockRefresh }) }));

// Mock reservation context
const mockAddReservation = vi.fn();
vi.mock('@/context/reservation-context', () => ({ useReservations: () => ({ addReservation: mockAddReservation }) }));

// Mock sonner toast (do not reference outer vars inside factory)
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
// Grab the mocked functions after the mock factory runs
const { toast: { success: mockToastSuccess, error: mockToastError } } = require('sonner');

// Mock API functions
const mockTables = [
  { id: 1, capacity: 6, state: true, available: true, availableSeats: [{ id: 11, seatNumber: 1, available: true, reservationId: '' }] },
];
const mockReservation = { id: 'r1', seatId: 11 };
const mockGetSlots = vi.fn(async (_spiritId?: any, _date?: any) => ['09:00 AM']);
const mockGetSeats = vi.fn(async (_spiritId?: any, _date?: any, _time?: any) => mockTables);
const mockCreate = vi.fn(async (_payload?: any) => mockReservation);
vi.mock('@/lib/api', () => ({
  getAvailableTimeSlotsForBanquet: (spiritId: any, date: any) => mockGetSlots(spiritId, date),
  getAvailableBanquetSeats: (spiritId: any, date: any, time: any) => mockGetSeats(spiritId, date, time),
  createBanquetReservation: (payload: any) => mockCreate(payload),
}));

import BanquetLayout from '@/components/employee/banquet/banquet-layout';
import { VenueAccount } from '@/lib/types';

describe('BanquetLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (globalThis as any).__TEST_CALENDAR_AUTOSELECT = false;
  });

  it('shows prompt when no date/time selected and confirm disabled', () => {
    const account = { id: 'a1', spiritId: 's1' } as unknown as VenueAccount;
    render(<BanquetLayout account={account} venueId={'v1'} />);
    expect(screen.getByText(/Selecciona una fecha y un horario/i)).toBeInTheDocument();
    const button = screen.queryByRole('button', { name: /Confirmar reserva/i });
    expect(button).toBeNull();
  });

  it('full flow: selects date, time, seat and confirms reservation', async () => {
    // enable auto-select calendar (and also click the mock calendar for reliability)
    (globalThis as any).__TEST_CALENDAR_AUTOSELECT = true;

    const account = { id: 'a1', spiritId: 's1' } as unknown as VenueAccount;
    render(<BanquetLayout account={account} venueId={'v1'} />);

    // click the mock calendar to ensure date selection runs in tests
    fireEvent.click(screen.getByTestId('mock-calendar'));

    // wait for time slots to be rendered from mocked TimeSlotSelector
    await waitFor(() => expect(mockGetSlots).toHaveBeenCalledWith(account.spiritId, expect.any(Date)));
    // click the time button
    fireEvent.click(screen.getByRole('button', { name: '09:00 AM' }));

    // wait for seats fetch
    await waitFor(() => expect(mockGetSeats).toHaveBeenCalledWith(account.spiritId, expect.any(Date), '09:00 AM'));

    // seat button should be present and enabled
    const seatBtn = screen.getByRole('button', { name: '1' });
    expect(seatBtn).not.toBeDisabled();

    // click the seat (ToggleGroup mock will call onValueChange)
    fireEvent.click(seatBtn);

    // Confirm button should be enabled
    const confirm = screen.getByRole('button', { name: /Confirmar reserva/i });
    expect(confirm).not.toBeDisabled();

    // click confirm
    fireEvent.click(confirm);

    await waitFor(() => expect(mockCreate).toHaveBeenCalled());
    await waitFor(() => expect(mockAddReservation).toHaveBeenCalledWith(mockReservation));
    expect(mockRefresh).toHaveBeenCalled();
  });
});
