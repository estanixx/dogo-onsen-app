'use client';

import { LoadingBox } from '@/components/shared/loading';
import TimeSlotSelector from '@/components/shared/time-slot-selector';
import { H4, P } from '@/components/shared/typography';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ToggleGroup } from '@/components/ui/toggle-group';
import { useBanquet } from '@/context/banquet-context';
import { useReservations } from '@/context/reservation-context';
import {
  // bookService, DECOMENTAR @samuelColoradoCastrillon
  createBanquetReservation,
  getAvailableBanquetSeats,
  getAvailableTimeSlotsForBanquet,
} from '@/lib/api';
import { BanquetTable, Reservation, VenueAccount } from '@/lib/types';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import TableItem from './table-item';
import { useRouter } from 'next/navigation';

interface BanquetLayoutProps {
  account: VenueAccount;
  venueId: string;
}

export default function BanquetLayout({ account, venueId }: BanquetLayoutProps) {
  const [tables, setTables] = useState<BanquetTable[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { createReservation } = useBanquet();
  const { addReservation } = useReservations();

  const clearSelection = () => {
    setSelectedSeat(null);
    setDate(null);
    setTime(null);
    setAvailableTimeSlots(null);
  };
  const fetchBanquetSeats = async () => {
    if (!date || !time || !account?.spiritId || submitting) {
      setTables([]);
      return;
    }
    const data = await getAvailableBanquetSeats(account.spiritId, date, time);
    console.log(data);
    setTables(data);
  };

  useEffect(clearSelection, [venueId]);
  // Load banquet tables
  useEffect(() => {
    fetchBanquetSeats();
  }, [date, time, submitting]);

  // Load available time slots when date changes
  useEffect(() => {
    if (!date) {
      return;
    }
    const fetchSlots = async () => {
      setAvailableTimeSlots(null);
      setLoadingSlots(true);
      try {
        const slots = await getAvailableTimeSlotsForBanquet(account.spiritId, date);
        setAvailableTimeSlots(slots);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [date]);

  const canConfirm = !!selectedSeat && !!date && !!time && !submitting;

  const onDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setTime(null); // reset time when date changes
    }
  };

  // Submit reservation (mock)
  const handleSeatSubmit = async () => {
    if (!selectedSeat || !date || !time || !account) {
      return;
    }

    setSubmitting(true);
    try {
      selectedSeat;
      const reservation = await createBanquetReservation({
        seatId: selectedSeat,
        date,
        time,
        accountId: account.id,
      });

      if (!reservation) {
        toast.error('Error al crear la reserva');
        return;
      }

      // Also register in general reservation context
      addReservation(reservation as Reservation);
      toast.success(
        `Reserva confirmada para el asiento ${selectedSeat} (${format(date, 'PPP')} ${time})`,
      );
      router.refresh();
    } catch (e) {
      toast.error('Error al crear la reserva');
      console.error(e);
    } finally {
      setSubmitting(false);
      clearSelection();
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Date & time selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-6">
        {/* Date */}
        <div className="overflow-x-clip">
          <div className="flex justify-between items-center">
            <H4 className="block text-sm mb-2 text-[var(--gold)]">Fecha</H4>
          </div>
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

        {/* Time */}
        <div>
          <div className="flex justify-between items-center">
            <H4 className="block text-sm mb-1 text-[var(--gold)]">Horario</H4>
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
        <>
          {/* Table grid */}

          <div className="flex justify-between items-center mb-4 ml-6">
            <h2 className="text-2xl font-serif tracking-wide text-[var(--gold)] border-b-2 border-[var(--gold)]/20 pb-1">
              Escoger asiento
            </h2>
          </div>

          <ToggleGroup
            type="single"
            value={selectedSeat !== null ? String(selectedSeat) : undefined}
            onValueChange={(value) => setSelectedSeat((prev) => (prev === value ? null : value))} //  @samuelColoradoCastrillon Acá hay un error en el build
            className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-6"
          >
            {tables.map((table) => (
              <TableItem key={table.id} table={table} selectedDate={date} selectedTime={time} />
            ))}
          </ToggleGroup>

          {/* Seat availability legend */}
          <div className="bottom-3 right-3 flex pl-6 gap-6 mb-4">
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
        </>
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
