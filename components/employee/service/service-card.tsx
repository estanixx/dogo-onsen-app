'use client';

import { Service } from '@/lib/types';
import * as React from 'react';
import Image from 'next/image';
import { H2, P } from '@/components/shared/typography';
import { Button } from '@/components/ui/button';

interface ServiceCardProps {
  service: Service;
  onSelect?: (service: Service) => void;
}

export function ServiceCard({ service, onSelect }: ServiceCardProps) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
    onSelect?.(service);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        className="w-full h-[260px] rounded-md border overflow-hidden shadow-md cursor-pointer focus:outline-none"
        style={{
          background: 'linear-gradient(180deg, var(--card), var(--dark))',
          borderColor: 'var(--border)',
          color: 'var(--card-foreground)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <div className="h-full flex flex-col">
          {/* Image */}
          <div
            className="relative h-[160px] w-full bg-[color]"
            style={{ background: 'var(--dark-light)' }}
          >
            {service.image ? (
              <Image src={service.image} alt={service.name} fill className="object-cover" />
            ) : (
              <div
                className="flex items-center justify-center h-full text-sm"
                style={{ color: 'var(--muted-foreground)' }}
              >
                No image
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 px-6 py-4 flex flex-col space-y-3">
            <H2
              className="text-base font-semibold line-clamp-2 text-center"
              style={{ color: 'var(--gold)' }}
            >
              {service.name}
            </H2>

            <P className="text-sm text-center" style={{ color: 'var(--gold-light)' }}>
              {service.eiltRate} EILT
            </P>

            <div className="flex justify-center">
              <Button
                className="text-xs px-6 py-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                style={{
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  fontWeight: 600,
                }}
                onClick={() => handleOpen()}
              >
                Reservaciones
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
