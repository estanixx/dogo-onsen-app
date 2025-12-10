import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

// Mock ToggleGroupItem so tests don't require ToggleGroup context
vi.mock('@/components/ui/toggle-group', () => ({
  ToggleGroupItem: (props: any) => {
    const { children, className, disabled, value, ...rest } = props;
    return React.createElement(
      'button',
      { 'data-value': value, className: className ?? '', disabled: !!disabled, ...rest },
      children,
    );
  },
}));

import TableItem from '@/components/employee/banquet/table-item';

describe('TableItem', () => {
  const baseTable = {
    id: 12,
    capacity: 6,
    state: true,
    available: true,
    availableSeats: [
      { id: 101, seatNumber: 1, available: true, reservationId: '' },
      { id: 102, seatNumber: 2, available: false, reservationId: '' },
      { id: 103, seatNumber: 3, available: true, reservationId: 'r1' },
    ],
  } as any;

  it('matches snapshot when no time selected (all seat buttons disabled)', () => {
    const { container } = render(<TableItem table={baseTable} selectedTime={null} />);

    // seats should render as buttons with numbers
    expect(screen.getByRole('button', { name: '1' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '2' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '3' })).toBeDisabled();

    expect(container).toMatchSnapshot();
  });

  it('enables only truly available seats when a time is selected and marks reserved seats', () => {
    render(<TableItem table={baseTable} selectedTime={'09:00 AM'} />);

    const btn1 = screen.getByRole('button', { name: '1' });
    const btn2 = screen.getByRole('button', { name: '2' });
    const btn3 = screen.getByRole('button', { name: '3' });

    // seat 1 is available and table is available => enabled
    expect(btn1).not.toBeDisabled();
    expect(btn1.className).toMatch(/bg-secondary|bg-primary/);

    // seat 2 has available=false => disabled
    expect(btn2).toBeDisabled();

    // seat 3 has reservationId => considered reserved and should be styled accordingly
    // Note: component marks reserved seats visually but does not disable them
    expect(btn3).toBeDisabled();
    expect(btn3.className).toContain('bg-destructive');
  });

  it('renders the table id and applies disabled/grayscale when table.state is false', () => {
    const { container } = render(
      <TableItem
        table={{ ...baseTable, state: false }}
        selectedTime={null}
      />,
    );

    // table id should appear
    expect(screen.getByText(String(baseTable.id))).toBeInTheDocument();

    // the Card should have opacity-50 or grayscale class applied when state=false
    const hasOpacity = !!container.querySelector('.opacity-50');
    const hasGrayscale = !!container.querySelector('.grayscale');
    expect(hasOpacity || hasGrayscale).toBe(true);
  });

  it('sets data-value attribute on rendered seat buttons', () => {
    render(<TableItem table={baseTable} selectedTime={'09:00 AM'} />);
    const btn1 = screen.getByRole('button', { name: '1' });
    expect(btn1.getAttribute('data-value')).toBe(String(baseTable.availableSeats[0].id));
  });

  it('disables all seats when table.available is false even if seat.available is true', () => {
    const tableUnavailable = { ...baseTable, available: false };
    render(<TableItem table={tableUnavailable} selectedTime={'09:00 AM'} />);

    const btn1 = screen.getByRole('button', { name: '1' });
    const btn2 = screen.getByRole('button', { name: '2' });
    const btn3 = screen.getByRole('button', { name: '3' });

    expect(btn1).toBeDisabled();
    expect(btn2).toBeDisabled();
    expect(btn3).toBeDisabled();
  });
});
