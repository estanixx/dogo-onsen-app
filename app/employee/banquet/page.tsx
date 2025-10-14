'use client';

import { DogoSection } from '@/components/shared/dogo-ui';
import BanquetLayout from '@/components/employee/banquet/banquet-layout';

export default function FeastPage() {
  return (
    <DogoSection className="border-2 border-white rounded-lg object-cover flex w-full text-white p-6">
      <BanquetLayout />
    </DogoSection>
  );
}
