import { getAvailableServices } from '@/lib/api';
import { Service } from '@/lib/types';
import ServiceSearch from '@/components/room/service/service-search';
import { ServiceCard } from '@/components/room/service/service-card';

/**
 * Services page for a specific room identified by its ID.
 * Accepts `searchParams` (e.g. ?q=massage) and passes them to the API.
 */
export default async function ServicesPage({ searchParams }: { searchParams?: { q?: string } }) {
  const q = (await searchParams)?.q ?? undefined;
  const services: Service[] = await getAvailableServices(q);

  return (
    <div className="space-y-4">
      <ServiceSearch initialQuery={q} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
    </div>
  );
}
