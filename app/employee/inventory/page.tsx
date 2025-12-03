'use client';

import { AuthRequired } from '@/components/employee/auth/auth-required';
import { InventoryTable } from '@/components/employee/inventory/inventory-table';
import { NewOrderModal } from '@/components/employee/inventory/new-order-modal';
import { DogoHeader, DogoSection } from '@/components/shared/dogo-ui';
import { getInventoryItems, getOrdersRaw } from '@/lib/api/index';
import { InventoryOrder, Order } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function InventoryPage() {
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;
    async function load() {
      const items = await getInventoryItems();
      if (!mounted) {
        return;
      }
      const map: Record<string, string> = {};
      items.forEach((p) => (map[String(p.id)] = p.name));
      setProducts(map);

      // Fetch orders and keep only active ones (now between orderDate and deliveryDate)
      try {
        const raw = await getOrdersRaw();
        if (!mounted) {
          return;
        }
        const now = new Date();
        const active = raw
          .filter((o: Order) => {
            const od = o.orderDate ? new Date(o.orderDate) : o.orderDate ? new Date(o.orderDate) : null;
            const dd = o.deliveryDate ? new Date(o.deliveryDate) : null;
            if (!od || !dd) {
              return false;
            }
            return now >= od && now <= dd;
          })
          .map((o: Order) => ({
            id: String(o.id),
            items: (o.items || []).map((i: InventoryOrder) => ({
              idOrder: String(i.idOrder),
              idItem: i.idItem,
              quantity: i.quantity,
            })),
            orderDate: o.orderDate ?? new Date().toISOString(),
            deliveryDate: o.deliveryDate ?? new Date().toISOString(),
          }));

        setOrders(active);
      } catch (e) {
        // ignore errors; keep orders empty
        console.warn('Failed to fetch orders', e);
      }
    }

    load();
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
                  </div>
                  <div className="text-xs text-white/60 mt-1">
                    {`Pedido el: ${new Date(o.orderDate).toLocaleDateString()}, entrega el: ${new Date(
                      new Date(o.orderDate).getTime() + 24 * 60 * 60 * 1000,
                    ).toLocaleDateString()}`}
                  </div>
                  <div className="mt-2 space-y-1">
                    {o.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <div>{products[String(item.idItem)] || `Producto #${item.idItem}`}</div>
                        <div>Cantidad: {item.quantity}</div>
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
