'use client';

import * as React from 'react';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Reservation } from '@/lib/types';
import { Service } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ReservationCard({
  reservation,
  service,
}: {
  reservation: Reservation;
  service?: Service;
}) {
  const spirit = reservation.account?.spirit;
  return (
    <div className={cn('flex gap-3 items-center p-3 border rounded-md bg-[var(--card)]')}>
      <div className="w-16 h-16 relative rounded-md overflow-hidden">
        {service?.image ? (
          <Image src={service.image} alt={service.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{service?.name ?? 'Servicio'}</h4>
          <span className="text-sm text-muted-foreground">
            {reservation.startTime?.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <Avatar>
            {spirit?.image ? (
              <AvatarImage src={spirit.image} alt={spirit.name} />
            ) : (
              <AvatarFallback>{spirit?.name?.charAt(0) ?? '?'}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <div className="text-sm font-medium">{spirit?.name ?? 'Anónimo'}</div>
            <div className="text-xs text-muted-foreground">
              {reservation.isRedeemed ? 'Redimido' : 'Pendiente'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
