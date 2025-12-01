'use client';

import { LoadingBox } from '@/components/shared/loading';
import TimeSlotSelector from '@/components/shared/time-slot-selector';
import { H2, H4, P } from '@/components/shared/typography';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useReservations } from '@/context/reservation-context'; 
import { 
  // bookService, @estanixx decomentar 
  createServiceReservation, 
  getAvailableTimeSlotsForService } from '@/lib/api';
import { Service, VenueAccount } from '@/lib/types';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';

interface Props {
  service: Service;
  open: boolean;
  setOpen: (open: boolean) => void;
  account: VenueAccount;
}

export default function ServiceBookConfirm({ service, open, setOpen, account }: Props) {

  const [date, setDate] = React.useState<Date>(new Date());
  const [time, setTime] = React.useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = React.useState<string[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  React.useEffect(() => {
    setAvailableTimeSlots(null);
    getAvailableTimeSlotsForService(service.id, date).then((slots) => {
      setAvailableTimeSlots(slots);
    });
  }, [service.id, date]);

  const canConfirm = !!date && !!time && !loading;

  const handleConfirm = async () => {
    if (!time) {
      return;
    }
    setLoading(true);
    try {
      const reservation = await createServiceReservation({
        serviceId: service.id,
        accountId: account.id,
        date,
        timeSlot: time,
      });

      if (!reservation) {
        toast.error('No se pudo crear la reservación');
        return;
      }
      toast.success(`Reservación confirmada: ${service.name} - ${format(date, 'PPP')} ${time}`, {
        duration: 4000,
      }); 
      router.refresh();
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
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
        max-w-md rounded-2xl border
        border-[var(--gold)]
        bg-[var(--dark-light)]
        text-[var(--smoke)]
        shadow-[0_0_25px_var(--gold)]  
      "
      >
        <ScrollArea className="h-full max-h-[90vh]">
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
              <H4 className="block text-sm mb-1 text-[var(--gold)]">Fecha</H4>
              <Calendar
                mode="single"
                required
                selected={date ?? undefined}
                onSelect={onDateSelect}
                hidden={{ before: new Date() }}
                className="rounded-lg border bg-[var(--card)] max-w-full"
                modifiersStyles={{
                  today: {
                    backgroundColor: 'transparent',
                    color: 'inherit',
                    fontWeight: 'normal',
                  },
                }}
              />
              {date && (
                <P className="text-xs text-muted-foreground mt-1">
                  Seleccionado: {format(date, 'PPP')}
                </P>
              )}
            </div>

            {/* Horario */}
            <div className="flex-1">
              <H4 className="block text-sm mb-1 text-[var(--gold)]">Horario</H4>
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

          <DialogFooter className="pb-6">
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
