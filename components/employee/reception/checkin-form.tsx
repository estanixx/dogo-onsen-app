'use client';

import React, { useEffect, useState } from 'react';
import { createVenueAccount, getAvailablePrivateVenues, getSpirit } from '@/lib/api/index';
import SpiritSelect from './spirit-select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { VenueAccount } from '@/lib/types';

export type CheckInResult = {
  venueId: string;
  pin: string;
  id: number;
  checkin: Date;
  checkout: Date;
};
interface CheckInFormProps {
  initialValues?: Partial<CheckInResult>;
}
export default function CheckInForm({ initialValues }: CheckInFormProps) {
  const [, setPin] = useState<string | null>(null);

  // Get available venues
  const [venues, setVenues] = useState<{ id: string; state: boolean }[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const startOfDay = (d = new Date()) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  const schema = z
    .object({
      id: z.int().min(1, 'Selecciona un espíritu'),
      room: z.string().min(1, 'Selecciona una habitación').nonempty('Selecciona una habitación'),
      checkin: z.date().refine((d) => d >= startOfDay(), {
        message: 'La fecha de entrada debe ser hoy o posterior',
      }),
      checkout: z.date(),
    })
    .refine((data) => data.checkout > data.checkin, {
      path: ['checkout'],
      message: 'La fecha de salida debe ser posterior a la entrada',
    });

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: isNaN(initialValues?.id || 0) ? initialValues?.id : 0,
      room: initialValues?.venueId ? String(initialValues.venueId) : '',
      checkin: initialValues?.checkin ?? startOfDay(),
      checkout: initialValues?.checkout ?? startOfDay(),
    },
  });

  const { control, watch, reset } = form;

  const clearForm = () => reset({ id: 0, room: '', checkin: startOfDay(), checkout: startOfDay() });

  const watchedCheckin = watch('checkin');
  const watchedCheckout = watch('checkout');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!watchedCheckin || !watchedCheckout) {
          return;
        }
        const data = await getAvailablePrivateVenues(watchedCheckin, watchedCheckout);
        setVenues(data);
      } catch (err) {
        console.error('Failed to load venues', err);
        if (mounted) {
          setVenues([]);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [watchedCheckin, watchedCheckout]);

  const onSubmit = async (values: FormValues) => {
    const spirit = getSpirit(values.id);
    if (!spirit) {
      toast.error('No se encontró el espíritu seleccionado.', { duration: 4000 });
      return;
    }

    setIsSuccess(true);

    // Generate a new PIN. In the future this should be handled by the backend
    const account = await createVenueAccount({
      spiritId: values.id,
      privateVenueId: String(Number(values.room)),
      startTime: values.checkin,
      endTime: values.checkout,
    });
    if (account && (account as { detail: string })?.detail) {
      toast.error((account as { detail: string }).detail, { duration: 8000 });
      setIsSuccess(false);
      return;
    }
    if (!account) {
      toast.error('Error al crear la cuenta de la habitación. Inténtalo de nuevo.', {
        duration: 8000,
      });
      setIsSuccess(false);
      return;
    }
    const newPin = (account as VenueAccount).pin;
    setPin(newPin);

    toast.success(`Habitación ${values.room} reservada con éxito. \nPIN de seguridad: ${newPin}`, {
      duration: 20_000,
    });

    clearForm();
  };

  return (
    <aside className="w-full p-6 flex flex-col items-center justify-start [&>div]:w-full">
      <h2 className="font-titles text-3xl font-bold text-[var(--gold)] mb-6 tracking-wider">
        Check-In: Reservar habitación
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
          <FormField
            control={control}
            name="id"
            render={({ field }) => (
              <FormItem className="truncate">
                <FormLabel className="text-lg w-full">Seleccionar Espíritu</FormLabel>
                <FormControl>
                  <SpiritSelect id={field.value} setId={(v: number) => field.onChange(v)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="checkin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Fecha de entrada</FormLabel>
                <Popover open={checkinOpen} onOpenChange={setCheckinOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-dark border border-gold/20 focus:outline-none focus:border-gold-light text-smoke"
                    >
                      {field.value ? field.value.toISOString().split('T')[0] : 'Seleccionar fecha'}
                      <ChevronDownIcon />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      hidden={{ before: new Date() }}
                      selected={field.value}
                      onSelect={(d) => {
                        if (d) {
                          field.onChange(d);
                        }
                        setCheckinOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="checkout"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Fecha de salida</FormLabel>
                <Popover open={checkoutOpen} onOpenChange={setCheckoutOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-dark border border-gold/20 focus:outline-none focus:border-gold-light text-smoke"
                    >
                      {field.value ? field.value.toISOString().split('T')[0] : 'Seleccionar fecha'}
                      <ChevronDownIcon />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      hidden={{ before: new Date() }}
                      selected={field.value}
                      onSelect={(d) => {
                        if (d) {
                          field.onChange(d);
                        }
                        setCheckoutOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="room"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Habitación</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger
                      id="room"
                      className="px-3 py-2 w-full rounded-md bg-dark border border-gold/20 focus:outline-none focus:border-gold-light text-white"
                    >
                      <SelectValue placeholder="Selecciona una habitación" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--dark)] text-white">
                      {venues.length === 0 ? (
                        <span className="text-sm flex justify-center items-center w-full h-8">
                          No hay habitaciones disponibles
                        </span>
                      ) : (
                        venues.map((v) => (
                          <SelectItem key={v.id} value={v.id.toString()} className="text-white">
                            Habitación {v.id}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isSuccess}
            type="submit"
            className={`font-semibold tracking-wide transition-colors bg-[var(--gold)] text-[var(--dark)] hover:bg-[var(--gold-light)]`}
          >
            Reservar
          </Button>
        </form>
      </Form>
    </aside>
  );
}
