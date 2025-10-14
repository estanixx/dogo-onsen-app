'use client';

import { cn } from '@/lib/utils';
import DogoIcon from './dogo-icon';
import React, { ReactNode } from 'react';

// Types
export interface DogoPageProps {
  children: ReactNode;
  className?: string;
}

export interface DogoHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export interface DogoSectionProps {
  children: ReactNode;
  className?: string;
}

// Main layout component with background
export function DogoPage({ children, className }: DogoPageProps) {
  return (
    <main className={cn('min-h-screen w-full relative overflow-y-auto', className)}>
      {/* Background elements */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#1f242d_0%,#161b23_100%)]" />

        {/* Geometric patterns */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 8%),
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 8%)
            `,
            backgroundSize: '60px 60px, 60px 60px',
            backgroundPosition: '0 0, 30px 30px',
          }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Use predefined positions instead of random values to avoid hydration errors */}
          {[
            // Predefined particle positions and styles
            { left: '10%', top: '20%', delay: '0.5s', duration: '7s', scale: '1.2' },
            { left: '20%', top: '40%', delay: '1s', duration: '6s', scale: '0.8' },
            { left: '30%', top: '10%', delay: '1.5s', duration: '8s', scale: '1.4' },
            { left: '40%', top: '70%', delay: '0.8s', duration: '5s', scale: '0.9' },
            { left: '50%', top: '30%', delay: '2s', duration: '9s', scale: '1.1' },
            { left: '60%', top: '50%', delay: '2.5s', duration: '7.5s', scale: '1.3' },
            { left: '70%', top: '80%', delay: '1.2s', duration: '6.5s', scale: '0.7' },
            { left: '80%', top: '60%', delay: '1.8s', duration: '8.5s', scale: '1' },
            { left: '90%', top: '25%', delay: '0.7s', duration: '7.2s', scale: '1.5' },
            { left: '15%', top: '85%', delay: '1.3s', duration: '6.2s', scale: '0.6' },
            { left: '25%', top: '35%', delay: '2.2s', duration: '5.8s', scale: '1.2' },
            { left: '35%', top: '75%', delay: '1.7s', duration: '7.8s', scale: '0.9' },
            { left: '55%', top: '15%', delay: '1.9s', duration: '6.9s', scale: '1.4' },
            { left: '65%', top: '45%', delay: '0.9s', duration: '8.2s', scale: '0.8' },
            { left: '75%', top: '55%', delay: '2.4s', duration: '5.5s', scale: '1.1' },
            { left: '85%', top: '5%', delay: '1.1s', duration: '7.6s', scale: '1.3' },
            { left: '5%', top: '65%', delay: '2.6s', duration: '6.7s', scale: '0.7' },
            { left: '45%', top: '95%', delay: '1.4s', duration: '8.8s', scale: '1' },
            { left: '95%', top: '38%', delay: '0.6s', duration: '6.4s', scale: '1.5' },
            { left: '8%', top: '50%', delay: '2s', duration: '7.3s', scale: '0.6' },
          ].map((particle, i) => (
            <div
              key={i}
              className={`
                absolute rounded-full
                ${i % 2 === 0 ? 'animate-spiritual-glow' : 'animate-floating'}
                ${i % 3 === 0 ? 'bg-[var(--gold)]/20' : i % 3 === 1 ? 'bg-[var(--jade)]/20' : 'bg-[var(--vermillion)]/20'}
                ${i % 4 === 0 ? 'w-2 h-2' : 'w-1 h-1'}
              `}
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
                transform: `scale(${particle.scale})`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">{children}</div>
    </main>
  );
}

// Header component with logo and title
export function DogoHeader({ title, subtitle, className }: DogoHeaderProps) {
  return (
    <div className={cn('my-4 text-center relative', className)}>
      {/* Title decorative line */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-[var(--gold)]/50 to-transparent" />

      {/* Logo */}
      <div className="mb-6 flex justify-center">
        <div className="p-4 rounded-full bg-gradient-to-b from-[var(--gold)]/30 to-[var(--gold)]/10 animate-spiritual-glow">
          <DogoIcon className="w-20 h-20 fill-white drop-shadow-[0_2px_8px_rgba(255,215,0,0.4)]" />
        </div>
      </div>

      <h1 className="text-5xl font-serif text-white mb-4 tracking-wide relative inline-block">
        <span className="relative inline-block">
          {/* Enhanced glow effect */}
          <span
            className="absolute inset-0 blur-md bg-[var(--gold)]/30 animate-spiritual-glow"
            aria-hidden="true"
          >
            {title}
          </span>
          <span className="relative inline-block bg-gradient-to-b from-white to-[var(--smoke)]/90 bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(255,255,255,0.25)]">
            {title}
          </span>
        </span>
      </h1>

      <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-[var(--vermillion)]/30 to-transparent mb-6" />

      {subtitle && (
        <p className="text-xl font-sans text-white/90 max-w-md mx-auto leading-relaxed drop-shadow-sm">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Content section wrapper
export function DogoSection({ children, className }: DogoSectionProps) {
  return <section className={cn('w-full mx-auto mb-5', className)}>{children}</section>;
}

// Card with consistent styling
export function DogoCard({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'bg-gradient-to-br from-[var(--dark-light)] to-[var(--dark)] border border-white/10 rounded-xl p-6 shadow-xl backdrop-blur-sm',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Button with primary styling
export function DogoButton({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'cursor-pointer w-full bg-gradient-to-r from-[var(--gold)]/80 to-[var(--gold)]/60 hover:from-[var(--gold)] hover:to-[var(--gold)]/80 text-[var(--dark)] font-medium py-3 px-6 text-lg rounded-md transition-all shadow-lg',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
