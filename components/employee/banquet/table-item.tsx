'use client';

import { Card } from '@/components/ui/card';
import { ToggleGroupItem } from '@/components/ui/toggle-group';
import { BanquetSeat, BanquetTable } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useBanquet } from '@/context/banquet-context';
import { MdTableRestaurant } from 'react-icons/md';
import { PiChairFill } from 'react-icons/pi';
import clsx from 'clsx';

interface TableSelectorProps {
  table: BanquetTable;
  selectedDate: Date;
  selectedTime: string | null;
}

export default function TableItem({ table, selectedDate, selectedTime }: TableSelectorProps) {
  const { reservations } = useBanquet();

  // Convertir la fecha seleccionada a YYYY-MM-DD
  const dateString = selectedDate?.toISOString().split('T')[0];

  return (
    <div className="relative">
      <Card
        className={cn(
          'flex items-center justify-center bg-gray-900 border border-gray-600 rounded-2xl p-10 shadow-lg transition h-52 relative',
          table.state ? 'opacity-100' : 'opacity-50 grayscale',
        )}
      >
        {/* Mesa (rectángulo central) */}
        <div className="w-32 h-20 bg-gray-700 rounded-lg flex items-center justify-center text-white font-semibold">
          <MdTableRestaurant className="size-10" /> <span className="text-xs mt-6">{table.id}</span>
        </div>

        {/* Asientos — 6 en total */}
        {table.availableSeats.map((seat: BanquetSeat) => {
          // Verificar si el asiento ya está reservado (para esta fecha y hora)
          const isReserved = seat.reservationId && seat.reservationId !== '';
          const isAvailable = seat.available && table.available;
          const colorClass = clsx({
            'bg-destructive text-black': isReserved,
            'bg-secondary text-black': isAvailable,
            'bg-primary text-white': !isAvailable && !isReserved,
          });

          const positions: Record<number, string> = {
            1: 'absolute top-4 left-6',
            2: 'absolute top-4 right-6',
            3: 'absolute top-1/2 -translate-y-1/2 right-2',
            4: 'absolute bottom-4 right-6',
            5: 'absolute bottom-4 left-6',
            6: 'absolute top-1/2 -translate-y-1/2 left-2',
          };

          return (
            <ToggleGroupItem
              key={seat.seatNumber}
              value={String(seat.id)}
              className={cn(
                'w-10 h-7 rounded-md border flex items-center justify-center text-xs font-bold transition-all',
                colorClass,
                positions[seat.seatNumber],
                'data-[state=on]:bg-primary data-[state=on]:text-black',
              )}
              disabled={!isAvailable || !selectedTime}
            >
              {seat.seatNumber}
            </ToggleGroupItem>
          );
        })}
      </Card>
    </div>
  );
}
