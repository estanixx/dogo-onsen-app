'use client';

import { AuthRequired } from '@/components/employee/auth/auth-required';
import { InventoryTable } from '@/components/employee/inventory/inventory-table';
import { NewOrderModal } from '@/components/employee/inventory/new-order-modal';
import { DogoHeader, DogoSection } from '@/components/shared/dogo-ui';
import { getOrdersRaw, getItems, redeemOrder } from '@/lib/api/index';
import { Order } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function InventoryPage() {
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [itemNames, setItemNames] = useState<Record<number, string>>({});
  const [redeeming, setRedeeming] = useState<number | null>(null);

  const handleRedeemOrder = async (orderId: number) => {
    setRedeeming(orderId);
    try {
      const updatedOrder = await redeemOrder(orderId);
      if (updatedOrder) {
        // Update the order in state
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, items: o.items.map((item) => ({ ...item, redeemed: true })) }
              : o,
          ),
        );
      }
    } finally {
      setRedeeming(null);
    }
  };

  const isDeliveryDateToday = (deliveryDate: string) => {
    const today = new Date();
    const delivery = new Date(deliveryDate);
    return (
      today.getDate() === delivery.getDate() &&
      today.getMonth() === delivery.getMonth() &&
      today.getFullYear() === delivery.getFullYear()
    );
  };

  const isOrderRedeemed = (order: Order) => {
    return order.items?.every((item) => item.redeemed === true) ?? false;
  };

  // Temporarily allow redeeming any order for testing
  // const canRedeemOrder = (order: Order) => {
  //   return !isOrderRedeemed(order);
  // };

  useEffect(() => {
    let mounted = true;

    async function loadItems() {
      const items = await getItems();
      const names: Record<number, string> = {};
      items.forEach((item) => {
        const itemId = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
        names[itemId] = item.name;
      });
      if (mounted) {
        setItemNames(names);
      }
    }

    async function loadOrders() {
      const raw = await getOrdersRaw();
      if (!mounted) {
        return;
      }
      const now = new Date();
      const active = raw.filter((o: Order) => {
        const od = o.orderDate ? new Date(o.orderDate) : null;
        const dd = o.deliveryDate ? new Date(o.deliveryDate) : null;
        if (!od || !dd) {
          return false;
        }
        return now >= od && now <= dd;
      });
      // Orders already come with items from backend, no need to enrich
      if (mounted) {
        setOrders(active);
      }
    }

    loadItems();
    loadOrders();
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
          onOrderCreated={(order) => {
            // Order already comes with items from backend, just add to list
            setOrders((prev) => [order, ...prev]);
          }}
        />

        {orders.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-serif text-[var(--gold)] mb-2">Pedidos recientes</h3>
            <div className="space-y-2 pb-4">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="p-3 rounded-md border border-[var(--gold)]/20 bg-[var(--dark-light)] text-[var(--smoke)] overflow-hidden"
                >
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div className="font-medium">Pedido #{o.id}</div>
                    <Button
                      onClick={() => handleRedeemOrder(o.id)}
                      disabled={
                        redeeming === o.id ||
                        isOrderRedeemed(o) ||
                        !isDeliveryDateToday(o.deliveryDate)
                      }
                      variant="outline"
                      size="sm"
                      className="bg-[var(--gold)]/10 border-[var(--gold)]/30 text-[var(--gold)] hover:bg-[var(--gold)]/20 w-max"
                    >
                      {redeeming === o.id
                        ? 'Redimiendo...'
                        : isOrderRedeemed(o)
                          ? '✓ Redimido'
                          : 'Redimir'}
                    </Button>
                  </div>
                  <div className="text-xs text-white/60 mt-1">
                    {`Fecha de encargo: ${new Date(o.orderDate).toLocaleDateString()}. Fecha de entrega: ${new Date(
                      o.deliveryDate,
                    ).toLocaleDateString()}.`}
                  </div>
                  <div className="mt-2 space-y-1">
                    {(o.items || []).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm flex-wrap gap-x-4">
                        <div className="flex-1">
                          {itemNames[item.idItem] ?? `Item #${item.idItem}`}
                        </div>
                        <div className="text-right pb-2">Cantidad: {item.quantity}</div>
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
