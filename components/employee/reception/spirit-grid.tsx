'use client';
import { LoadingBox } from '@/components/shared/loading';
import SpiritCard from '@/components/shared/spirit-card';
import { P } from '@/components/shared/typography';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSpirit } from '@/context/spirit-context';
import { getAllSpirits } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function SpiritGrid() {
  const { spirits, setSpirits } = useSpirit();
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');
  useEffect(() => {
    setState('loading');
    const fetchData = async () => {
      const data = await getAllSpirits();
      setSpirits(data);
      setState('loaded');
    };
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="">
      {/* Placeholder for Spirit Cards */}
      {state === 'loading' && <LoadingBox> Cargando espíritus...</LoadingBox>}
      {state === 'loaded' && spirits && spirits?.length === 0 && (
        <P className="text-center col-span-full">No hay espíritus registrados.</P>
      )}
      {state === 'loaded' && spirits && spirits?.length > 0 && (
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spirits.map((spirit) => (
              <SpiritCard key={spirit.id} spirit={spirit} />
            ))}
          </div>
        </ScrollArea>
      )}
      {state === 'error' && (
        <P className="text-center col-span-full">Error al cargar los espíritus.</P>
      )}
    </div>
  );
}
