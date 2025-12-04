'use client';

import { Spirit } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';

const SpiritContext = createContext<{
  spirits: Spirit[] | null;
  setSpirits: (spirits: Spirit[] | null) => void;
} | null>(null);

export const SpiritProvider = ({ children }: { children: ReactNode }) => {
  const [spirits, setSpirits] = useState<Spirit[] | null>(null);
  return (
    <SpiritContext.Provider value={{ spirits, setSpirits }}>{children}</SpiritContext.Provider>
  );
};

export const useSpirit = () => {
  const context = useContext(SpiritContext);
  if (!context) {
    throw new Error('useSpirit must be used within a SpiritProvider');
  }
  return context;
};
