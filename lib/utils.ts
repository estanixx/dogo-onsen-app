import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createDatetimeFromDateAndTime(date: Date, timeString: string): Date {
  // Accept formats like "11:00", "23:30", "11:00 AM", "11:00AM", optionally with seconds "11:00:30 PM"
  const m = timeString.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AaPp][Mm])?$/);
  if (!m) {
    throw new Error(`Invalid time string: ${timeString}`);
  }

  const [, hStr, minStr, secStr, ampm] = m;
  let hours = Number(hStr);
  const minutes = Number(minStr);
  const seconds = secStr ? Number(secStr) : 0;

  if (ampm) {
    const up = ampm.toUpperCase();
    if (up === 'AM') {
      if (hours === 12) {
        hours = 0;
      }
    } else {
      // PM
      if (hours !== 12) {
        hours = (hours % 12) + 12;
      }
    }
  }

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    Number.isNaN(seconds) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    throw new Error(`Invalid time values in: ${timeString}`);
  }
  const combined = new Date(date);
  combined.setHours(hours, minutes, seconds, 0);
  return combined;
}

/**
 * Check if a service can be booked based on item availability
 * @param isAvailable - Whether all required items are in stock
 * @param insufficientItems - List of items that don't have enough stock
 * @returns Human-readable message about availability
 */
export function getServiceAvailabilityMessage(isAvailable: boolean): string {
  if (isAvailable) {
    return 'SERVICIO DISPONIBLE';
  }

  return 'SERVICIO NO DISPONIBLE';
}
