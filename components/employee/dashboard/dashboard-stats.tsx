'use client';

import { DogoSection } from '@/components/shared/dogo-ui';
import { H3, H4, P } from '@/components/shared/typography';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home } from 'lucide-react';
import { MdTableRestaurant } from 'react-icons/md';

export function DashboardStats() {
  return (
    <DogoSection className="col-span-1 row-span-2">
      <h2 className="text-xl font-serif text-[var(--gold)] mb-4">Estado Actual</h2>

      <div className="grid grid-cols-1 gap-4 grid-rows-3">
        <div className="bg-[var(--dark-light)] p-4 rounded-lg">
          <h3 className="text-white font-semibold">Habitaciones en limpieza</h3>
          <div className="flex items-center gap-3 mb-2">
            <Home className="text-[#568682]" />
            <p className="text-4xl text-[var(--gold)]">5</p>{' '}
          </div>
          {/* Mocked for cleaning rooms data */}
        </div>

        <div className="bg-[var(--dark-light)] p-4 rounded-lg row-span-2">
          <div className="flex items-center gap-3 mb-2 text-white ">
            <h3 className="font-semibold">Mesas con disponibilidad</h3>
          </div>

          <ScrollArea className="h-48">
            <div className="grid grid-cols-4 gap-2 mt-2">
              {Array(50)
                .fill(null)
                .map((_, i) => (
                  <div
                    key={i}
                    className={`size-10 rounded-full flex items-center justify-center text-white font-bold ${
                      i % 6 === 0 ? 'bg-secondary' : i % 3 === 0 ? 'bg-destructive' : 'bg-primary'
                    }`}
                  >
                    <MdTableRestaurant className="size-5" />{' '}
                    <span className="text-xs">{i + 1}</span>
                  </div>
                ))}
              {/* Mocked data for tables */}
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
