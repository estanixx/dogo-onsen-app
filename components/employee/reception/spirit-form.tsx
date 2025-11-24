'use client';

import * as React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { getAllSpiritTypes, createSpirit } from '@/lib/api';
import { Spirit, SpiritType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CameraCapture from './camera-capture';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import SpiritCard from '@/components/shared/spirit-card';
import { useSpirit } from '@/context/spirit-context';

interface SpiritSelectProps {
  id: string;
  setId: (id: string) => void;
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
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    getAllSpiritTypes().then(setTypes);
  }, []);

  const lookup = async () => {
    setLoading(true);
    const s = null; // await getSpirit(id)
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
    } catch (error) {
      toast.error('Error al crear el espíritu', { duration: 4000 });
    }
  };

  const imagePreview = form.watch('image');

  return (
    <Form {...form}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="id">Número de identificación</Label>
          <Input id="id" value={id} onChange={(e) => setId(e.target.value)} placeholder="Ej. 007" />
          <div className="flex gap-2">
            <Button onClick={lookup} disabled={!id || loading}>
              Buscar
            </Button>
          </div>
        </div>

        {spirit && <SpiritCard spirit={spirit} />}

        {creating && (
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 border rounded-md space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm">Tipo</FormLabel>
                  <FormControl>
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="block text-sm mb-1">Foto</label>
              {!imagePreview && (
                // <CameraCapture onCapture={(dataUrl) => form.setValue('image', dataUrl)} />
                <CameraCapture
                  onCapture={(localUrl) => {
                    // Mostrar preview instantáneo
                    setPreviewImage(localUrl);
                  }}
                  onUploadComplete={(s3Url, faces) => {
                    // Guardar la URL real de la BD
                    setFinalImageUrl(s3Url);
                    // Guardar los datos de rostros
                    setFacesData(faces);
                    console.log('Imagen guardada en S3:', s3Url);
                    console.log('Rostros detectados:', faces);
                  }}
                />
              )}
              {imagePreview && (
                // plain img is fine for preview
                <Image
                  src={imagePreview}
                  width={600}
                  height={400}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded-md mt-2"
                />
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit">Crear</Button>
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
          </form>
        )}
      </div>
      {spirit && (
        <Button variant="outline" onClick={() => setOpen(false)}>
          Seleccionar
        </Button>
      )}
    </Form>
  );
}
