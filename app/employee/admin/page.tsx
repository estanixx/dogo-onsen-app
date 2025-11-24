'use client';

import { useAdmin } from '@/context/admin-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DogoPage, DogoHeader, DogoSection } from '@/components/shared/dogo-ui';
import { EmployeesManagementTable } from '@/components/employee/admin/employees-management-table';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { isAdmin, isLoadingAdmin, logoutAdmin } = useAdmin();
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to home if not admin and loaded
    if (!isLoadingAdmin && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, isLoadingAdmin, router]);

  if (isLoadingAdmin) {
    return (
      <DogoPage>
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <Loader2 className="animate-spin size-12" />
          <p className="mt-4 text-white/70">Cargando...</p>
        </div>
      </DogoPage>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleLogout = () => {
    logoutAdmin();
    router.push('/');
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const response = await fetch('/api/employees/admin/sync', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        setSyncMessage(`Error: ${error.error || 'Sync failed'}`);
        return;
      }

      const data = await response.json();
      setSyncMessage(`✓ ${data.message || 'Sync completed'}`);
      
      // Refresh the employees table by reloading the component
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setSyncMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-6">
    <DogoHeader title="Panel Administrativo"/>

    <DogoSection>
        <div className="space-y-6">
        {/* Header with title */}
        <h2 className="text-2xl md:text-3xl font-serif tracking-wide text-[var(--gold)] border-b-2 border-[var(--gold)]/20 pb-2">
            Empleados
        </h2>

        {/* Sync message */}
        {syncMessage && (
            <div
            className={`p-3 rounded-lg text-sm ${
                syncMessage.startsWith('✓')
                ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                : 'bg-red-900/30 text-red-400 border border-red-500/30'
            }`}
            >
            {syncMessage}
            </div>
        )}

        {/* Employees table */}
        <EmployeesManagementTable />

        {/* Buttons below table */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
            <Button
            onClick={handleSync}
            disabled={isSyncing}
            className="bg-[var(--gold)] hover:bg-[var(--gold)]/80 text-[var(--dark)] font-medium"
            >
            {isSyncing ? (
                <>
                <Loader2 className="animate-spin mr-2 size-4" />
                Sincronizando...
                </>
            ) : (
                'Sincronizar con Clerk'
            )}
            </Button>
            <Button
            onClick={handleLogout}
            className="bg-red-900/20 border-red-500/30 text-red-400 hover:bg-red-900/40"
            variant="outline"
            >
            Cerrar sesión
            </Button>
        </div>
        </div>
    </DogoSection>
    </div>
  );
}
