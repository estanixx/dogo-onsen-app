'use client';

import { DogoSection } from '@/components/shared/dogo-ui';
import { Home } from 'lucide-react';

export function DashboardStats() {
  return (
    <DogoSection className="col-span-1">
      <h2 className="text-xl font-serif text-[var(--gold)] mb-4">Estado Actual</h2>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-[var(--dark-light)] p-4 rounded-lg">
          <h3 className="text-white font-semibold">Habitaciones en limpieza</h3>
          <div className="flex items-center gap-3 mb-2">
            <Home className="text-[#568682]" />
            <p className="text-4xl text-[var(--gold)]">5</p>{' '}
          </div>
          {/* Número mockeado de habitaciones en limpieza */}
        </div>

        <div className="bg-[var(--dark-light)] p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-white font-semibold">Mesas con disponibilidad</h3>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {Array(6)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i < 4 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {i < 4 ? (
                    <span className="text-white font-bold">✔</span>
                  ) : (
                    <span className="text-white font-bold">✘</span>
                  )}
                </div>
              ))}
            {/* 6 mesas disponibles (verde con ✔), 2 ocupadas (rojo con ✘). Tambien mockeado */}
          </div>
        </div>
      </div>
    </DogoSection>
  );
}
