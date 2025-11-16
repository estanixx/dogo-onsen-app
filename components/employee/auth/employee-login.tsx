'use client';

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { useEmployee } from '@/context/employee-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function EmployeeLogin() {
  const { employeeProfile, accessStatus } = useEmployee();

  return (
    <div className="flex items-center gap-3">
      <SignedIn>
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-[var(--gold)] font-semibold leading-tight pb-1">
              {employeeProfile?.fullName || 'Empleado'}
            </span>
            <Badge
              className={
                `text-xs uppercase tracking-wide px-3 py-1 rounded-full font-semibold inline-flex items-center justify-center ` +
                (accessStatus === 'approved'
                  ? 'bg-[var(--gold)] text-[var(--dark)] shadow-[0_6px_18px_rgba(0,0,0,0.45)]'
                  : accessStatus === 'revoked'
                    ? 'bg-destructive text-white border border-destructive shadow-[0_6px_18px_rgba(0,0,0,0.45)]'
                    : 'bg-transparent text-white border border-[var(--gold-dark)]')
              }
              title={
                accessStatus === 'approved'
                  ? 'Acceso aprobado'
                  : accessStatus === 'revoked'
                    ? 'Acceso revocado'
                    : 'Registro pendiente de aprobación'
              }
              aria-live="polite"
            >
              {accessStatus === 'approved'
                ? 'Acceso aprobado'
                : accessStatus === 'revoked'
                  ? 'Acceso revocado'
                  : 'Pendiente en Clerk'}
            </Badge>
          </div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-10 h-10 border border-[var(--gold)] rounded-full',
              },
            }}
            afterSignOutUrl="/"
          />
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex items-center gap-2">
          <SignInButton mode="modal" forceRedirectUrl="/employee" signUpForceRedirectUrl="/employee">
            <Button
              type="button"
              variant="outline"
              className="font-semibold rounded-md bg-[var(--gold)] text-[var(--dark)] hover:bg-[var(--gold-light)]"
            >
              Iniciar Sesión
            </Button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl="/employee">
            <Button
              type="button"
              className="font-semibold rounded-md border border-[var(--gold)] text-[var(--gold)] bg-transparent hover:bg-[var(--dark-light)]"
            >
              Registrarse
            </Button>
          </SignUpButton>
        </div>
      </SignedOut>
    </div>
  );
}
