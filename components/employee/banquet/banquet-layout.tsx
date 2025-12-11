'use client';

import { LoadingBox } from '@/components/shared/loading';
import TimeSlotSelector from '@/components/shared/time-slot-selector';
import { H4, P } from '@/components/shared/typography';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ToggleGroup } from '@/components/ui/toggle-group';
import { useReservations } from '@/context/reservation-context';
import {
  // bookService, DECOMENTAR @samuelColoradoCastrillon
  createBanquetReservation,
  getAvailableBanquetSeats,
  getAvailableTimeSlotsForBanquet,
  getServiceById,
  verifyServiceItemAvailability,
} from '@/lib/api';
import { getServiceAvailabilityMessage } from '@/lib/utils';
import { BanquetTable, Reservation, VenueAccount } from '@/lib/types';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import TableItem from './table-item';

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
  const [itemAvailability, setItemAvailability] = useState<{
    isAvailable: boolean;
    insufficientItems: Array<{ itemName: string; requiredQuantity: number; availableQuantity: number }>;
    message: string;
  } | null>(null);
  const [checkingItems, setCheckingItems] = useState(false);
  const router = useRouter();
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
    setTables(data);
  };

  useEffect(clearSelection, [venueId]);

  // Check item availability for banquet when component mounts
  useEffect(() => {
    const checkItems = async () => {
      setCheckingItems(true);
      try {
        // Check availability for the "banquete" service
        const availability = await verifyServiceItemAvailability('banquete');
        if (availability) {
          setItemAvailability(availability);
        }
      } catch (error) {
        console.error('[BANQUET-LAYOUT] Error checking banquet item availability:', error);
      } finally {
        setCheckingItems(false);
      }
    };

    checkItems();
  }, []);

  // Load banquet tables
  useEffect(() => {
    fetchBanquetSeats();
  }, [date, time, submitting]); // eslint-disable-line react-hooks/exhaustive-deps

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
  }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

  const canConfirm = !!selectedSeat && !!date && !!time && !submitting && itemAvailability?.isAvailable;

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
      const banquetService = await getServiceById('banquete');
      if (!banquetService) {
        toast.error('Error al crear la reserva');
        setSubmitting(false);
        return;
      }
      if (account.eiltBalance && banquetService.eiltRate > account.eiltBalance) {
        toast.error('Saldo insuficiente para reservar el banquete');
        setSubmitting(false);
        return;
      }
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
      router.push('/employee');
    } catch (e) {
      toast.error('Error al crear la reserva');
      console.error(e);
    } finally {
      setSubmitting(false);
      clearSelection();
    }
  };

  return (
    <div className="w-full space-y-6 pb-0">
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
          {/* Item availability status */}
          <div className="flex justify-between items-center mb-4 ml-6 gap-4">
            <h2 className="text-2xl font-serif tracking-wide text-[var(--gold)] border-b-2 border-[var(--gold)]/20 pb-1">
              Escoger asiento
            </h2>
            {checkingItems && (
              <P className="text-xs text-muted-foreground">
                Verificando disponibilidad de items...
              </P>
            )}
            {itemAvailability && (
              <P className={`text-xs ${
                itemAvailability.isAvailable
                  ? 'text-green-400'
                  : 'text-destructive'
              }`}>
                {getServiceAvailabilityMessage(
                  itemAvailability.isAvailable,
                )}
              </P>
            )}
          </div>

          <ToggleGroup
            type="single"
            value={selectedSeat !== null ? String(selectedSeat) : undefined}
            onValueChange={(value) =>
              setSelectedSeat((prev) => {
                // ToggleGroup delivers selected values as strings — parse to number
                const parsed = value !== null ? Number(value) : null;
                return prev === parsed ? null : parsed;
              })
            }
            className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-6 mb-0"
          >
            {tables.map((table) => (
              <TableItem key={table.id} table={table} selectedTime={time} />
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
