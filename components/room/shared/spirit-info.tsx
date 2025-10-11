
import { Spirit, SpiritType, VenueAccount } from "@/lib/types";
import Image from "next/image";

interface SpiritInfoProps {
  account: VenueAccount;
}


/**
 * Displays spirit information in the room sidebar
 * Shows spirit details, type, balance and remaining time
 */
export function SpiritInfo({ account }: SpiritInfoProps) {
  const spirit: Spirit = account.spirit;
  const spiritType: SpiritType = spirit.type;
  if (!spirit || !spiritType || !account) {
    return (
      <div className="animate-pulse w-full">
        <div className="rounded-full bg-white/30 h-24 w-24 mb-4"/>
        <div className="h-4 bg-white/30 rounded w-3/4 mb-2"/>
        <div className="h-4 bg-white/30 rounded w-1/2 mb-4"/>
        <div className="h-4 bg-white/30 rounded w-2/3"/>
      </div>
    );
  }

  const timeRemaining = new Date(account.endTime).getTime() - Date.now();
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6 w-full">
      {/* Spirit Image and Name */}
      <div className="text-center">
        {spirit.image ? (
          <div className="relative w-24 h-24 mx-auto mb-3">
            <Image
              src={spirit.image}
              alt={spirit.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-indigo-800 flex items-center justify-center">
            <span className="text-3xl">{spirit.name[0]}</span>
          </div>
        )}
        <h2 className="text-xl font-semibold">{spirit.name}</h2>
      </div>

      {/* Spirit Type */}
      <div>
        <p className="text-sm text-indigo-200">Tipo de Espíritu</p>
        <p className="font-medium">{spiritType.name}</p>
      </div>

      {/* EILT Balance */}
      <div>
        <p className="text-sm text-indigo-200">Balance</p>
        <p className="font-medium">{spirit.eiltBalance} EILT</p>
      </div>

      {/* Time Remaining */}
      <div>
        <p className="text-sm text-indigo-200">Tiempo restante</p>
        <p className="font-medium">{daysRemaining} días</p>
      </div>
    </div>
  );
}
