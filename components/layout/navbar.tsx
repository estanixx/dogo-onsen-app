'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Shadcn icons
import DogoIcon from '../shared/dogo-icon';
import { H4, P } from '../shared/typography';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: 'Dashboard', href: '/employee' },
    { name: 'Recepción', href: '/employee/reception' },
    { name: 'Banquete', href: '/employee/banquet' },
    { name: 'Inventario', href: '/employee/inventory' },
  ];

  return (
    <nav className="w-full border-white border-b bg-transparent rounded-t-lg font-serif uppercase flex items-center justify-between px-6 py-3 text-white sticky top-0 z-50 backdrop-blur-md">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <Link href="/employee" className="flex items-center space-x-3">
          <DogoIcon className="fill-primary w-8 h-8 sm:w-10 sm:h-10" />
          <h1 className="tracking-[2px] text-xl sm:text-2xl text-primary font-semibold">
            Dogo Onsen
          </h1>
        </Link>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center space-x-10 text-sm">
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

      {/* User + Menu */}
      <div className="flex items-center space-x-3">
        <div className="hidden md:block">
          <H4>Usuario</H4>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-primary hover:text-white"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-background backdrop-blur-md border-b border-white flex flex-col items-center py-4 space-y-4 md:hidden">
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
            <H4>Usuario</H4>
          </div>
        </div>
      )}
    </nav>
  );
}
