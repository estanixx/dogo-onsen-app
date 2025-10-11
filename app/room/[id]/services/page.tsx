import { getAvailableServices, getCurrentVenueAcount } from '@/lib/api';
import { Service, VenueAccount } from '@/lib/types';
import ServiceSearch from '@/components/room/service/service-search';
import { ServiceDialog } from '@/components/room/service/service-dialog';

interface ServicesPageProps {
  searchParams: {
    q?: string;
  };
  params: {
    id: string;
  };
}
/**
 * Services page for a specific room identified by its ID.
 * Accepts `searchParams` (e.g. ?q=massage) and passes them to the API.
 */
export default async function ServicesPage({ searchParams, params }: ServicesPageProps) {
  const q = (await searchParams)?.q ?? undefined;
  const services: Service[] = await getAvailableServices(q);
  const roomId = (await params).id;
  const account = (await getCurrentVenueAcount(roomId)) as VenueAccount;

  return (
    <div className="space-y-4">
      <ServiceSearch initialQuery={q} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((s) => (
          <ServiceDialog key={s.id} service={s} account={account} />
        ))}
      </div>
    </div>
  );
}
