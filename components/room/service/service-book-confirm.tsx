'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogClose,
} from '@/components/ui/dialog';
import { Service, VenueAccount } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import TimeSlotSelector from '@/components/shared/time-slot-selector';
import { Calendar } from '@/components/ui/calendar';
import { getAvailableTimeSlots } from '@/lib/api';
import { H2, H4, P } from '@/components/shared/typography';
import { LoadingBox } from '@/components/shared/loading';
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

  React.useEffect(() => {
    setAvailableTimeSlots(null);
    getAvailableTimeSlots(service.id, date).then((slots) => {
      setAvailableTimeSlots(slots);
    });
  }, [service.id, date]);

  const canConfirm = !!date && !!time;

  const handleConfirm = () => {
    // TODO: call server action to create reservation
    setOpen(false);
    toast.success(`Reservación confirmada: ${service.name} - ${format(date, 'PPP')} ${time}`, { duration: 4000 });
    setDate(new Date());
    setTime(null);
    setAvailableTimeSlots(null);
  };
  const onDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setTime(null); // reset time selection when date changes
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="text-white">
        <DialogHeader>
          <DialogTitle asChild><H2>{service.name}</H2></DialogTitle>
          <DialogDescription asChild>
            <P>Precio: <strong>{service.eiltRate} EILT</strong></P>
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <div>
            <H4 className="block text-sm mb-1">Fecha</H4>
            <Calendar
              mode="single"
              required={true}
              selected={date}
              onSelect={onDateSelect}
              hidden={{
                before: new Date(),
                after: account?.endTime,
              }}
              className="rounded-lg border"
            />
            {date && (
              <P className="text-xs text-muted-foreground mt-1">
                Seleccionado: {format(date, 'PPP')}
              </P>
            )}
          </div>

          <div>
            <H4 className="block text-sm mb-1">Horario</H4>
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
            <Button variant="outline" onClick={() => setOpen(false)} className="w-full">
              Cancelar
            </Button>
            <Button disabled={!canConfirm} onClick={handleConfirm} className="w-full">
              Confirmar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
