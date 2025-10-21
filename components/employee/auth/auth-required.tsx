'use client';

import { useEmployee } from '@/app/context/employee-context';
import { H2, P } from '@/components/shared/typography';

export function AuthRequired({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useEmployee();

  if (!isAuthenticated) {
    return (
      <div className="w-full h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center px-4">
        <H2 className="text-primary mb-4">Acceso Restringido</H2>
        <P className="text-white/70 max-w-md">
          Por favor, inicia sesión en la barra de navegación para acceder a esta sección.
        </P>
      </div>
    );
  }

  return <>{children}</>;
}
