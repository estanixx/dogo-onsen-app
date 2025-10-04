import { ReservationList } from "@/components/room/reservation/reservation-list";

interface ReservationsPageProps {
  params: {
    id: string;
  };
}

/**
 * Displays all reservations for the current spirit
 * Shows both active and past reservations
 */
export default function ReservationsPage({ params }: ReservationsPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-indigo-900 mb-2">My Reservations</h1>
        <p className="text-gray-600">View and manage your service reservations</p>
      </div>

      <ReservationList accountId={params.id} />
    </div>
  );
}
