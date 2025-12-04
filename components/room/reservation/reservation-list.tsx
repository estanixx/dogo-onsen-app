'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useMediaQuery } from '@/hooks/use-media-query';
import { getReservations, removeReservation, updateReservation } from '@/lib/api';
import { BANQUET_SERVICE_DATA } from '@/lib/api/constants';
import { DESKTOP_MIN_QUERY } from '@/lib/config';
import { Reservation, Service, VenueAccount } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, Star } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import RedeemDialog from './redeem-interaction';

interface ReservationListProps {
  account: VenueAccount;
}

export function ReservationList({ account }: ReservationListProps) {
  const accountId = account.id;
  const [redeemDialog, setRedeemDialog] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [reload, onReloadReservations] = useState(false);
  React.useEffect(() => {
    const fetchReservations = async () => {
      const data = await getReservations({ accountId });
      if (!data) {
        toast.error('Error al cargar las reservaciones');
        return;
      }
      setReservations(data);
    };
    fetchReservations();
  }, [accountId, reload]);

  const [ratingDialog, setRatingDialog] = useState<string | null>(null);

  // Función para redimir una reservación
  const executeRedeem = async (reservation: Reservation) => {
    await updateReservation(reservation.id, { isRedeemed: true });
    if (!reservation.service) {
      toast.error('Error al redimir la reservación');
      return;
    }
    toast.success(`¡Servicio "${reservation?.service?.name}" redimido exitosamente!`, {
      description: 'Ya puedes calificar tu experiencia',
    });

    // This will hide the RedeemDialog
    setRedeemDialog(null);
  };

  // ✅ 2. The function that CHECKS the time
  const handleRedeem = (reservation: Reservation) => {
    const now = new Date();
    const start = new Date(reservation.startTime);
    const end = new Date(reservation.endTime);

    // If the current time is within the reservation window, open the dialog
    if (now >= start && now <= end) {
      setRedeemDialog(reservation.id);
    } else {
      // Otherwise, redeem directly
      executeRedeem(reservation);
    }
    onReloadReservations((prev) => !prev);
  };

  // Función para cancelar una reservación
  const handleCancel = (reservationId: string, serviceName: string) => {
    removeReservation(reservationId);
    toast.success(`Servicio "${serviceName}" cancelado`, {
      description: 'La reservación ha sido eliminada exitosamente',
    });
    onReloadReservations((prev) => !prev);
  };

  // Función para calificar una reservación
  const handleRate = (reservationId: string, rating: number) => {
    updateReservation(reservationId, { rating, isRated: true });
    setRatingDialog(null);
    toast.success('¡Gracias por tu calificación!', {
      description: 'Tu opinión nos ayuda a mejorar',
    });
    onReloadReservations((prev) => !prev);
  };

  const RatingDialog = React.memo(({ reservationId }: { reservationId: string }) => {
    const isDesktop = useMediaQuery(DESKTOP_MIN_QUERY);

    const ratingContent = (
      <>
        {isDesktop ? (
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-semibold text-[var(--gold)]">
              Califica tu experiencia
            </DialogTitle>
            <DialogDescription>
              ¿Qué te pareció el servicio? Tu opinión nos ayuda a mejorar.
            </DialogDescription>
          </DialogHeader>
        ) : (
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-semibold text-[var(--gold)]">
              Califica tu experiencia
            </DrawerTitle>
            <DrawerDescription>
              ¿Qué te pareció el servicio? Tu opinión nos ayuda a mejorar.
            </DrawerDescription>
          </DrawerHeader>
        )}
        <div className="py-8 flex items-center justify-center">
          <ToggleGroup
            type="single"
            onValueChange={(value) => handleRate(reservationId, Number(value))}
            className="flex items-center gap-4"
          >
            {[1, 2, 3, 4, 5].map((rating, index) => (
              <ToggleGroupItem
                key={`${reservationId}-rating-${index}`}
                value={rating.toString()}
                className="p-4 data-[state=on]:bg-gold data-[state=on]:text-dark hover:bg-gold/10 transition-all duration-200 rounded-lg"
              >
                <Star className="w-8 h-8" />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        {!isDesktop && (
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </>
    );

    if (isDesktop) {
      return (
        <Dialog open={ratingDialog === reservationId} onOpenChange={() => setRatingDialog(null)}>
          <DialogContent
            className="
          max-w-md rounded-2xl border
          border-[var(--gold)]
          bg-[var(--dark-light)]
          text-[var(--smoke)]
          shadow-[0_0_25px_var(--gold)]
        "
          >
            {ratingContent}
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Drawer open={ratingDialog === reservationId} onOpenChange={() => setRatingDialog(null)}>
        <DrawerContent className="rounded-2xl border shadow-[0_0_25px_var(--gold)] text-[var(--smoke)] border-[var(--gold)] bg-[var(--dark-light)] px-4">
          {ratingContent}
        </DrawerContent>
      </Drawer>
    );
  });

  RatingDialog.displayName = 'RatingDialog';

  if (reservations && reservations.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-100">Sin reservaciones</h3>
        <p className="mt-2 text-sm text-gray-400">Tus servicios agendados aparecerán aquí.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {reservations?.map((reservation, index) => {
          const service: Service = reservation.seatId
            ? (BANQUET_SERVICE_DATA as Service)
            : (reservation.service as Service);
          return (
            <Card
              key={`reservation-${index}`}
              className="group p-6 rounded-md border overflow-hidden shadow-md transition-all duration-200"
              style={{
                background: 'linear-gradient(180deg, var(--card), var(--dark))',
                borderColor: 'var(--border)',
                color: 'var(--card-foreground)',
                boxShadow: 'var(--shadow)',
              }}
            >
              <div className="relative space-y-4">
                {/* Header con nombre y precio */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--gold)' }}>
                    {service.name}
                  </h3>
                  <p className="text-lg font-semibold" style={{ color: 'var(--gold-light)' }}>
                    {service.eiltRate} EILT
                  </p>
                </div>

                {/* Fecha y acciones */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>
                      {format(new Date(reservation.startTime), "d 'de' MMMM, h:mm a", {
                        locale: es,
                      })}{' '}
                      - {format(new Date(reservation.endTime), 'h:mm a', { locale: es })}.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!reservation.isRedeemed ? (
                      <Button
                        variant="default"
                        className="bg-gold text-secondary transition-colors"
                        onClick={() => handleRedeem(reservation)}
                      >
                        Redimir
                      </Button>
                    ) : (
                      <span className="text-sm text-gray-400">Redimido</span>
                    )}
                    <Button
                      variant="ghost"
                      className={`transition-colors ${reservation.isRedeemed ? 'text-gray-500 cursor-not-allowed opacity-60' : 'text-red-400 hover:text-red-500'}`}
                      onClick={() =>
                        !reservation.isRedeemed && handleCancel(reservation.id, service.name)
                      }
                      disabled={reservation.isRedeemed}
                      aria-disabled={reservation.isRedeemed}
                      title={
                        reservation.isRedeemed
                          ? 'No se puede cancelar. Ya fue redimida.'
                          : 'Cancelar reservación'
                      }
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>

                {/* Rating y descripción */}
                <div className="space-y-3">
                  {reservation.isRedeemed && (
                    <div className="flex items-center gap-2">
                      {reservation.isRated ? (
                        <div className="flex items-center">
                          {Array.from({ length: reservation.rating || 0 }).map((_, i) => (
                            <Star
                              key={`reservation-${index}-star-${i}`}
                              className="w-4 h-4 text-[var(--gold)]"
                            />
                          ))}
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="text-sm border-gold/30 hover:border-gold/60"
                          onClick={() => setRatingDialog(reservation.id)}
                        >
                          Calificar
                        </Button>
                      )}
                    </div>
                  )}
                  <p className="text-sm" style={{ color: 'var(--card-foreground)' }}>
                    {service.description}
                  </p>
                </div>
              </div>
              <RatingDialog reservationId={reservation.id} />
            </Card>
          );
        })}
      </div>

      {/* ✅ ADD THIS RENDER LOGIC OUTSIDE THE MAP LOOP */}
      {(() => {
        // Find the full reservation object that matches the ID in our state
        const activeReservation = reservations?.find((r) => r.id === redeemDialog);

        if (!activeReservation) {
          return null;
        }
        return (
          <RedeemDialog
            spirit={account.spirit}
            service={activeReservation.service as Service}
            songUrl={'/song.mp3'}
            onClose={() => executeRedeem(activeReservation)}
          />
        );
      })()}
      {/* End of added logic */}
    </div>
  );
}
