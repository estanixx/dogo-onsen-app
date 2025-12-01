import { CardModal } from '@/components/room/wallet/wallet-card';
import { CardLink } from '@/components/shared/card-link';
import { MdAccountBalanceWallet, MdCalendarMonth, MdPool } from 'react-icons/md';

/**
 * Main page for a specific room identified by its ID.
 * @param params - route params provided by Next.js (expects `id`)
 */
export default async function RoomPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const base = `/room/${id}`;

  return (
    <div className="grid grid-cols-2 gap-4">
      <CardLink
        href={`${base}/services`}
        title="Servicios"
        description="Mira nuestra amplia variedad de servicios para tu disfrute."
        icon={<MdPool className="size-6 text-primary" />}
      />

      <CardLink
        href={`${base}/reservations`}
        title="Reservaciones"
        description="Visualiza y administra tus reservaciones."
        icon={<MdCalendarMonth className="size-6 text-primary" />}
      />

      {/* Modal wallet */}
      <CardModal
        title="Billetera"
        description="Agrega saldo a tu cuenta."
        icon={<MdAccountBalanceWallet className="size-6 text-primary" />}
        modalTitle="Billetera"
        modalDescription="Administra tu saldo y realiza recargas seguras."
        venueId={id}
      />
    </div>
  );
}
