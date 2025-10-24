'use client';

import { DogoSection, DogoHeader } from '@/components/shared/dogo-ui';
import BanquetLayout from '@/components/employee/banquet/banquet-layout';
import { AuthRequired } from '@/components/employee/auth/auth-required';

export default function FeastPage() {
  return (
    <AuthRequired>
      <DogoHeader title="Reserva de Banquete" />
      <DogoSection className="border-2 border-white rounded-lg object-cover flex w-full text-white p-6">
        <BanquetLayout />
      </DogoSection>
    </AuthRequired>
  );
}
