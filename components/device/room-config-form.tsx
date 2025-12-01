'use client';

import { DogoCard, DogoButton } from '@/components/shared/dogo-ui';
import { Input } from '@/components/ui/input';
import { getCurrentVenueAccount } from '@/lib/api';
import { VenueAccount } from '@/lib/types';
import React from 'react';
import { MdOutlineMeetingRoom } from 'react-icons/md';
import { VscKey } from 'react-icons/vsc';
import { toast } from 'sonner';
interface RoomConfigFormProps {
  onSubmit: (roomId: string) => Promise<void>;
}

export function RoomConfigForm({ onSubmit }: RoomConfigFormProps) {
  async function handleSubmit(formData: FormData) {
    const roomId = formData.get('roomId')?.toString();
    const pin = formData.get('pin')?.toString();
    if (!roomId) {
      toast.error('Por favor ingresa un identificador de habitación válido.');
      return;
    }
    if (!pin) {
      toast.error('Por favor ingresa un PIN de seguridad válido.');
      return;
    }
    const account = await getCurrentVenueAccount(roomId);
    if (!account) {
      toast.error('No se encontró una cuenta para la habitación proporcionada.');
      return;
    }
    if (account.pin !== pin) {
      toast.error('El PIN de seguridad es incorrecto.');
      return;
    }
    await onSubmit(roomId);
  }



  return (
    <div className="w-full max-w-md mx-auto">
      <DogoCard className="p-6">
        <p className="text-white/70 text-center mb-6">
          Ingresa el identificador de la habitación para configurar este dispositivo
        </p>
        <form action={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              name="roomId"
              placeholder="Identificador de habitación"
              required
              className="bg-[var(--dark)]/50 border-white/20 text-white text-lg h-12 pl-4 pr-12 focus-visible:ring-[var(--gold)]/30 focus-visible:border-[var(--gold)]/50 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">
              <MdOutlineMeetingRoom />
            </div>
          </div>
          <div className="relative">
            <Input
              name="pin"
              placeholder="PIN de seguridad"
              required
              className="bg-[var(--dark)]/50 border-white/20 text-white text-lg h-12 pl-4 pr-12 focus-visible:ring-[var(--gold)]/30 focus-visible:border-[var(--gold)]/50 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">
              <VscKey />
            </div>
          </div>
          <DogoButton type="submit">Configurar</DogoButton>
        </form>
      </DogoCard>

      {/* Decorative elements */}
      <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-gold/20 to-transparent mt-8" />
    </div>
  );
}
