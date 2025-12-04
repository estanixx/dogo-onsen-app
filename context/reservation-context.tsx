'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Reservation } from '@/lib/types';

interface ReservationContextType {
  reservations: Reservation[];
  addReservation: (res: Reservation) => void;
  removeReservation: (id: string) => void;
  clearReservations: () => void;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  totalEilt: number;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);

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

  const addReservation = (res: Reservation) => {
    setReservations((prev) => {
      // Generar un ID único basado en timestamp y un número aleatorio
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const updated = [
        ...prev,
        {
          ...res,
          id: uniqueId, // Sobreescribir el ID con uno único
          isRedeemed: false,
          isRated: false,
        },
      ];

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

  const updateReservation = (id: string, updates: Partial<Reservation>) => {
    setReservations((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, ...updates } : r));
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
      value={{
        reservations,
        addReservation,
        removeReservation,
        clearReservations,
        updateReservation,
        totalEilt,
      }}
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
