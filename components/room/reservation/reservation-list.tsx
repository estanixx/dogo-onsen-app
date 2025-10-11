"use client";

import { Reservation, Service } from "@/lib/types";
import { ReservationCard } from "./reservation-card";
import { useEffect, useState } from "react";

interface ReservationListProps {
  accountId: string;
}

/**
 * Displays a grid of reservation cards
 * Handles fetching and filtering of reservations
 */
export function ReservationList({ accountId }: ReservationListProps) {
  const [reservations, setReservations] = useState<(Reservation & { service: Service })[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: Fetch reservations data from API
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // const data = await fetchAccountReservations(accountId);
        // setReservations(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        setLoading(false);
      }
    };

    fetchReservations();
  }, [accountId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg"/>
          </div>
        ))}
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Sin reservaciones</h3>
        <p className="mt-2 text-sm text-gray-600">
          Tus servicios agendados aparecerán aquí
        </p>
      </div>
    );
  }

  const activeReservations = reservations.filter(r => !r.isRedeemed);
  const pastReservations = reservations.filter(r => r.isRedeemed);

  return (
    <div className="space-y-8">
      {/* Active Reservations */}
      {activeReservations.length > 0 && (
        <section>
          <h2 className="text-xl font-medium text-gray-900 mb-4">Reservaciones Activas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onRedeem={() => {
                  // TODO: Implement redeem functionality
                }}
                onRate={(rating: number) => {
                  // TODO: Implement rating functionality
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Past Reservations */}
      {pastReservations.length > 0 && (
        <section>
          <h2 className="text-xl font-medium text-gray-900 mb-4">Reservaciones Pasadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onRedeem={() => {
                  // TODO: Implement redeem functionality
                }}
                onRate={(rating: number) => {
                  // TODO: Implement rating functionality
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
