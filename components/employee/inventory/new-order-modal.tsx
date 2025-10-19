'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { createInventoryOrder, getInventoryItems } from '@/lib/api';
import { InventoryItem } from '@/lib/types';

interface NewOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OrderItem {
  productId: string;
  quantity: number;
}

export function NewOrderModal({ open, onOpenChange }: NewOrderModalProps) {
  const [items, setItems] = useState<OrderItem[]>([{ productId: '', quantity: 1 }]);
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await createInventoryOrder(items);
      toast.success('Pedido creado correctamente');
      onOpenChange(false);
      setItems([{ productId: '', quantity: 1 }]);
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
          max-h-[90vh] overflow-y-auto
        "
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-primary">
            Realizar pedido a Howl
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-[1fr,auto,auto] gap-4 items-end">
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
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="mr-2">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/80"
            disabled={
              isLoading ||
              items.some((item) => {
                return !item.productId;
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
