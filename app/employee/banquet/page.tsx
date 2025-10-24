'use client';

import { DogoSection, DogoHeader } from '@/components/shared/dogo-ui';
import BanquetLayout from '@/components/employee/banquet/banquet-layout';
import { AuthRequired } from '@/components/employee/auth/auth-required';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'; // ✅ fix: import from shadcn/ui/button, not react-day-picker
import { useEffect, useState } from 'react';
import { getServiceById } from '@/lib/api';
import { Service } from '@/lib/types';

export default function FeastPage() {
  const [venueId, setVenueId] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [service, setService] = useState<Service | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueId.trim()) {
      return;
    }
    setSubmittedId(venueId.trim());
  };

  // 🔹 Load the banquet service (id "1") once
  useEffect(() => {
    const loadService = async () => {
      const svc = await getServiceById('1');
      setService(svc);
    };
    loadService();
  }, []);

  return (
    <AuthRequired>
      <DogoHeader title="Reserva de Banquete" />
      <DogoSection className="border-2 border-white rounded-lg object-cover flex w-full text-white p-6">
        {!submittedId ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 items-center w-full justify-center"
          >
            <Input
              placeholder="Ingrese el ID del venue"
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
              className="w-64"
            />
            <Button type="submit" className="px-4 py-2">
              Cargar Banquete
            </Button>
          </form>
        ) : service ? (
          <BanquetLayout venueId={submittedId} service={service} />
        ) : (
          <p className="text-center text-muted-foreground">Cargando servicio...</p>
        )}
      </DogoSection>
    </AuthRequired>
  );
}
