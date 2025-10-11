"use client";

import React, { useEffect, useState, useRef } from "react";
import { getAvailablePrivateVenues } from "@/lib/api/index";

export type CheckInResult = {
  venueId: string;
  pin: string;
  id: string;
  checkin: string;
  checkout: string;
};

export default function CheckInForm({
  initialValues,
}: {
  initialValues?: Partial<CheckInResult>;
}) {
  const [id, setId] = useState(initialValues?.id ?? "");
  const [checkin, setCheckin] = useState(initialValues?.checkin ?? "");
  const [checkout, setCheckout] = useState(initialValues?.checkout ?? "");
  const [room, setRoom] = useState(initialValues?.venueId ?? "");
  const [pin, setPin] = useState<string | null>(null);

  // Get available venues
  const [venues, setVenues] = useState<{ id: string; state: boolean }[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const checkoutRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const data = await getAvailablePrivateVenues();
        if (isMounted) {
          setVenues(data.filter((v) => v.state === true));
        }
      } catch (err) {
          console.error("Failed to load venues", err);
          if (isMounted) { setVenues([]); }
        }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

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

    // Clear form
    setId("");
    setCheckin("");
    setCheckout("");
    setRoom("");
  };

  return (
    <aside className="w-72 p-6 flex flex-col items-center justify-between">
      <h2 className="text-3xl font-serif text-[var(--gold)] mb-6 tracking-wider">
        Check-in / Registro
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
        onInvalid={(e) => {
          const invalidEl = (e.target as HTMLInputElement | HTMLSelectElement | null);
          if (!invalidEl) { return; }

          const message = 'Completa el campo o verificar la fecha.';
          try {
            (invalidEl as HTMLInputElement).setCustomValidity(message);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.debug('setCustomValidity failed', err);
          }
        }}
      >
        {/* ID */}
        <div className="flex flex-col gap-2">
          <label htmlFor="id" className="text-lg text-bold tracking-wide">
            Número de identificación
          </label>
          <input
            id="id"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onInput={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity('')}
            required
            placeholder="Ej. 007"
            className="px-3 py-2 rounded-md bg-dark border border-gold/20 focus:outline-none focus:border-gold-light text-smoke placeholder-smoke/50"
          />
        </div>

        {/* Check-in Date */}
        <div className="flex flex-col gap-2">
          <label htmlFor="checkin" className="text-lg text-bold tracking-wide">
            Fecha de entrada
          </label>
          <input
            id="checkin"
            type="date"
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
            onInput={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity('')}
            required
            className="px-3 py-2 rounded-md bg-dark border border-gold/20 focus:outline-none focus:border-gold-light text-smoke"
          />
        </div>

        {/* Check-out Date */}
        <div className="flex flex-col gap-2">
          <label htmlFor="checkout" className="text-lg text-bold tracking-wide">
            Fecha de salida
          </label>
          <input
            id="checkout"
            type="date"
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
            onInput={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity('')}
            ref={checkoutRef}
            required
            className="px-3 py-2 rounded-md bg-dark border border-gold/20 focus:outline-none focus:border-gold-light text-smoke"
          />
        </div>

        {/* Available Rooms */}
        <div className="flex flex-col gap-2">
          <label htmlFor="room" className="text-lg text-bold tracking-wide">
            Habitación
          </label>
          <select
            id="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            onInput={(e) => (e.currentTarget as HTMLSelectElement).setCustomValidity('')}
            required
            className="px-3 py-2 rounded-md bg-dark border border-gold/20 focus:outline-none focus:border-gold-light text-smoke"
          >
            <option value="">Selecciona una habitación</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id} className="bg-[var(--dark)] text-[var(--smoke)]">
                Habitación {v.id}
              </option>
            ))}
          </select>

        </div>

        {/* Submittion button */}
        <button
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
        </button>

        {pin && (
          <p className="text-gold text-lg font-serif text-center mt-3">
            PIN generado: <span className="font-bold">{pin}</span>
          </p>
        )}
      </form>
    </aside>
  );
}
