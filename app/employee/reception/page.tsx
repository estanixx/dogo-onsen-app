"use client";

import { useState } from "react";
import { getAvailablePrivateVenues } from "@/lib/api";

export default function CheckInPage() {
  const [id, setId] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [room, setRoom] = useState("");
  const [pin, setPin] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Get available venues
  const [venues, setVenues] = useState<
    { id: string; state: boolean }[]
  >([]);

  // Load venues
  useState(() => {
    getAvailablePrivateVenues().then((data) => {
      setVenues(data.filter((v) => v.state === true));
    });
  });

  // Form validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate if all fields were filled.
    if (!id || !checkin || !checkout || !room) {
      setError("Por favor completa todos los campos antes de continuar.");
      setPin(null);
      return;
    }

    // Validate if Check-in date is smaller than Check-Out date.
    if (checkin > checkout) {
      setError("Por favor verifique que la fecha de salida sea posterior a la de entrada.");
      setPin(null);
      return;
    }

    setError("");

    // Generate 4 digit pin. In the future it will be necessary to assign it to the room so that the spirit can log into his room.
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    setPin(newPin);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-dark text-gray-300">
      {/* Form Sidebar */}
      <aside className="w-96 bg-dark-light p-6 shadow-md border-r border-gold/10">
        <h2 className="text-2xl font-serif text-gold mb-6 tracking-wider">
          Registro de Check-in
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* ID */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="id"
              className="text-gold-light text-sm uppercase tracking-wide"
            >
              Número de identificación
            </label>
            <input
              id="id"
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Ej. 007"
              className="px-3 py-2 rounded-md bg-dark border border-gold/20 focus:outline-none focus:border-gold-light text-smoke placeholder-smoke/50"
            />
          </div>

          {/* Check-in Date */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="checkin"
              className="text-gold-light text-sm uppercase tracking-wide"
            >
              Fecha de entrada
            </label>
            <input
              id="checkin"
              type="date"
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
              className="px-3 py-2 rounded-md bg-dark border border-gold/20 focus:outline-none focus:border-gold-light text-smoke"
            />
          </div>

          {/* Check-out Date */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="checkout"
              className="text-gold-light text-sm uppercase tracking-wide"
            >
              Fecha de salida
            </label>
            <input
              id="checkout"
              type="date"
              value={checkout}
              onChange={(e) => setCheckout(e.target.value)}
              className="px-3 py-2 rounded-md bg-dark border border-gold/20 focus:outline-none focus:border-gold-light text-smoke"
            />
          </div>

          {/* Available Rooms */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="room"
              className="text-gold-light text-sm uppercase tracking-wide"
            >
              Habitación
            </label>
            <select
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
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
            type="submit"
            className="mt-4 py-2 rounded-md bg-gold text-dark font-semibold uppercase tracking-wide hover:bg-gold-light transition-colors"
          >
            Registrar
          </button>

          {/* Submittion messages */}
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
          {pin && (
            <p className="text-gold text-lg font-serif text-center mt-3">
              PIN generado: <span className="font-bold">{pin}</span>
            </p>
          )}
        </form>
      </aside>

      {/* Zona principal */}
      <main className="flex-1 flex items-center justify-center text-smoke/60 font-serif italic">
        Próximamente: vista general del check-in 🏯
      </main>
    </div>
  );
}
