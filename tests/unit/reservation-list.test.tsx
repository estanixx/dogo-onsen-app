import { ReservationList } from '@/components/room/reservation/reservation-list';
import { VenueAccount } from '@/lib/types';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

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
  spirit: {
    name: 'spirit1',
    id: 1,
    typeId: '1',
    image: '',
    individualRecord: '',
    type: { id: '1', name: 'Type1', dangerScore: 1, image: '' },
  },
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

  // RF-012: Tests para visualizar diferentes estados de reservaciones
  describe('RF-012: Visualización de estados de reservaciones', () => {
    it('muestra reservación con estado "pendiente" (no redimido, no calificado)', async () => {
      const pendingReservation = [
        {
          id: 'res-pending',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString(),
          service: {
            id: 'svc1',
            name: 'Spa Treatment',
            eiltRate: 75,
            description: 'Relaxing spa',
            image: '/spa.jpg',
          },
          isRedeemed: false,
          isRated: false,
        },
      ];

      getReservationsMock.mockResolvedValue(pendingReservation);
      render(<ReservationList account={mockAccount} />);

      await waitFor(() => {
        expect(screen.getByText('Spa Treatment')).toBeInTheDocument();
        // Estado pendiente debería mostrar botón "Redimir"
        expect(screen.getByText('Redimir')).toBeInTheDocument();
      });
    });

    it('muestra reservación con estado "redimido" (redimido, no calificado)', async () => {
      const redeemedReservation = [
        {
          id: 'res-redeemed',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString(),
          service: {
            id: 'svc2',
            name: 'Hot Spring',
            eiltRate: 100,
            description: 'Natural hot spring',
            image: '/hotspring.jpg',
          },
          isRedeemed: true,
          isRated: false,
        },
      ];

      getReservationsMock.mockResolvedValue(redeemedReservation);
      render(<ReservationList account={mockAccount} />);

      await waitFor(() => {
        expect(screen.getByText('Hot Spring')).toBeInTheDocument();
        // Estado redimido debería mostrar opción de calificar
        expect(screen.getByText('Calificar')).toBeInTheDocument();
      });
    });

    it('muestra reservación con estado "calificado" (redimido y calificado)', async () => {
      const ratedReservation = [
        {
          id: 'res-rated',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString(),
          service: {
            id: 'svc3',
            name: 'Tea Ceremony',
            eiltRate: 60,
            description: 'Traditional tea ceremony',
            image: '/tea.jpg',
          },
          isRedeemed: true,
          isRated: true,
        },
      ];

      getReservationsMock.mockResolvedValue(ratedReservation);
      render(<ReservationList account={mockAccount} />);

      await waitFor(() => {
        expect(screen.getByText('Tea Ceremony')).toBeInTheDocument();
        // Estado calificado no debería mostrar botones de acción principales
        expect(screen.queryByText('Redimir')).not.toBeInTheDocument();
      });
    });

    it('muestra múltiples reservaciones con diferentes estados simultáneamente', async () => {
      const mixedReservations = [
        {
          id: 'res1',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString(),
          service: {
            id: 'svc1',
            name: 'Pending Service',
            eiltRate: 50,
            description: 'Pending',
            image: '/p.jpg',
          },
          isRedeemed: false,
          isRated: false,
        },
        {
          id: 'res2',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString(),
          service: {
            id: 'svc2',
            name: 'Redeemed Service',
            eiltRate: 75,
            description: 'Redeemed',
            image: '/r.jpg',
          },
          isRedeemed: true,
          isRated: false,
        },
        {
          id: 'res3',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString(),
          service: {
            id: 'svc3',
            name: 'Rated Service',
            eiltRate: 100,
            description: 'Rated',
            image: '/ra.jpg',
          },
          isRedeemed: true,
          isRated: true,
        },
      ];

      getReservationsMock.mockResolvedValue(mixedReservations);
      render(<ReservationList account={mockAccount} />);

      await waitFor(() => {
        // Verificar que todas las reservaciones se muestran
        expect(screen.getByText('Pending Service')).toBeInTheDocument();
        expect(screen.getByText('Redeemed Service')).toBeInTheDocument();
        expect(screen.getByText('Rated Service')).toBeInTheDocument();
      });
    });
  });
});
