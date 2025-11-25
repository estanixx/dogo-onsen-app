'use client';

import { AuthRequired } from '@/components/employee/auth/auth-required';
import BanquetLayout from '@/components/employee/banquet/banquet-layout';
import { DogoHeader, DogoSection } from '@/components/shared/dogo-ui';
import { H4, P } from '@/components/shared/typography';
import { Input } from '@/components/ui/input';
import { getVenueAccountById } from '@/lib/api';
import { VenueAccount } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function FeastPage() {
  const [venueId, setVenueId] = useState('');
  const [account, setAccount] = useState<VenueAccount | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      if (!venueId || venueId.trim() === '' || isNaN(Number(venueId))) {
        setAccount(null);
        return;
      }
      const venueAccount = await getVenueAccountById(venueId);
      if (!venueAccount) {
        setAccount(null);
        return;
      }
      if ('detail' in venueAccount && (venueAccount as Record<string, unknown>).detail === 'Venue account not found') {
        setAccount(null);
        return;
      }
      setAccount(venueAccount as VenueAccount);
    };
    fetchData();
  }, [venueId]);
  return (
    <AuthRequired>
      <DogoHeader title="Reserva de Banquete" className="-mt-16" />
      <DogoSection className="border-2 border-white rounded-lg object-cover flex w-full text-white p-6 overflow-x-auto">
        <form className="w-full space-y-6 pb-12">
          <span className="flex gap-3 mb-6 justify-center flex-wrap">
            <H4 className="block text-sm text-[var(--gold)]">Número de Habitación</H4>
            <Input
              placeholder="Ingrese el número de habitación"
              value={venueId}
              onChange={(e) => setVenueId(e.target.value.trim())}
              className="w-64"
            />
          </span>
          {venueId && !account && (
            <P className="text-center text-red-500">
              No se encontró ninguna cuenta de lugar con ese ID de lugar.
            </P>
          )}
          {account && <BanquetLayout account={account} venueId={venueId} />}
        </form>
      </DogoSection>
    </AuthRequired>
  );
}
