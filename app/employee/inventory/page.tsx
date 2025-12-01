'use client';

import { AuthRequired } from '@/components/employee/auth/auth-required';
import { InventoryTable } from '@/components/employee/inventory/inventory-table';
import { NewOrderModal } from '@/components/employee/inventory/new-order-modal';
import { DogoHeader, DogoSection } from '@/components/shared/dogo-ui';
import { getInventoryItems } from '@/lib/api/index';
import { InventoryOrder } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function InventoryPage() {
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [orders, setOrders] = useState<InventoryOrder[]>([]);
  const [products, setProducts] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;
    getInventoryItems().then((items) => {
      if (!mounted) {
        return;
      }
      const map: Record<string, string> = {};
      items.forEach((p) => (map[String(p.id)] = p.name));
      setProducts(map);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthRequired>
      <div className="space-y-6">
        <DogoHeader title="Gestión de Inventario" className="-mt-16" />

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-serif tracking-wide text-[var(--gold)] border-b-2 border-[var(--gold)]/20 pb-1">
            Existencias actuales
          </h2>
        </div>

        <DogoSection>
          <InventoryTable onAddOrder={() => setIsNewOrderModalOpen(true)} />
        </DogoSection>

        <NewOrderModal
          open={isNewOrderModalOpen}
          onOpenChange={setIsNewOrderModalOpen}
          onOrderCreated={(order) => setOrders((prev) => [order, ...prev])}
        />

        {orders.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-serif text-[var(--gold)] mb-2">Pedidos recientes</h3>
            <div className="space-y-2 pb-4">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="p-3 rounded-md border border-[var(--gold)]/20 bg-[var(--dark-light)] text-[var(--smoke)]"
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium">Pedido #{o.id}</div>
                    <div className="text-xs text-white/70">{o.status}</div>
                  </div>
                  <div className="text-xs text-white/60 mt-1">
                    {new Date(o.createdAt).toLocaleString()}
                  </div>
                  <div className="mt-2 text-sm">
                    {o.items.map((it) => (
                      <div key={it.productId} className="text-sm text-white/80">
                        {products[it.productId] ?? it.productId} x{it.quantity}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AuthRequired>
  );
}
