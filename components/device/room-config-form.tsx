'use client';

import { DogoCard, DogoButton } from '@/components/shared/dogo-ui';
import { Input } from '@/components/ui/input';

interface RoomConfigFormProps {
  onSubmit: (roomId: string) => Promise<void>;
}

export function RoomConfigForm({ onSubmit }: RoomConfigFormProps) {
  async function handleSubmit(formData: FormData) {
    const roomId = formData.get('roomId')?.toString();
    if (!roomId) {
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
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--gold)]/70">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-key-round"
              >
                <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" />
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
              </svg>
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
