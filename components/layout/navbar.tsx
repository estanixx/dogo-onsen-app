'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react'; // Iconos (Shadcn)
import DogoIcon from '../shared/dogo-icon';
import { P } from '../shared/typography';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { EmployeeLogin } from '../employee/auth/employee-login';
import { useUser } from '@clerk/nextjs';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, isLoaded } = useUser();

  const links = [
    { name: 'Dashboard', href: '/employee' },
    { name: 'Recepción', href: '/employee/reception' },
    { name: 'Banquete', href: '/employee/banquet' },
    { name: 'Inventario', href: '/employee/inventory' },
    { name: 'Servicios', href: '/employee/services' },
    ...(user && (user.publicMetadata as Record<string, unknown>).role === 'admin'
      ? [{ name: 'Admin', href: '/employee/admin' }]
      : []),
  ];

  return (
    <nav className="w-full border-white border-b bg-transparent rounded-t-lg font-serif uppercase flex items-center justify-between px-6 py-3 text-white sticky top-0 z-50 backdrop-blur-md">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <Link href="/" className="flex items-center space-x-3">
          <DogoIcon className="fill-primary w-8 h-8 sm:w-10 sm:h-10" />
          <h1 className="tracking-[2px] text-xl sm:text-2xl text-primary font-semibold pr-5">
            Dogo Onsen
          </h1>
        </Link>
      </div>

      {/* Navegación de escritorio */}
      {!isMobile && (
        <div className="flex items-center space-x-10 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-all duration-150 border-b-2 border-transparent hover:text-primary hover:border-primary/40',
                pathname === link.href && 'text-primary border-primary',
              )}
            >
              <P className="text-sm sm:text-base">{link.name}</P>
            </Link>
          ))}
        </div>
      )}

      {/* Usuario + Menú */}
      <div className="flex items-center space-x-3">
        {!isMobile ? (
          <div>
            <EmployeeLogin />
          </div>
        ) : null}

        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="text-primary hover:text-white"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        )}
      </div>

      {/* Menú desplegable móvil */}
      {menuOpen && isMobile && (
        <div className="absolute top-16 left-0 w-full bg-background backdrop-blur-md border-b border-white flex flex-col items-center py-4 space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'transition-all duration-150 text-lg',
                pathname === link.href
                  ? 'text-primary border-b-2 border-primary'
                  : 'hover:text-primary',
              )}
            >
              {link.name}
            </Link>
          ))}

          <div className="mt-3">
            <EmployeeLogin />
          </div>
        </div>
      )}
    </nav>
  );
}
