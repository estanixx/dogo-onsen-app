import { Button } from '@/components/ui/button';
import type { Service, Spirit } from '@/lib/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface RedeemDialogProps {
  songUrl: string;
  service: Service;
  spirit: Spirit;
  onClose: () => void;
}

export default function RedeemDialog({ spirit, service, songUrl, onClose }: RedeemDialogProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const SPIRIT_FALLBACK_URL =
    'https://theentertainmentnut.wordpress.com/wp-content/uploads/2012/09/nf0.jpg?w=584';

  // const spiritImage = spirit.ima;
  const [currentSpiritSrc, setCurrentSpiritSrc] = useState(spirit.image || SPIRIT_FALLBACK_URL);

  useEffect(() => {
    setCurrentSpiritSrc(spirit.image || SPIRIT_FALLBACK_URL);
  }, [spirit]);

  // 🎵 Reproducir la canción cuando se abra el diálogo
  useEffect(() => {
    const audio = new Audio(songUrl);
    audio.volume = 0.1;
    audio.loop = true;
    audio.play().catch(() => {
      console.warn('Autoplay blocked — user interaction required.');
    });
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [songUrl]);

  // 🖱 Rastrear la posición del ratón o el toque
  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const { clientX, clientY } = 'touches' in e ? e.touches[0] : (e as React.MouseEvent);
    setPos({ x: clientX, y: clientY });
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center text-white z-50"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      <h1 className="text-2xl font-serif tracking-wide text-[var(--gold)] border-b-2 border-[var(--gold)]/20 pb-1">
        Disfruta de tu {service.name}.
      </h1>
      {/* Imagen del servicio */}
      <div className="relative w-[90vw] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg aspect-square">
        <Image
          src={service.image}
          alt={service.name}
          fill
          className="rounded-2xl object-cover"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 50vw"
        />
      </div>
      {/* Imagen del espíritu */}
      <motion.img
        src={currentSpiritSrc}
        alt="Fantasma"
        className="absolute w-20 h-20 pointer-events-none"
        style={{ translateX: '-50%', translateY: '-50%' }}
        animate={{ left: pos.x, top: pos.y + 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onError={() => setCurrentSpiritSrc(SPIRIT_FALLBACK_URL)}
      />

      {/* ✅ Botón "Terminé" */}
      <Button onClick={onClose} className="mt-8 bg-white text-black text-lg px-6 py-3 rounded-full">
        Terminé
      </Button>
    </div>
  );
}
