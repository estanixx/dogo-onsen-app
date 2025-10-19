'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog';
import { Service, VenueAccount } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import TimeSlotSelector from '@/components/shared/time-slot-selector';
import { Calendar } from '@/components/ui/calendar';
import { LoadingBox } from '@/components/shared/loading';
import { bookService, getAvailableTimeSlots } from '@/lib/api';
import { H2, H4, P } from '@/components/shared/typography';
import { toast } from 'sonner';
import { useReservations } from '@/app/context/reservation-context'; // ✅ Importa el contexto

interface Props {
  service: Service;
  open: boolean;
  setOpen: (open: boolean) => void;
  account: VenueAccount;
}

export default function ServiceBookConfirm({ service, open, setOpen, account }: Props) {
  const { addReservation } = useReservations(); // ✅ Usa el contexto global

  const [date, setDate] = React.useState<Date>(new Date());
  const [time, setTime] = React.useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = React.useState<string[] | null>(null);
  const [loading, setLoading] = React.useState(false);

  // 🔹 Cargar horarios disponibles al cambiar fecha o servicio
  React.useEffect(() => {
    setAvailableTimeSlots(null);
    getAvailableTimeSlots(service.id, date).then((slots) => {
      setAvailableTimeSlots(slots);
    });
  }, [service.id, date]);

  const canConfirm = !!date && !!time && !loading;

  /** ✅ Confirmar reserva y agregarla al contexto */
  const handleConfirm = async () => {
    if (!time) {
      return;
    }
    setLoading(true);
    try {
      const reservation = await bookService(service.id, account.id, date, time);
      const fullReservation = { ...reservation, service };

      // 👉 Se guarda globalmente (context + localStorage sincronizado)
      addReservation(fullReservation);

      toast.success(`Reservación confirmada: ${service.name} - ${format(date, 'PPP')} ${time}`, {
        duration: 4000,
      });

      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(`Error al confirmar la reservación: ${service.name}`, { duration: 4000 });
    } finally {
      setLoading(false);
      setDate(new Date());
      setTime(null);
      setAvailableTimeSlots(null);
    }
  };

  const onDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setTime(null); // reset al cambiar fecha
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="text-white bg-[var(--dark)] border border-[var(--border)]">
        <DialogHeader>
          <DialogTitle asChild>
            <H2>{service.name}</H2>
          </DialogTitle>
          <DialogDescription asChild>
            <P>
              Precio: <strong>{service.eiltRate} EILT</strong>
            </P>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Fecha */}
          <div className="flex-1">
            <H4 className="block text-sm mb-1 text-gold">Fecha</H4>
            <Calendar
              mode="single"
              required
              selected={date}
              onSelect={onDateSelect}
              hidden={{
                before: new Date(),
                after: account?.endTime,
              }}
              className="rounded-lg border bg-[var(--card)]"
            />
            {date && (
              <P className="text-xs text-muted-foreground mt-1">
                Seleccionado: {format(date, 'PPP')}
              </P>
            )}
          </div>

          {/* Horario */}
          <div className="flex-1">
            <H4 className="block text-sm mb-1 text-gold">Horario</H4>
            {availableTimeSlots && availableTimeSlots.length === 0 ? (
              <P className="text-xs text-muted-foreground mt-1">No hay horarios disponibles</P>
            ) : !availableTimeSlots ? (
              <LoadingBox>Consultando horarios disponibles...</LoadingBox>
            ) : (
              <TimeSlotSelector
                selected={time}
                onSelect={setTime}
                availableTimeSlots={availableTimeSlots}
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <div className="flex flex-col gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full border border-gray-400"
            >
              Cancelar
            </Button>
            <Button
              disabled={!canConfirm}
              onClick={handleConfirm}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {loading ? 'Confirmando...' : 'Confirmar'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
