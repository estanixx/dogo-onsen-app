'use client';

import { useState } from 'react';
import { DogoHeader, DogoSection } from '@/components/shared/dogo-ui';
import { InventoryTable } from '@/components/employee/inventory/inventory-table';
import { NewOrderModal } from '@/components/employee/inventory/new-order-modal';
import { AuthRequired } from '@/components/employee/auth/auth-required';

export default function InventoryPage() {
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  return (
    <AuthRequired>
      <div className="space-y-6">
        <DogoHeader title="Gestión de Inventario" />

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-serif tracking-wide text-[var(--gold)] border-b-2 border-[var(--gold)]/20 pb-1">
            Existencias actuales
          </h2>
        </div>

        <DogoSection>
          <InventoryTable onAddOrder={() => setIsNewOrderModalOpen(true)} />
        </DogoSection>

        <NewOrderModal open={isNewOrderModalOpen} onOpenChange={setIsNewOrderModalOpen} />
      </div>
    </AuthRequired>
  );
}
