'use client';

import React from 'react';
import { Toaster } from 'sonner';
import { BanquetProvider } from '@/context/banquet-context';
import { ReservationProvider } from '@/context/reservation-context';
import { SpiritProvider } from '@/context/spirit-context';
import { EmployeeProvider } from '@/context/employee-context';
import { AdminProvider } from '@/context/admin-context';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EmployeeProvider>
      <AdminProvider>
        <SpiritProvider>
          <ReservationProvider>
            <BanquetProvider>
              {children}
              <Toaster />
            </BanquetProvider>
          </ReservationProvider>
        </SpiritProvider>
      </AdminProvider>
    </EmployeeProvider>
  );
}
