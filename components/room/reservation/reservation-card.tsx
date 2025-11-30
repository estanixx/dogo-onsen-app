'use client';

import { Reservation, Service } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Trash2 } from 'lucide-react';
import { formatRelative } from 'date-fns';
import Image from 'next/image';

interface ReservationCardProps {
  reservation: Reservation & { service: Service };
  onRemove: (id: string) => void;
}

/**
 * Componente tarjeta para mostrar una reservación
 * Muestra detalles del servicio y acciones (eliminar)
 */
export function ReservationCard({ reservation, onRemove }: ReservationCardProps) {
  const { service, startTime, endTime } = reservation;

  return (
    <Card
      className="overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
      style={{
        background: 'linear-gradient(180deg, var(--card), var(--dark))',
        color: 'var(--card-foreground)',
      }}
    >
      {/* Imagen del servicio */}
      {service.image && (
        <div className="relative h-40 w-full">
          <Image
            fill
            src={service.image}
            alt={service.name}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-[var(--gold)]">{service.name}</h3>
            <p className="text-sm text-[var(--gold)]-light">{service.eiltRate} EILT</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 text-gray-300">
          <div className="flex items-center text-sm">
            <CalendarDays className="mr-2 h-4 w-4 text-[var(--gold)]" />
            <span>{formatRelative(new Date(startTime), new Date())}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-[var(--gold)]" />
            <span>{`${new Date(startTime).toLocaleTimeString()} - ${new Date(
              endTime,
            ).toLocaleTimeString()}`}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-900 flex justify-between items-center">
        <Button
          onClick={() => onRemove(reservation.id)}
          variant="destructive"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 w-full"
        >
          <Trash2 size={16} />
          Eliminar reserva
        </Button>
      </CardFooter>
    </Card>
  );
}
