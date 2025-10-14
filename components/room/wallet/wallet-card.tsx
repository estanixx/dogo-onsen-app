'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CardButton } from '@/components/shared/card-button';

interface CardModalProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  modalTitle?: string;
  modalDescription?: string;
}

export function CardModal({
  title,
  description,
  icon,
  modalTitle,
  modalDescription,
}: CardModalProps) {
  const [amount, setAmount] = React.useState('');
  const [isSuccess, setIsSuccess] = React.useState(false);

  // In the future, it will be needed to handle the form submission to the backend
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsSuccess(true);
    setAmount('');

    setTimeout(() => setIsSuccess(false), 3000);
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

        {/* Wallet Form */}
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
