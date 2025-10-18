'use client';

import { ReservationCard } from './reservation-card';
import { useReservations } from '@/app/context/reservation-context';
import { Button } from '@/components/ui/button';

interface ReservationListProps {
  accountId: string;
}

export function ReservationList({ accountId }: ReservationListProps) {
  const { reservations, removeReservation, clearReservations, totalEilt } = useReservations();

  if (reservations.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Sin reservaciones</h3>
        <p className="mt-2 text-sm text-gray-600">
          Tus servicios agendados aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-100">Mis Reservaciones</h2>
          <Button onClick={clearReservations} variant="outline" className="text-sm">
            Eliminar todo
          </Button>
        </div>

        {/* Total */}
        <div className="mb-6 text-right text-lg font-semibold text-gold">
          Total: {totalEilt} EILT
        </div>

        {/* Lista */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onRemove={removeReservation}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
