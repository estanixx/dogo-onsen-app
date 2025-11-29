'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Service, Reservation } from '@/lib/types';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { getReservations } from '@/lib/api';
import { TIME_SLOTS } from '@/lib/api/constants';
import ReservationCard from './reservation-card';
import { LoadingBox } from '@/components/shared/loading';
import { format } from 'date-fns';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useSidebar } from '@/components/ui/sidebar';
import { useRef } from 'react';
import { X } from 'lucide-react';

type Props = {
  service: Service;
};

export default function ReservationSidebar({ service }: Props) {
  const [date, setDate] = useState<Date>(new Date());
  const [timeSlot, setTimeSlot] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { setOpen } = useSidebar();
  const rootRef = useRef<HTMLElement | null>(null);

  // Format date as YYYY-MM-DD for the API
  const dateStr = format(date, 'yyyy-MM-dd');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const res = await getReservations({ serviceId: service.id, date: dateStr, timeSlot: timeSlot === ' ' ? undefined : timeSlot });
        if (mounted) {
          setReservations(res);
        }
      } catch (err) {
        console.error('Failed to load reservations', err);
        if (mounted) {
          setReservations([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [service?.id, dateStr, timeSlot]);

  return (
    <aside
      ref={rootRef}
      className="w-full p-4 border-l h-full bg-[var(--card)] flex flex-col gap-4 overflow-x-hidden"
    >
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Reservaciones</h3>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">{service.name}</div>
          <button
            aria-label="Cerrar"
            className="p-1 rounded hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
          </button>
        </div>
      </header>

      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Fecha</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {date.toISOString().split('T')[0]}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-auto">
              <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block text-sm mb-1">Hora (opcional)</label>
          <Select value={timeSlot ?? ' '} onValueChange={(v) => setTimeSlot(v || undefined)}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Selecciona un horario (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">(Todos)</SelectItem>
              {TIME_SLOTS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <LoadingBox>Buscando reservaciones...</LoadingBox>
        ) : reservations.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No existen reservaciones
          </div>
        ) : (
          <ScrollArea className="max-h-96 ">
            <div className="flex flex-col gap-3">
              {reservations.map((r) => (
                <ReservationCard key={r.id} reservation={r} service={service} />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </aside>
  );
}
