'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Reservation, Service } from '@/lib/types';

interface ReservationContextType {
  reservations: (Reservation & { service: Service })[];
  addReservation: (res: Reservation & { service: Service }) => void;
  removeReservation: (id: string) => void;
  clearReservations: () => void;
  totalEilt: number;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [reservations, setReservations] = useState<(Reservation & { service: Service })[]>([]);

  // Cargar desde localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem('reservations');
    if (stored) {
      setReservations(JSON.parse(stored));
    }
  }, []);

  // Guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem('reservations', JSON.stringify(reservations));
  }, [reservations]);

  const addReservation = (res: Reservation & { service: Service }) => {
    setReservations((prev) => {
      const updated = [...prev, res];
      localStorage.setItem('reservations', JSON.stringify(updated));
      return updated;
    });
  };

  const removeReservation = (id: string) => {
    setReservations((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('reservations', JSON.stringify(updated));
      return updated;
    });
  };

  const clearReservations = () => {
    setReservations([]);
    localStorage.removeItem('reservations');
  };

  const totalEilt = reservations.reduce((sum, r) => sum + (r.service?.eiltRate || 0), 0);

  return (
    <ReservationContext.Provider
      value={{ reservations, addReservation, removeReservation, clearReservations, totalEilt }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations() {
  const ctx = useContext(ReservationContext);
  if (!ctx) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }
  return ctx;
}
