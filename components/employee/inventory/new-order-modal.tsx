'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEmployee } from '@/context/employee-context';
import { createOrder, getInventoryItems } from '@/lib/api';
import { InventoryItem, InventoryOrder, Order } from '@/lib/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface NewOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderCreated?: (order: Order) => void;
}

export function NewOrderModal({ open, onOpenChange, onOrderCreated }: NewOrderModalProps) {
  const [items, setItems] = useState<InventoryOrder[]>([{ idOrder: '', idItem: 1, quantity: 1 }]);
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const { employeeProfile } = useEmployee();

  useEffect(() => {
    async function loadProducts() {
      if (open) {
        const items = await getInventoryItems();
        setProducts(items);
      }
    }

    loadProducts();
  }, [open]);

  const handleAddItem = () => {
    setItems([...items, { idOrder: '', idItem: 1, quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index: number, field: keyof InventoryOrder, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const idEmployee = employeeProfile?.clerkId ?? employeeProfile?.id ?? 'unknown';
      // Normalize orderDate/deliveryDate using timezone GMT-5
      const TZ_OFFSET_HOURS = -5; // GMT-5
      // Compute the current date in the target timezone by offsetting now
      const targetNow = new Date(Date.now() + TZ_OFFSET_HOURS * 60 * 60 * 1000);
      const y = targetNow.getUTCFullYear();
      const m = targetNow.getUTCMonth();
      const d = targetNow.getUTCDate();

      // Instant (UTC) corresponding to target timezone's YYYY-MM-DD 00:00
      const startOfTodayMillis = Date.UTC(y, m, d, 0, 0, 0) ;
      const startOfToday = new Date(startOfTodayMillis);

      // Tomorrow's date parts in target timezone
      const tomorrowDate = new Date(Date.UTC(y, m, d + 1, 0, 0, 0));
      const ty = tomorrowDate.getUTCFullYear();
      const tm = tomorrowDate.getUTCMonth();
      const td = tomorrowDate.getUTCDate();

      // Instant (UTC) corresponding to target timezone's tomorrow 23:59
      const endOfTomorrowMillis = Date.UTC(ty, tm, td, 23, 59, 0) ;
      const endOfTomorrow = new Date(endOfTomorrowMillis);

      
      const payloadOrderDate = startOfToday.toISOString();
      const payloadDelivery = endOfTomorrow.toISOString();

      const order = await createOrder(
        items.map((item) => ({
          idOrder: '',
          idItem: item.idItem,
          quantity: item.quantity,
        })),
        {
          idEmployee,
          orderDate: payloadOrderDate,
          deliveryDate: payloadDelivery,
        },
      );
      onOrderCreated?.(order);
      toast.success('Pedido creado correctamente');
      onOpenChange(false);
      setItems([{ idOrder: '', idItem: 1, quantity: 1 }]);
      setDeliveryDate(null);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error al crear el pedido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-w-md rounded-2xl border
          border-[var(--gold)]
          bg-[var(--dark-light)]
          text-[var(--smoke)]
          shadow-[0_0_25px_var(--gold)]
          
        "
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-primary">
            Realizar pedido a Howl
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="py-4 px-2 overflow-y-hidden max-h-[70vh]">
          {items.map((item, index) => (
            <div key={index} className="my-4 grid grid-cols-[1fr,auto,auto] gap-4 items-end">
              <div>
                <Label
                  htmlFor={`product-${index}`}
                  className="text-sm font-bold tracking-wider text-[var(--smoke)]"
                >
                  Producto
                </Label>
                <select
                  id={`product-${index}`}
                  className="w-full bg-background border border-white/20 rounded-md p-2 text-white"
                  value={item.idItem}
                  onChange={(e) => handleItemChange(index, 'idItem', e.target.value)}
                >
                  <option value="">Seleccionar producto</option>
                  {products.map((product) => {
                    return (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.quantity} en inventario)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <Label
                  htmlFor={`quantity-${index}`}
                  className="text-sm font-bold tracking-wider text-[var(--smoke)]"
                >
                  Cantidad
                </Label>
                <Input
                  id={`quantity-${index}`}
                  type="number"
                  required
                  min={1}
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                  className="
                    px-3 py-2 rounded-md border text-[var(--smoke)]
                    bg-[var(--dark)] border-[var(--gold-dark)]
                    placeholder:text-[color:var(--gold-light)]/50
                    focus:outline-none focus:border-[var(--gold-light)]
                    [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                  "
                />
              </div>

              <Button
                type="button"
                variant="destructive"
                onClick={() => handleRemoveItem(index)}
                disabled={items.length <= 1}
              >
                Eliminar
              </Button>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={handleAddItem} className="w-full">
            Agregar producto
          </Button>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="md:mr-2">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/80"
            disabled={
              isLoading ||
              !employeeProfile ||
              items.some((item) => {
                return !item.idItem;
              })
            }
          >
            {isLoading ? 'Enviando...' : 'Realizar pedido'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
