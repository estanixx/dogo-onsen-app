'use client';

import { DogoSection } from '@/components/shared/dogo-ui';
import { P } from '@/components/shared/typography';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home } from 'lucide-react';
import { MdTableRestaurant } from 'react-icons/md';

type DashboardData = any;

export function DashboardStats({ data }: { data?: DashboardData | null }) {
  const occupancy = data?.today_occupancy_rate ?? data?.todayOccupancyRate ?? 0;
  const tables = data?.today_table_availability ?? [];

  // Normalize tables to have id, capacity and availableSeats
  const normTables = (tables as any[]).map((t) => ({
    id: t.id,
    capacity: t.capacity ?? t.capacity ?? 6,
    availableSeats: t.availableSeats ?? (t.capacity ? t.capacity - (t.takenSeats ?? 0) : 0),
  }));

  return (
    <DogoSection className="col-span-1 row-span-2">
      <h2 className="text-xl font-serif text-[var(--gold)] mb-4">Estado Actual</h2>

      <div className="grid grid-cols-1 gap-4 grid-rows-3">
        <div className="bg-[var(--dark-light)] p-4 rounded-lg">
          <h3 className="text-white font-semibold">Porcentaje de ocupación de Habitaciones</h3>
          <div className="flex items-center gap-3 mb-2">
            <Home className="text-[#568682]" />
            <p className="text-4xl text-[var(--gold)]">{Math.round(occupancy)}%</p>{' '}
          </div>
          {/* occupancy from backend */}
        </div>

        <div className="bg-[var(--dark-light)] p-4 rounded-lg row-span-2">
          <div className="flex items-center gap-3 mb-2 text-white ">
            <h3 className="font-semibold">Mesas con disponibilidad</h3>
          </div>

          <ScrollArea className="h-48">
            <div className="grid grid-cols-4 gap-2 mt-2">
              {normTables.map((t) => {
                const status =
                  t.availableSeats === 0
                    ? 'bg-destructive'
                    : t.availableSeats === t.capacity
                      ? 'bg-secondary'
                      : 'bg-primary';
                return (
                  <div
                    key={t.id}
                    className={`size-10 rounded-full flex items-center justify-center text-white font-bold ${status}`}
                  >
                    <MdTableRestaurant className="size-5" /> <span className="text-xs">{t.id}</span>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <div className="text-white mt-4">
            <span className="flex gap-3 items-center">
              <div className="bg-secondary size-3 rounded-full"></div>
              <P className="text-xs">Disponible</P>
            </span>
            <span className="flex gap-3 items-center">
              <div className="bg-primary size-3 rounded-full"></div>
              <P className="text-xs">Parcialmente Disponible</P>
            </span>
            <span className="flex gap-3 items-center">
              <div className="bg-destructive size-3 rounded-full"></div>
              <P className="text-xs">Ocupado</P>
            </span>
          </div>
        </div>
      </div>
    </DogoSection>
  );
}
