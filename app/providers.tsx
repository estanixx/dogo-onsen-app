'use client';

import React from 'react';
import { Toaster } from 'sonner';
import { BanquetProvider } from '@/context/banquet-context';
import { ReservationProvider } from '@/context/reservation-context';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReservationProvider>
      <BanquetProvider>
        {children}
        <Toaster />
      </BanquetProvider>
    </ReservationProvider>
  );
}
