import { ReservationList } from '@/components/room/reservation/reservation-list';

interface ReservationsPageProps {
  params: {
    id: string;
  };
}

/**
 * Displays all reservations for the current spirit
 * Shows both active and past reservations
 */
export default async function ReservationsPage({ params }: ReservationsPageProps) {
  const { id } = await params;
  console.log(id);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-[var(--gold)] mb-2">Mis Reservaciones</h1>
        <p className="text-[#a89f8a] text-sm">Visualiza y administra tus reservaciones.</p>
      </div>

      <ReservationList accountId={id} />
    </div>
  );
}
