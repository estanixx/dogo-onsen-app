import { Spirit } from '@/lib/types';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { H3, P } from './typography';

interface SpiritCardProps {
  spirit: Spirit;
}

const SpiritCard: React.FC<SpiritCardProps> = ({ spirit }) => {
  const active = spirit.active;
  const unactive = !spirit.active;
  return (
    <Card className="p-4 border rounded-md grid grid-cols-1 lg:grid-cols-2 gap-2">
      <div className="flex items-center justify-center">
        <figure className="relative w-32 h-32 rounded-full">
          {spirit.image && (
            <Image
              fill
              src={spirit.image}
              alt={spirit.name}
              className="object-cover rounded-full"
            />
          )}
        </figure>
      </div>
      <span className="flex flex-col">
        <H3 className="font-medium text-center lg:text-left">{spirit.name}</H3>
        <P className="text-sm">Tipo: {spirit.type?.name}</P>
        {/* Balance is computed on the venue account - not present on Spirit here */}
        {active && (
          <Badge variant="secondary" className="self-end">
            Activo
          </Badge>
        )}
        {unactive && (
          <Badge variant="destructive" className="self-end">
            Inactivo
          </Badge>
        )}
      </span>
    </Card>
  );
};

export default SpiritCard;
