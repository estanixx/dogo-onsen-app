'use client';

import { useEmployee } from '@/context/employee-context';
import { H2, P } from '@/components/shared/typography';
import { Spinner } from '@/components/ui/spinner';

export function AuthRequired({ children }: { children: React.ReactNode }) {
  const { isEmployeeAuthenticated, isEmployeeLoading, hasApprovedAccess, accessStatus } =
    useEmployee();

  if (isEmployeeLoading) {
    return (
      <div className="w-full h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center gap-4">
        <Spinner className="w-6 h-6 text-[var(--gold)]" />
        <P className="text-white/70">Verificando sesión de empleado…</P>
      </div>
    );
  }

  if (!isEmployeeAuthenticated) {
    return (
      <div className="w-full h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center px-4">
        <H2 className="text-primary mb-4">Acceso Restringido</H2>
        <P className="text-white/70 max-w-md">
          Por favor, inicia sesión en la barra de navegación para acceder a esta sección.
        </P>
      </div>
    );
  }

  if (!hasApprovedAccess) {
    return (
      <div className="w-full h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center px-4">
        <H2 className="text-primary mb-4">
          {accessStatus === 'revoked' ? 'Acceso deshabilitado' : 'Acceso pendiente'}
        </H2>
        <P className="text-white/70 max-w-xl">
          {accessStatus === 'revoked'
            ? 'Tu acceso al panel de empleados ha sido revocado en Clerk. Contacta al administrador para restaurarlo.'
            : 'Tu registro fue recibido y está en revisión. Cuando el administrador apruebe tu acceso en Clerk, este panel se habilitará automáticamente.'}
        </P>
      </div>
    );
  }

  return <>{children}</>;
}
