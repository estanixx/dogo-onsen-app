'use client';

import React from 'react';
import { Toaster } from 'sonner';
import { BanquetProvider } from '@/app/context/banquet-context';
import { ReservationProvider } from '@/app/context/reservation-context';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReservationProvider>
      <BanquetProvider>
        <Toaster />
        {children}
      </BanquetProvider>
    </ReservationProvider>
  );
}
