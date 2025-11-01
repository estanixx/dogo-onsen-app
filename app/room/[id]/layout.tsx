import { ReactNode } from 'react';
import { SpiritInfo } from '@/components/room/shared/spirit-info';
import { getCurrentVenueAcount } from '@/lib/api';
import { VenueAccount } from '@/lib/types';
import { DogoHeader, DogoPage, DogoSection } from '@/components/shared/dogo-ui';
import Link from 'next/link';
import DogoIcon from '@/components/shared/dogo-icon';

interface RoomLayoutProps {
  children: ReactNode;
  params: Promise<{
    id: string;
  }>;
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
      <div className="w-full lg:w-2/3">
        <DogoHeader title={`Habitación #${roomId}`} />
        <DogoSection className="border-2 border-white rounded-lg object-cover flex flex-col lg:flex-row w-full text-white relative pt-8">
          {/* Left sidebar with spirit info */}
          <aside className="w-full lg:w-72 p-6 flex flex-col items-center justify-between">
            <SpiritInfo account={account} />
            <Link
              href={`/room/${roomId}`}
              className="flex gap-2 items-center font-bold font-base absolute top-2 left-2 shadow-[0px_0px_4px_rgba(255,255,255,0.6)] px-4 rounded-lg"
            >
              <DogoIcon className="fill-white size-10" /> Inicio
            </Link>
          </aside>
          {/* Main content area */}
          <main className="flex-1 overflow-y-auto p-6 w-full">{children}</main>
        </DogoSection>
      </div>
    </DogoPage>
  );
}
