import { Reservation, Service } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock } from "lucide-react";
import { formatRelative } from "date-fns";

interface ReservationCardProps {
  reservation: Reservation & { service: Service };
  onRedeem: () => void;
  onRate: (rating: number) => void;
}

/**
 * Card component for displaying a single reservation
 * Shows service details and actions (redeem/rate)
 */
export function ReservationCard({ reservation, onRedeem, onRate }: ReservationCardProps) {
  const { service, startTime, endTime, isRedeemed, rating } = reservation;
  const canRedeem = !isRedeemed && new Date(startTime) <= new Date() && new Date(endTime) >= new Date();

  return (
    <Card className="overflow-hidden bg-white">
      {/* Service Image */}
      {service.image && (
        <div className="relative h-40 w-full">
          <img
            src={service.image}
            alt={service.name}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{service.name}</h3>
            <p className="text-sm text-gray-500">{service.eiltRate} EILT</p>
          </div>
          {isRedeemed && rating && (
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>{formatRelative(new Date(startTime), new Date())}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="mr-2 h-4 w-4" />
            <span>{`${new Date(startTime).toLocaleTimeString()} - ${new Date(
              endTime
            ).toLocaleTimeString()}`}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50">
        {!isRedeemed ? (
          <Button
            onClick={onRedeem}
            disabled={!canRedeem}
            className="w-full"
            variant={canRedeem ? "default" : "secondary"}
          >
            {canRedeem ? "Reclama ahora" : "Aún no disponible"}
          </Button>
        ) : !rating ? (
          <Button
            onClick={() => onRate(0)}
            variant="outline"
            className="w-full"
          >
            Calificar Servicio
          </Button>
        ) : (
          <p className="text-sm text-gray-500 text-center w-full">
            Servicio completado
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
