import { ReactNode } from 'react';
import { SpiritInfo } from '@/components/room/shared/spirit-info';
import { getCurrentVenueAcount } from '@/lib/api';
import { VenueAccount } from '@/lib/types';
import { DogoHeader, DogoPage, DogoSection } from '@/components/shared/dogo-ui';
import Link from 'next/link';
import DogoIcon from '@/components/shared/dogo-icon';

interface RoomLayoutProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

/**
 * Layout for room-specific pages
 * Includes a left sidebar with spirit information and account details
 */
export default async function RoomLayout({ children, params }: RoomLayoutProps) {
  const roomId = (await params).id;
  const account = (await getCurrentVenueAcount(roomId)) as VenueAccount;
  return (
    <DogoPage>
      <DogoHeader title={`Habitación #${roomId}`} />
      <DogoSection className="border-2 border-white rounded-lg object-cover flex w-full text-white">
        {/* Left sidebar with spirit info */}
        <aside className="w-72 p-6 flex flex-col items-center justify-between">
          <SpiritInfo account={account} />
          <Link href={`/room/${roomId}`} className="flex justify-center items-center">
            <DogoIcon className="fill-white size-12" />
          </Link>
        </aside>
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </DogoSection>
    </DogoPage>
  );
}
