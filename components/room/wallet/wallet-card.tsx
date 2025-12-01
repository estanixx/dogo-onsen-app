'use client';

import { CardButton } from '@/components/shared/card-button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createDeposit, getCurrentVenueAccount } from '@/lib/api';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';

interface CardModalProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  modalTitle?: string;
  modalDescription?: string;
  venueId?: string;
}

export function CardModal({
  title,
  description,
  icon,
  modalTitle,
  modalDescription,
  venueId,
}: CardModalProps) {
  const [amount, setAmount] = React.useState('');
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Next.js router to refresh server components after update
  const router = useRouter();

  // When amount is submitted update the spirit eiltBalance for the spirit
  // located in the current venue (if any). After successful update refresh
  // the page so server components (e.g. SpiritInfo) re-fetch updated data.
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }
    const value = Number(amount);
    if (isNaN(value) || value <= 0) {
      // invalid amount
      return;
    }

    if (!venueId) {
      console.error('No venueId provided to CardModal, cannot update balance');
      return;
    }

    try {
      setIsSubmitting(true);

      const account = await getCurrentVenueAccount(venueId);
      // Create a deposit record for auditing/history. The backend will recompute
      // the account balance (eiltBalance) so we only need to create the deposit.
      try {
        // Deposit.amount is an integer
        if (!account || !account.id) {
          throw new Error('No venue account found for current venue');
        }
        const deposit = await createDeposit(account.id, Math.round(value));
        if (!deposit) {
          toast.error('Error al registrar el depósito. Inténtalo de nuevo.');
          return;
        }
        console.log('Depósito registrado:', deposit);
      } catch (err) {
        console.warn('Failed to create deposit record', err);
        // Inform the user but keep the updated balance (server-side)
      }

      setIsSuccess(true);
      toast.success(`Balance actualizado +${value} Eilts`);
      setAmount('');

      // trigger server-side re-render so `SpiritInfo` shows updated balance
      try {
        router.refresh();
      } catch (err) {
        // ignore router refresh errors
        console.warn('router.refresh failed', err);
      }

      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating balance:', err);
      // Could show a toast here — for now keep it simple
      alert('No se pudo actualizar el balance. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <CardButton title={title} description={description} icon={icon} />
      </DialogTrigger>

      <DialogContent
        className="
          max-w-md rounded-2xl border
          border-[var(--gold)]
          bg-[var(--dark-light)]
          text-[var(--smoke)]
          shadow-[0_0_25px_var(--gold)]
        "
      >
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl tracking-wide text-[var(--gold)]">
            {modalTitle || title}
          </DialogTitle>

          {modalDescription && (
            <DialogDescription className="text-sm text-[var(--beige)]/90">
              {modalDescription}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Formulario de la billetera */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 py-4"
          onInvalid={(e) =>
            (e.currentTarget as HTMLFormElement)
              .querySelector('input')
              ?.setCustomValidity('Por favor, ingrese un monto válido mayor a 0.')
          }
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="amount"
              className="text-sm font-bold tracking-wider text-[var(--smoke)]"
            >
              Monto a recargar
            </label>
            <input
              id="amount"
              type="number"
              min="1"
              required
              placeholder="Ej. 50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onInput={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity('')}
              className="
                px-3 py-2 rounded-md border text-[var(--smoke)]
                bg-[var(--dark)] border-[var(--gold-dark)]
                placeholder:text-[color:var(--gold-light)]/50
                focus:outline-none focus:border-[var(--gold-light)]
                [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
              "
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              disabled={isSuccess}
              className={`
                font-semibold tracking-wide transition-colors
                ${
                  isSuccess
                    ? 'bg-green-500 text-white hover:bg-green-400'
                    : 'bg-[var(--gold)] text-[var(--dark)] hover:bg-[var(--gold-light)]'
                }
              `}
            >
              {isSuccess ? 'Monto Cargado ✔' : 'Recargar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
