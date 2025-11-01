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
import { Service } from '@/lib/types';
import { toast } from 'sonner';

interface ServiceCreateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (service: Omit<Service, 'id' | 'rating'>) => void;
}

export function ServiceCreateForm({ open, onOpenChange, onSubmit }: ServiceCreateFormProps) {
  const [loading, setLoading] = React.useState(false);

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

    try {
      await onSubmit(serviceData);
      onOpenChange(false);
      toast.success('Servicio creado exitosamente');
    } catch (error) {
      toast.error('Error al crear el servicio');
    } finally {
      setLoading(false);
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
