import { CardLink } from '@/components/shared/card-link';
import { CardModal } from '@/components/room/wallet/wallet-card';
import { MdCalendarMonth, MdPool, MdAccountBalanceWallet} from 'react-icons/md';

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
        title="Services"
        description="Look at our wide variety of services for you to enjoy."
        icon={<MdPool className='size-6 text-primary'/>}
      />

      <CardLink
        href={`${base}/reservations`}
        title="Reservations"
        description="View and manage your reservations."
        icon={<MdCalendarMonth className='size-6 text-primary'/>}
      />

      {/* Wallet modal */}
      <CardModal
        title="Billetera"
        description="Agrega saldo a tu cuenta."
        icon={<MdAccountBalanceWallet className="size-6 text-primary" />}
        modalTitle="Billetera"
        modalDescription="Administra tu saldo y realiza recargas seguras."
      />
    </div>
  );
}
