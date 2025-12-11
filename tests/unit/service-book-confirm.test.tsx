import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Calendar, TimeSlotSelector, Dialog, and ScrollArea to avoid complex portal behavior
vi.mock('@/components/ui/calendar', () => ({
  Calendar: ({ onSelect }: any) =>
    React.createElement('div', {
      'data-testid': 'mock-calendar',
      onClick: () => onSelect(new Date('2025-01-01')),
    }),
}));
vi.mock('@/components/shared/time-slot-selector', () => ({
  __esModule: true,
  default: ({ availableTimeSlots, onSelect }: any) =>
    React.createElement(
      'div',
      null,
      availableTimeSlots.map((s: string) =>
        React.createElement('button', { key: s, onClick: () => onSelect(s) }, s),
      ),
    ),
}));
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: any) => React.createElement('div', null, children),
  DialogContent: ({ children }: any) => React.createElement('div', null, children),
  DialogHeader: ({ children }: any) => React.createElement('div', null, children),
  DialogFooter: ({ children }: any) => React.createElement('div', null, children),
  DialogTitle: ({ children }: any) => React.createElement('div', null, children),
  DialogDescription: ({ children }: any) => React.createElement('div', null, children),
  DialogTrigger: ({ children }: any) => React.createElement('div', null, children),
}));
vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: any) => React.createElement('div', null, children),
}));

vi.mock('@/lib/api', () => ({
  getAvailableTimeSlotsForService: vi.fn(async () => ['09:00 AM']),
  createServiceReservation: vi.fn(async () => ({ id: 'r1' })),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

import ServiceBookConfirm from '@/components/room/service/service-book-confirm';
import { Service } from '@/lib/types';

describe('ServiceBookConfirm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads time slots and allows confirming a reservation', async () => {
    const service = { id: 'svc1', name: 'Test Service', eiltRate: 10 } as unknown as Service;
    const account = { id: 'acc1' } as any;
    render(
      <ServiceBookConfirm service={service} open={true} setOpen={() => {}} account={account} />,
    );

    const api = await import('@/lib/api');
    await waitFor(() =>
      expect(api.getAvailableTimeSlotsForService).toHaveBeenCalledWith(
        service.id,
        expect.any(Date),
      ),
    );

    // click the time slot button (wrap in act to avoid React state update warnings)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '09:00 AM' }));
    });

    // Confirm button should appear and be clickable (it starts disabled until time selected)
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Confirmar/i })).toBeInTheDocument(),
    );
    const confirmBtn = screen.getByRole('button', { name: /Confirmar/i });
    await act(async () => {
      fireEvent.click(confirmBtn);
    });

    const api2 = await import('@/lib/api');
    await waitFor(() => expect(api2.createServiceReservation).toHaveBeenCalled());
  });

  it('confirm button is disabled until a time is selected', async () => {
    const service = { id: 'svc2', name: 'Other Service', eiltRate: 5 } as unknown as Service;
    const account = { id: 'acc2' } as any;
    render(
      <ServiceBookConfirm service={service} open={true} setOpen={() => {}} account={account} />,
    );
    // Wait for API to load time slots
    const api3 = await import('@/lib/api');
    await waitFor(() => expect(api3.getAvailableTimeSlotsForService).toHaveBeenCalled());

    // Confirm button should be present but disabled (no time selected)
    const confirmBtn = screen.getByRole('button', { name: /Confirmar/i });
    expect(confirmBtn).toBeDisabled();

    // Select a time and then button becomes enabled (wrap click in act)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '09:00 AM' }));
    });
    await waitFor(() => expect(confirmBtn).not.toBeDisabled());
  });
});
