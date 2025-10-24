'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type BanquetReservation = {
  id: string;
  tableId: string;
  seatNumber: number;
  date: string; // YYYY-MM-DD
  time: string;
};

interface BanquetContextType {
  reservations: BanquetReservation[];
  createReservation: (reservation: Omit<BanquetReservation, 'id'>) => BanquetReservation;
  deleteReservation: (id: string) => void;
  getReservationsByDate: (date: string) => BanquetReservation[];
}

const BanquetContext = createContext<BanquetContextType | undefined>(undefined);

export function useBanquet() {
  const context = useContext(BanquetContext);
  if (!context) {
    throw new Error('useBanquet must be used within a BanquetProvider');
  }
  return context;
}

export function BanquetProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<BanquetReservation[]>([]);

  // ✅ Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('banquet-reservations');
      if (stored) {
        setReservations(JSON.parse(stored));
    }
    } catch (error) {
      console.error('Error loading saved reservations:', error);
    }
  }, []);

  // ✅ Save to localStorage whenever reservations change
  useEffect(() => {
    try {
      localStorage.setItem('banquet-reservations', JSON.stringify(reservations));
    } catch (error) {
      console.error('Error saving reservations:', error);
    }
  }, [reservations]);

  const createReservation = (data: Omit<BanquetReservation, 'id'>): BanquetReservation => {
    const newReservation: BanquetReservation = { ...data, id: crypto.randomUUID() };
    setReservations((prev) => [...prev, newReservation]);
    return newReservation;
  };

  const deleteReservation = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  const getReservationsByDate = (date: string) => {
    return reservations.filter((r) => r.date === date);
  };

  return (
    <BanquetContext.Provider
      value={{ reservations, createReservation, deleteReservation, getReservationsByDate }}
    >
      {children}
    </BanquetContext.Provider>
  );
}
