'use client';

import { DogoSection, DogoHeader } from '@/components/shared/dogo-ui';
import BanquetLayout from '@/components/employee/banquet/banquet-layout';
import { AuthRequired } from '@/components/employee/auth/auth-required';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { getServiceById } from '@/lib/api';
import { Service } from '@/lib/types';
import { H4, P } from '@/components/shared/typography';

export default function FeastPage() {
  const [venueId, setVenueId] = useState('');
  const [service, setService] = useState<Service | null>(null);

  // Load the banquet service (id "1") once
  useEffect(() => {
    const loadService = async () => {
      const svc = await getServiceById('1');
      setService(svc);
    };
    loadService();
  }, []);

  return (
    <AuthRequired>
      <DogoHeader title="Reserva de Banquete" className="-mt-16" />
      <DogoSection className="border-2 border-white rounded-lg object-cover flex  w-full text-white p-6">
        <form className="flex flex-col items-center w-full justify-center">
          <span className="flex gap-3 mb-6">
            <H4 className="text-center text-muted-foreground">Número de habitación</H4>
            <Input
              placeholder="Ingrese el número de habitación"
              value={venueId}
              onChange={(e) => setVenueId(e.target.value.trim())}
              className="w-64"
            />
          </span>
          {service ? (
            <BanquetLayout venueId={venueId} service={service} />
          ) : (
            <P className="text-center text-muted-foreground">Cargando servicio...</P>
          )}
        </form>
      </DogoSection>
    </AuthRequired>
  );
}
