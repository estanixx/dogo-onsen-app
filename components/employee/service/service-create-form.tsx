'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Service, Item } from '@/lib/types';
import { getItems } from '@/lib/api';
import { toast } from 'sonner';

interface ServiceCreateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // onSubmit receives service data and an array of item requirements
  onSubmit: (
    service: Omit<Service, 'id' | 'rating'>,
    items: { itemId: number; quantity: number }[],
  ) => Promise<void>;
}

export function ServiceCreateForm({ open, onOpenChange, onSubmit }: ServiceCreateFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [availableItems, setAvailableItems] = React.useState<Item[] | null>(null);
  const [rows, setRows] = React.useState<{ itemId?: number; quantity: number }[]>([
    { itemId: undefined, quantity: 1 },
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const serviceData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      eiltRate: Number(formData.get('eiltRate')),
      image: formData.get('image') as string,
    };

    // validate rows: require at least one row, and every row must have an item selected
    if (rows.length === 0) {
      toast.error('Debe seleccionar al menos un item');
      setLoading(false);
      return;
    }

    const missingSelection = rows.some((r) => !r.itemId || r.quantity <= 0);
    if (missingSelection) {
      toast.error('Hay filas sin item seleccionado o con cantidad inválida');
      setLoading(false);
      return;
    }

    const validRows = rows.map((r) => ({ itemId: Number(r.itemId), quantity: r.quantity }));

    try {
      await onSubmit(serviceData, validRows);
      onOpenChange(false);
    } catch (error) {
      console.error('Error al crear el servicio', error);
      toast.error('Error al crear el servicio');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const items = await getItems();
        if (mounted) {
          setAvailableItems(items);
        }
      } catch (e) {
        console.warn('Failed to load items for service form', e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const addRow = () => {
    if (availableItems && rows.length >= availableItems.length) {
      return;
    }
    setRows((r) => [...r, { itemId: undefined, quantity: 1 }]);
  };
  const removeRow = (idx: number) => setRows((r) => r.filter((_, i) => i !== idx));
  const updateRow = (idx: number, data: Partial<{ itemId?: number; quantity: number }>) =>
    setRows((r) => r.map((row, i) => (i === idx ? { ...row, ...data } : row)));

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
          <DialogTitle className="text-2xl font-semibold text-[var(--gold)]">
            Crear nuevo servicio
          </DialogTitle>
          <DialogDescription>Ingrese los detalles del nuevo servicio</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nombre del servicio
            </label>
            <Input id="name" name="name" required placeholder="Ej: Masaje relajante" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <Textarea
              id="description"
              name="description"
              required
              placeholder="Describa el servicio..."
            />
          </div>

          <div>
            <label htmlFor="eiltRate" className="block text-sm font-medium mb-1">
              Tarifa (EILT)
            </label>
            <Input id="eiltRate" name="eiltRate" type="number" required min={0} placeholder="0" />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-1">
              URL de imagen
            </label>
            <Input id="image" name="image" type="url" required placeholder="https://..." />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Items requeridos</label>
            <div className="space-y-2">
              {rows.map((row, idx) => (
                <div key={idx} className="flex gap-2 items-center min-w-0">
                  {/** prevent selecting same item twice by disabling already-selected options */}
                  <div className="flex-1 min-w-0">
                    <select
                      value={row.itemId ?? ''}
                      onChange={(e) =>
                        updateRow(idx, {
                          itemId: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      className="w-full p-2 rounded border bg-[var(--dark-light)] truncate"
                    >
                      <option value="">Seleccionar item...</option>
                      {availableItems?.map((it) => {
                        const selectedIds = rows.map((r) => String(r.itemId ?? ''));
                        const isSelectedElsewhere =
                          selectedIds.includes(String(it.id)) &&
                          String(row.itemId) !== String(it.id);
                        return (
                          <option key={it.id} value={Number(it.id)} disabled={isSelectedElsewhere}>
                            {it.name} {it.unit ? `(${it.unit})` : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={row.quantity}
                    onChange={(e) => updateRow(idx, { quantity: Number(e.target.value) })}
                    className="w-24 p-2 rounded border bg-[var(--dark-light)]"
                  />
                  <Button type="button" variant="ghost" onClick={() => removeRow(idx)}>
                    Eliminar
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <Button
                type="button"
                onClick={addRow}
                variant="outline"
                disabled={
                  !availableItems || (availableItems && rows.length >= availableItems.length)
                }
              >
                Agregar item
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" variant="default" disabled={loading}>
              {loading ? 'Creando...' : 'Crear servicio'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
