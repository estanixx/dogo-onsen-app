import { Spirit, SpiritType, VenueAccount } from '@/lib/types';
import Image from 'next/image';

interface SpiritInfoProps {
  account: VenueAccount;
}

/**
 * Muestra información del espíritu en la barra lateral de la habitación
 * Presenta detalles del espíritu, tipo, balance y tiempo restante
 */
export function SpiritInfo({ account }: SpiritInfoProps) {
  const spirit: Spirit = account.spirit;
  const spiritType: SpiritType = spirit.type;
  if (!spirit || !spiritType || !account) {
    return (
      <div className="animate-pulse w-full">
        <div className="rounded-full bg-white/30 h-24 w-24 mb-4" />
        <div className="h-4 bg-white/30 rounded w-3/4 mb-2" />
        <div className="h-4 bg-white/30 rounded w-1/2 mb-4" />
        <div className="h-4 bg-white/30 rounded w-2/3" />
      </div>
    );
  }

  // const timeRemaining = new Date(account.endTime).getTime() - Date.now();
  // const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
  // Nota: se está mockeando temporalmente porque en el frontend aparece -1

  const daysRemaining = 20;

  return (
    <div className="w-full">
      <div className="lg:space-y-6 flex lg:flex-col flex-row flex-wrap justify-around lg:justify-start">
        {/* Spirit Image and Name */}
        <div className="text-center w-full lg:w-auto mb-6 lg:mb-0">
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

        {/* Spirit Info Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6 w-full lg:w-auto">
          {/* Spirit Type */}
          <div className="text-center lg:text-left">
            <p className="text-sm text-indigo-200">Tipo de Espíritu</p>
            <p className="font-medium">{spiritType.name}</p>
          </div>

          {/* EILT Balance */}
          <div className="text-center lg:text-left">
            <p className="text-sm text-indigo-200">Balance</p>
            <p className="font-medium">{spirit.eiltBalance} EILT</p>
          </div>

          {/* Time Remaining */}
          <div className="text-center lg:text-left col-span-2 lg:col-span-1">
            <p className="text-sm text-indigo-200">Tiempo restante</p>
            <p className="font-medium">{daysRemaining} días</p>
          </div>
        </div>
      </div>
    </div>
  );
}
