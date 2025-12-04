import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { ReservationList } from '@/components/room/reservation/reservation-list';
import { VenueAccount } from '@/lib/types';

// Mock API
const getReservationsMock = vi.fn();
const updateReservationMock = vi.fn();
const removeReservationMock = vi.fn();

vi.mock('@/lib/api', () => ({
  getReservations: (...args: any[]) => getReservationsMock(...args), // eslint-disable-line @typescript-eslint/no-explicit-any
  updateReservation: (...args: any[]) => updateReservationMock(...args), // eslint-disable-line @typescript-eslint/no-explicit-any
  removeReservation: (...args: any[]) => removeReservationMock(...args), // eslint-disable-line @typescript-eslint/no-explicit-any
}));

// Mock hooks
vi.mock('@/hooks/use-media-query', () => ({
  useMediaQuery: () => true, // Desktop
}));

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockAccount: VenueAccount = {
  id: 'acc1',
  spirit: {name: 'spirit1', id: 1, typeId: '1', image: '', individualRecord: '', type: {id: '1', name: 'Type1', dangerScore: 1, image: ''}},
  venueId: 'venue1',
  eiltBalance: 100,
  spiritId: 'spirit1',
  startTime: new Date(),
  endTime: new Date(),
  pin: '1234',
};

const mockReservations = [
  {
    id: 'res1',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3600000).toISOString(),
    service: {
      id: 'svc1',
      name: 'Massage',
      eiltRate: 50,
      description: 'Relaxing massage',
      image: '/test-image.jpg',
    },
    isRedeemed: false,
    isRated: false,
  },
];

describe('ReservationList', () => {
  beforeAll(() => {
    // Mock Audio for RedeemDialog
    global.Audio = vi.fn().mockImplementation(function () {
      return {
        play: vi.fn().mockResolvedValue(undefined),
        pause: vi.fn(),
        volume: 0,
        loop: false,
      };
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders reservations correctly', async () => {
    getReservationsMock.mockResolvedValue(mockReservations);
    render(<ReservationList account={mockAccount} />);

    await waitFor(() => {
      expect(screen.getByText('Massage')).toBeInTheDocument();
      expect(screen.getByText('50 EILT')).toBeInTheDocument();
    });
  });

  it('shows empty state when no reservations', async () => {
    getReservationsMock.mockResolvedValue([]);
    render(<ReservationList account={mockAccount} />);

    await waitFor(() => {
      expect(screen.getByText('Sin reservaciones')).toBeInTheDocument();
    });
  });

  it('handles redeem action', async () => {
    getReservationsMock.mockResolvedValue(mockReservations);
    updateReservationMock.mockResolvedValue({});

    render(<ReservationList account={mockAccount} />);

    await waitFor(() => {
      expect(screen.getByText('Massage')).toBeInTheDocument();
    });

    const redeemButton = screen.getByText('Redimir');
    fireEvent.click(redeemButton);

    // Since we are mocking time check in component (it uses new Date()),
    // and our mock reservation is "now", it might open dialog or redeem directly.
    // The component logic: if (now >= start && now <= end) -> open dialog.
    // Our mock start is now, end is +1h. So it should open dialog.

    // Check if dialog opens (look for text in dialog)
    await waitFor(() => {
      expect(screen.getByText(/Disfruta de tu/i)).toBeInTheDocument();
    });

    // Click "Terminé" to close dialog and trigger executeRedeem
    const doneButton = screen.getByText('Terminé');
    fireEvent.click(doneButton);

    await waitFor(() => {
      expect(updateReservationMock).toHaveBeenCalledWith('res1', { isRedeemed: true });
    });
  });

  it('cancels reservation', async () => {
    getReservationsMock.mockResolvedValue(mockReservations);
    removeReservationMock.mockResolvedValue({});

    render(<ReservationList account={mockAccount} />);

    await waitFor(() => {
      expect(screen.getByText('Massage')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(removeReservationMock).toHaveBeenCalledWith('res1');
    });
  });
});
