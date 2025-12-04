'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEmployee } from '@/context/employee-context';
import { createOrder, getItems } from '@/lib/api';
import { InventoryOrder, Order, Item } from '@/lib/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

interface NewOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderCreated?: (order: Order) => void;
}

export function NewOrderModal({ open, onOpenChange, onOrderCreated }: NewOrderModalProps) {
  const [items, setItems] = useState<InventoryOrder[]>([{ idOrder: 1, idItem: 1, quantity: 1 }]);
  const [products, setProducts] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const { employeeProfile } = useEmployee();

  const hasInvalidItems = items.some(
    (item) => !item.idItem || !item.quantity || item.quantity <= 0,
  );

  useEffect(() => {
    async function loadProducts() {
      if (open) {
        const items = await getItems();
        setProducts(items);
      }
    }

    loadProducts();
  }, [open]);

  const handleAddItem = () => {
    // Find first available product not already in items
    const usedIds = new Set(items.map((it) => Number(it.idItem)));
    const firstAvailable = products.find((p) => !usedIds.has(Number(p.id)));
    const defaultIdItem = firstAvailable
      ? Number(firstAvailable.id)
      : products[0]?.id
        ? Number(products[0].id)
        : 1;
    setItems([...items, { idOrder: 1, idItem: defaultIdItem, quantity: 1 }]);
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

      const order = await createOrder(
        items.map((item) => ({
          idOrder: 0, // Placeholder, backend assigns the real ID
          idItem: Number(item.idItem),
          quantity: item.quantity,
        })),
        {
          idEmployee,
          orderDate: new Date().toISOString(),
          deliveryDate: new Date().toISOString(), // Backend will normalize this
        },
      );
      onOrderCreated?.(order);
      toast.success('Pedido creado correctamente');
      onOpenChange(false);
      setItems([{ idOrder: 1, idItem: 1, quantity: 1 }]);
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
          <DialogDescription className="text-sm text-[var(--smoke)]/70">
            Selecciona los productos y cantidades que deseas ordenar
          </DialogDescription>
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
                  value={item.idItem || ''}
                  onChange={(e) => handleItemChange(index, 'idItem', parseInt(e.target.value, 10))}
                >
                  <option value="">Seleccionar producto</option>
                  {products.map((product) => {
                    const productId = Number(product.id);
                    const isUsed = items.some(
                      (it, idx) => idx !== index && Number(it.idItem) === productId,
                    );
                    return (
                      <option key={product.id} value={product.id} disabled={isUsed}>
                        {product.name} {isUsed ? '(Ya seleccionado)' : ''}
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
                  value={item.quantity || ''}
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

          <Button
            type="button"
            variant="outline"
            onClick={handleAddItem}
            className="w-full"
            disabled={items.length >= products.length}
          >
            Agregar producto
          </Button>
        </ScrollArea>

        {hasInvalidItems && (
          <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/50 rounded-md text-red-400 text-sm">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>Por favor completa todos los productos y cantidades válidas (mínimo 1)</span>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="md:mr-2">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/80"
            disabled={isLoading || !employeeProfile || hasInvalidItems}
          >
            {isLoading ? 'Enviando...' : 'Realizar pedido'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
