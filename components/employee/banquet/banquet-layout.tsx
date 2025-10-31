'use client';

import React, { useEffect, useState } from 'react';
import {
  getBanquetTables,
  getAvailableTimeSlots,
  bookService,
  getCurrentVenueAcount,
} from '@/lib/api';
import { BanquetTable, Service, Reservation, VenueAccount } from '@/lib/types';
import { ToggleGroup } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { LoadingBox } from '@/components/shared/loading';
import { H4, P } from '@/components/shared/typography';
import { format } from 'date-fns';
import TableItem from './table-item';
import TimeSlotSelector from '@/components/shared/time-slot-selector';
import { toast } from 'sonner';
import { useBanquet } from '@/context/banquet-context';
import { useReservations } from '@/context/reservation-context';

interface BanquetLayoutProps {
  account?: VenueAccount;
  service: Service;
  venueId?: string;
}

export default function BanquetLayout({ account, service, venueId }: BanquetLayoutProps) {
  const [tables, setTables] = useState<BanquetTable[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { createReservation } = useBanquet();
  const { addReservation } = useReservations();

  const clearSelection = () => {
    setSelectedSeat(null);
    setDate(null);
    setTime(null);
    setAvailableTimeSlots(null);
  };

  useEffect(clearSelection, [venueId]);

  // Load banquet tables
  useEffect(() => {
    const fetchData = async () => {
      const data = await getBanquetTables();
      setTables(data);
    };
    fetchData();
  }, []);

  // Load available time slots when date changes
  useEffect(() => {
    if (!date) {
      return;
    }
    const fetchSlots = async () => {
      setAvailableTimeSlots(null);
      setLoadingSlots(true);
      try {
        const slots = await getAvailableTimeSlots('banquet', date);
        setAvailableTimeSlots(slots);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [date]);

  const canConfirm = !!selectedSeat && !!date && !!time && !submitting && !!venueId;

  const onDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setTime(null); // reset time when date changes
    }
  };

  // Submit reservation (mock)
  const handleSeatSubmit = async () => {
    if (!selectedSeat || !date || !time) {
      return;
    }
    let venueAccount;
    if (venueId && !account) {
      venueAccount = await getCurrentVenueAcount(venueId);
    }

    setSubmitting(true);
    try {
      const [tableId, seatNumber] = selectedSeat.split('-');
      let reservation;
      if (!venueAccount && account) {
        reservation = await bookService('1', account.id, date, time);
      } else if (venueAccount) {
        reservation = await bookService('1', venueAccount.id, date, time);
      }
      const fullReservation = { ...reservation, service } as Reservation & { service: Service };

      // Save in banquet context
      createReservation({
        tableId,
        seatNumber: Number(seatNumber),
        date: date.toISOString().split('T')[0],
        time,
      });

      // Also register in general reservation context
      addReservation(fullReservation);

      toast.success(
        `Reserva confirmada para el asiento ${seatNumber} (${format(date, 'PPP')} ${time})`,
      );
      setSelectedSeat(null);
      setTime(null);
    } catch (e) {
      toast.error('Error al crear la reserva');
      console.error(e);
    } finally {
      setSubmitting(false);
      clearSelection();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Date & time selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-6">
        {/* Date */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-serif tracking-wide text-[var(--gold)] border-b-2 border-[var(--gold)]/20 pb-1">
              Fecha
            </h2>
          </div>
          <Calendar
            mode="single"
            required
            selected={date ?? undefined}
            onSelect={onDateSelect}
            hidden={{ before: new Date() }}
            className="rounded-lg border bg-[var(--card)] w-full md:w-1/2"
            modifiersStyles={{
              today: {
                backgroundColor: 'transparent',
                color: 'inherit',
                fontWeight: 'normal',
              },
            }}
          />
        </div>

        {/* Time */}
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif tracking-wide text-[var(--gold)] border-b-2 border-[var(--gold)]/20 pb-1">
              Horario
            </h2>
          </div>
          {loadingSlots ? (
            <LoadingBox>Consultando horarios disponibles...</LoadingBox>
          ) : availableTimeSlots && availableTimeSlots.length > 0 ? (
            <TimeSlotSelector
              selected={time}
              onSelect={setTime}
              availableTimeSlots={availableTimeSlots}
            />
          ) : (
            <P className="text-xs text-muted-foreground mt-1">
              No hay horarios disponibles en esa fecha.
            </P>
          )}
        </div>
      </div>

      {date && time ? (
        <div className="relative">
          {/* Table grid */}

          <div className="flex justify-between items-center mb-4 ml-6">
            <h2 className="text-2xl font-serif tracking-wide text-[var(--gold)] border-b-2 border-[var(--gold)]/20 pb-1">
              Escoger asiento
            </h2>
          </div>

          <ToggleGroup
            type="single"
            value={selectedSeat ?? undefined}
            onValueChange={(value) => setSelectedSeat((prev) => (prev === value ? null : value))}
            className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-6"
          >
            {tables.map((table) => (
              <TableItem key={table.id} table={table} selectedDate={date} selectedTime={time} />
            ))}
          </ToggleGroup>

          {/* Seat availability legend */}
          <div className="absolute bottom-3 right-3 flex pl-6 gap-6 mb-4">
            <span className="bg-secondary text-white font-base font-bold rounded-lg p-1">
              Disponible
            </span>
            <span className="bg-destructive text-white font-base font-bold rounded-lg p-1">
              Ocupado
            </span>
          </div>

          {/* Confirm button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleSeatSubmit}
              disabled={!canConfirm}
              className="px-8 py-2 bg-primary hover:bg-primary/90"
            >
              {submitting ? 'Confirmando...' : 'Confirmar reserva'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center mb-4">
          <H4 className="border-b-2 pb-1 text-primary border-primary">
            Selecciona una fecha y un horario para ver los asientos disponibles.
          </H4>
        </div>
      )}
    </div>
  );
}
