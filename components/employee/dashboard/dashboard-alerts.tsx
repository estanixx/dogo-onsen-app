'use client';

import { DogoSection } from '@/components/shared/dogo-ui';
import { Bell, Truck } from 'lucide-react';

type DashboardData = any;

export function DashboardAlerts({ data }: { data?: DashboardData | null }) {
  const stock = data?.stock_alerts ?? data?.stockAlerts ?? 0;
  const pending = data?.pending_orders ?? data?.pendingOrders ?? 0;

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
              <p>{stock} items por debajo de stock mínimo</p>
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
              <p>{pending} pedido(s) pendiente(s)</p>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[var(--gold)] font-bold text-lg">
              <p>Proveedor pendiente</p>
            </div>
          </div>
        </div>
      </div>
    </DogoSection>
  );
}
