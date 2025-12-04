'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createSpirit, getAllSpiritTypes, getSpirit } from '@/lib/api';
import { Spirit, SpiritType } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import CameraCapture from './camera-capture';
// Note: this component is intentionally NOT using the Form wrapper
// because it is rendered inside another form. We use react-hook-form's
// register/Controller directly instead.
import SpiritCard from '@/components/shared/spirit-card';
import { useSpirit } from '@/context/spirit-context';
import { toast } from 'sonner';

interface SpiritSelectProps {
  id: number;
  setId: (id: number) => void;
  setOpen: (open: boolean) => void;
}

const createSpiritSchema = z.object({
  name: z.string().min(2, { message: 'Nombre demasiado corto' }),
  typeId: z.string().min(1, { message: 'Selecciona un tipo' }),
  image: z.url(),
});

type CreateSpiritValues = z.infer<typeof createSpiritSchema>;

export default function SpiritForm({ id, setId, setOpen }: SpiritSelectProps) {
  const { setSpirits } = useSpirit();
  const [loading, setLoading] = React.useState(false);
  const [spirit, setSpirit] = React.useState<Spirit | null>(null);
  const [types, setTypes] = React.useState<SpiritType[]>([]);
  const [creating, setCreating] = React.useState(false);

  React.useEffect(() => {
    getAllSpiritTypes().then(setTypes);
  }, []);

  const lookup = async () => {
    setLoading(true);
    const s = await getSpirit(id);
    setSpirit(s);
    setCreating(!s);
    setLoading(false);
  };

  const form = useForm<CreateSpiritValues>({
    resolver: zodResolver(createSpiritSchema),
    defaultValues: { name: '', typeId: '', image: undefined },
  });

  const onSubmit = async (values: CreateSpiritValues) => {
    // TODO: persist new spirit to server
    try {
      const created: Spirit = await createSpirit(id, values.name, values.typeId, values.image);
      setSpirit(created);
      (setSpirits as unknown as React.Dispatch<React.SetStateAction<Spirit[]>>)((prev) =>
        prev ? [...prev, created] : [created],
      );
      setCreating(false);
      // optionally set the id input to the new spirit id
      setId(created.id);
      toast.success('Espíritu creado con éxito', { duration: 4000 });
    } catch {
      toast.error('Error al crear el espíritu', { duration: 4000 });
    }
  };

  const selectedType = form.watch('typeId');

  const imagePreview = form.watch('image');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="id">Número de identificación</Label>
        <Input
          type="number"
          id="id"
          value={id}
          onChange={(e) => setId(parseInt(e.target.value))}
          placeholder="Ej. 007"
        />
        <div className="flex gap-2">
          <Button onClick={lookup} disabled={!id || loading}>
            Buscar
          </Button>
        </div>
      </div>

      {spirit && <SpiritCard spirit={spirit} />}

      {creating && (
        <div className="p-4 border rounded-md space-y-2">
          <div>
            <label className="block text-sm">Nombre</label>
            <Input placeholder="Nombre" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {(form.formState.errors.name as { message: string }).message}
              </p>
            )}
          </div>

          <Controller
            name="typeId"
            control={form.control}
            render={({ field }) => (
              <div>
                <label className="block text-sm">Tipo</label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full p-2 rounded-md">
                    <SelectValue placeholder="Tipo de espíritu" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.typeId && (
                  <p className="text-sm text-red-500">
                    {(form.formState.errors.typeId as { message: string }).message}
                  </p>
                )}
              </div>
            )}
          />

          <div>
            <label className="block text-sm mb-1">Foto</label>

            {/* Si ya hay imagen en el formulario, mostramos el preview */}
            {imagePreview ? (
              <div className="relative inline-block">
                <Image
                  src={imagePreview}
                  width={300}
                  height={300}
                  alt="preview"
                  className="w-full h-48 object-cover rounded-md mt-2 border"
                />
                <Button
                  type="button" // Importante: type="button" para no enviar el form
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => form.setValue('image', '' as never)} // Borramos la imagen del form
                >
                  X
                </Button>
              </div>
            ) : selectedType ? (
              /* Si no hay imagen, mostramos la cámara */
              <CameraCapture
                typeId={form.watch('typeId')}
                // 1. Preview local rápido (opcional)
                onCapture={() => {}}
                // 2. AQUÍ ESTÁ EL CAMBIO IMPORTANTE:
                onUploadComplete={(s3Url, faces) => {
                  // En lugar de setFinalImageUrl, le decimos al form que actualice el campo 'image'
                  form.setValue('image', s3Url, {
                    shouldValidate: true, // Para que Zod verifique que es una URL válida
                    shouldDirty: true,
                  });

                  // Como tu esquema Zod no tiene campo para 'faces',
                  // simplemente notificamos o lo ignoramos.
                  if (faces.length > 0) {
                    toast.success('Rostro detectado y guardado');
                  }
                }}
                // 3. Manejo de errores
                onError={(msg) => toast.error(msg)}
              />
            ) : (
              // Si no ha seleccionado tipo, mostramos un mensaje placeholder
              <div className="p-4 border rounded-md text-sm text-muted-foreground bg-muted/30">
                Selecciona un tipo antes de tomar la foto.
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="button" onClick={() => form.handleSubmit(onSubmit)()}>
              Crear
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCreating(false);
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
      {spirit && (
        <Button variant="outline" onClick={() => setOpen(false)}>
          Seleccionar
        </Button>
      )}
    </div>
  );
}
