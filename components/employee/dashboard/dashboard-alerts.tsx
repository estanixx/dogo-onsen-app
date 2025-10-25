'use client';

import { DogoSection } from '@/components/shared/dogo-ui';
import { Bell, Truck } from 'lucide-react';

export function DashboardAlerts() {
  return (
    <DogoSection className="col-span-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-serif text-[var(--gold)] mb-4 flex items-center gap-2">
            <Bell className="text-[var(--gold)]" />
            Alertas inventario
          </h2>
          <div className="bg-[var(--gold)] p-4 rounded-lg">
            <div className="flex items-center gap-2 text-white">
              <Bell />
              <p>3 items por debajo de stock mínimo</p> {/* Texto mockeado */}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-serif text-[var(--gold)] mb-4 flex items-center gap-2">
            Próximas entregas
          </h2>
          <div className="bg-[var(--dark-light)] p-4 rounded-lg">
            <div className="flex items-center gap-2 text-white">
              <Truck className="text-[#568682]" />
              <p>1 pedido pendiente</p> {/* Texto mockeado */}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[var(--gold)] font-bold text-lg">
              <p>Howl</p>
            </div>
          </div>
        </div>
      </div>
    </DogoSection>
  );
}
