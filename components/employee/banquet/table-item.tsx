'use client';

import { Card } from '@/components/ui/card';
import { ToggleGroupItem } from '@/components/ui/toggle-group';
import { BanquetTable } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useBanquet } from '@/context/banquet-context';
import { MdTableRestaurant } from 'react-icons/md';
import { PiChairFill } from 'react-icons/pi';

interface TableSelectorProps {
  table: BanquetTable;
  selectedDate: Date;
  selectedTime: string | null;
}

export default function TableItem({ table, selectedDate, selectedTime }: TableSelectorProps) {
  const { reservations } = useBanquet();

  // Convert the selected date to YYYY-MM-DD
  const dateString = selectedDate?.toISOString().split('T')[0];

  return (
    <div className="relative">
      <Card
        className={cn(
          'flex items-center justify-center bg-gray-900 border border-gray-600 rounded-2xl p-10 shadow-lg transition h-52 relative',
          table.state ? 'opacity-100' : 'opacity-50 grayscale',
        )}
      >
        {/* Table (center rectangle) */}
        <div className="w-32 h-20 bg-gray-700 rounded-lg flex items-center justify-center text-white font-semibold">
          <MdTableRestaurant className="size-10" /> <span className="text-xs mt-6">{table.id}</span>
        </div>

        {/* Seats — 6 total */}
        {table.availableSeats.map((seat) => {
          // Check if seat is already reserved (for this date & time)
          const isReserved = reservations.some(
            (r) =>
              r.tableId === table.id.toString() &&
              r.seatNumber === seat.seatNumber &&
              r.date === dateString &&
              r.time === selectedTime,
          );

          const isOccupied = seat.reservationId !== '' || isReserved;

          const colorClass = isOccupied ? 'bg-destructive text-black' : 'bg-secondary text-black';

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
              value={`${table.id}-${seat.seatNumber}`}
              className={cn(
                'w-10 h-7 rounded-md border flex items-center justify-center text-xs font-bold transition-all',
                colorClass,
                positions[seat.seatNumber],
                'data-[state=on]:bg-primary data-[state=on]:text-black',
              )}
              disabled={isOccupied || !selectedTime}
            >
              {seat.seatNumber}
            </ToggleGroupItem>
          );
        })}
      </Card>
    </div>
  );
}
