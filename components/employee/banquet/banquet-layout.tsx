'use client';

import React, { useEffect, useState } from 'react';
import { getBanquetTables } from '@/lib/api';
import { BanquetTable } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import TableItem from './table-item';

export default function BanquetLayout() {
  const [tables, setTables] = useState<BanquetTable[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBanquetTables();
      setTables(data);
    };
    fetchData();
  }, []);

  // Future seat submission handler (empty for now)
  const handleSeatSubmit = async () => {
    try {
      if (!selectedSeat) return;
      console.log(`Seat submitted: ${selectedSeat}`);
    } catch (error) {
      console.error('Error submitting seat:', error);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full flex gap-4 mb-4">
        <span className="bg-secondary text-white font-base font-bold rounded-lg p-1">
          Disponible
        </span>
        <span className="bg-destructive text-white font-base font-bold rounded-lg p-1">
          Ocupado
        </span>
      </div>

      <ToggleGroup
        type="single"
        value={selectedSeat ?? undefined}
        onValueChange={(value) => setSelectedSeat((prev) => (prev === value ? null : value))}
        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-6"
      >
        {tables.map((table) => (
          <TableItem key={table.id} table={table} />
        ))}
      </ToggleGroup>

      {/* Submission button */}
      <div className="flex justify-center mt-6">
        <Button onClick={handleSeatSubmit} disabled={!selectedSeat} className="px-8 py-2">
          Confirmar selección
        </Button>
      </div>
    </div>
  );
}
