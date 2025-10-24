'use client';

import React, { useEffect, useState, useRef } from 'react';
import { getAvailablePrivateVenues } from '@/lib/api/index';
import SpiritSelect from './spirit-select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDownIcon } from 'lucide-react';
import { P } from '@/components/shared/typography';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type CheckInResult = {
  venueId: string;
  pin: string;
  id: string;
  checkin: Date;
  checkout: Date;
};

export default function CheckInForm({ initialValues }: { initialValues?: Partial<CheckInResult> }) {
  const [id, setId] = useState(initialValues?.id ?? '');
  const [checkin, setCheckin] = useState(initialValues?.checkin ?? new Date());
  const [checkout, setCheckout] = useState(initialValues?.checkout ?? new Date());
  const [room, setRoom] = useState(initialValues?.venueId ?? '');
  const [pin, setPin] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Get available venues
  const [venues, setVenues] = useState<{ id: string; state: boolean }[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const checkoutRef = useRef<HTMLInputElement | null>(null);
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    (async () => {
      try {
        const data = await getAvailablePrivateVenues(checkin, checkout);
        if (isMounted) {
          setVenues(data.filter((v) => v.state === true));
        }
      } catch (err) {
        console.error('Failed to load venues', err);
        if (isMounted) {
          setVenues([]);
        }
      }
    })();

    return () => {
      setIsMounted(false);
    };
  }, [checkin, checkout]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formEl = e.currentTarget as HTMLFormElement;
    if (!formEl.checkValidity()) {
      formEl.reportValidity();
      return;
    }

    if (checkin > checkout) {
      const msg = 'Completa el campo o verifica la fecha.';
      if (checkoutRef.current) {
        checkoutRef.current.setCustomValidity(msg);
        checkoutRef.current.reportValidity();
      }

      setPin(null);
      return;
    }

    setIsSuccess(true);

    setTimeout(() => setIsSuccess(false), 3000);

    // Generate a new PIN. In the future this should be handled by the backend
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    setPin(newPin);

    // Clear form (reset to now)
    setId('');
    setCheckin(new Date());
    setCheckout(new Date());
    setRoom('');
  };

  return (
    <aside className="w-full p-6 flex flex-col items-center justify-start [&>div]:w-full">
      <h2 className="font-titles text-3xl font-bold text-[var(--gold)] mb-6 tracking-wider">
        Registro
      </h2>
      <div className="flex flex-col gap-2">
        <Label htmlFor="checkin" className="text-lg text-bold tracking-wide">
          Seleccionar Espíritu
        </Label>
        <SpiritSelect id={id} setId={setId} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 w-full"
        onInvalid={(e) => {
          const invalidEl = e.target as HTMLInputElement | HTMLSelectElement | null;
          if (!invalidEl) {
            return;
          }

          const message = 'Completa el campo o verificar la fecha.';
          try {
            (invalidEl as HTMLInputElement).setCustomValidity(message);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.debug('setCustomValidity failed', err);
          }
        }}
      >
        {/* Check-in Date */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="checkin" className="text-lg text-bold tracking-wide">
            Fecha de entrada
          </Label>
          <Popover open={checkinOpen} onOpenChange={setCheckinOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                id="checkin"
                className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-dark border border-gold/20 focus:outline-none focus:border-gold-light text-smoke"
              >
                {checkin ? checkin.toISOString().split('T')[0] : 'Seleccionar fecha'}
                <ChevronDownIcon />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={checkin}
                onSelect={(d) => {
                  if (d) {
                    setCheckin(d);
                  }
                  setCheckinOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
          {/* Hidden input to keep native validation/reportValidity working */}
          <input
            aria-hidden
            className="sr-only"
            type="date"
            value={checkin.toISOString().split('T')[0]}
            onChange={(e) => setCheckin(new Date(e.target.value))}
            onInput={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity('')}
            required
          />
        </div>

        {/* Check-out Date */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="checkout" className="text-lg text-bold tracking-wide">
            Fecha de salida
          </Label>
          <Popover open={checkoutOpen} onOpenChange={setCheckoutOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                id="checkout"
                className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-dark border border-gold/20 focus:outline-none focus:border-gold-light text-smoke"
              >
                {checkout ? checkout.toISOString().split('T')[0] : 'Seleccionar fecha'}
                <ChevronDownIcon />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={checkout}
                onSelect={(d) => {
                  if (d) {
                    setCheckout(d);
                  }
                  setCheckoutOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
          {/* Hidden input to preserve validation and allow setCustomValidity/reportValidity */}
          <input
            ref={checkoutRef}
            aria-hidden
            className="sr-only"
            type="date"
            value={checkout.toISOString().split('T')[0]}
            onChange={(e) => setCheckout(new Date(e.target.value))}
            onInput={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity('')}
            required
          />
        </div>

        {/* Available Rooms */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="room" className="text-lg text-bold tracking-wide">
            Habitación
          </Label>
          <Select value={room} onValueChange={setRoom} required>
            <SelectTrigger
              id="room"
              className="px-3 py-2 w-full rounded-md bg-dark border border-gold/20 focus:outline-none focus:border-gold-light text-smoke"
            >
              <SelectValue placeholder="Selecciona una habitación" />
            </SelectTrigger>
            <SelectContent className="bg-[var(--dark)] text-[var(--smoke)]">
              {venues.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  Habitación {v.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submittion button */}
        <Button
          disabled={isSuccess}
          type="submit"
          className={`
                font-semibold tracking-wide transition-colors
                ${
                  isSuccess
                    ? 'bg-green-500 text-white hover:bg-green-400'
                    : 'bg-[var(--gold)] text-[var(--dark)] hover:bg-[var(--gold-light)]'
                }
              `}
        >
          {isSuccess ? 'Espíritu Registrado ✔' : 'Registrar'}
        </Button>

        {pin && (
          <P className="text-gold text-lg font-serif text-center mt-3">
            PIN generado: <span className="font-bold">{pin}</span>
          </P>
        )}
      </form>
    </aside>
  );
}
