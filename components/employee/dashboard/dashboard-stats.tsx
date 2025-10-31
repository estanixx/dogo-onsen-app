'use client';

import { DogoSection } from '@/components/shared/dogo-ui';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home } from 'lucide-react';

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
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-white font-semibold">Mesas con disponibilidad</h3>
          </div>
          <ScrollArea className="h-48">
            <div className="grid grid-cols-4 gap-2 mt-2">
              {Array(50)
                .fill(null)
                .map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      i % 6 > 2 ? 'bg-secondary' : 'bg-destructive'
                    }`}
                  >
                    {i % 6 > 2 ? (
                      <span className="text-white font-bold">✔</span>
                    ) : (
                      <span className="text-white font-bold">✘</span>
                    )}
                  </div>
                ))}
              {/* Mocked data for tables */}
            </div>
          </ScrollArea>
        </div>
      </div>
    </DogoSection>
  );
}
