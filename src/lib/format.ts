import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

// All display times in America/Chicago
const TZ = 'America/Chicago';

export function formatDateTime(iso: string): string {
  try {
    const date = parseISO(iso);
    if (!isValid(date)) return iso;
    const zoned = toZonedTime(date, TZ);
    return format(zoned, 'MMM d, yyyy h:mm a') + ' CT';
  } catch {
    return iso;
  }
}

export function formatDate(iso: string): string {
  try {
    const date = parseISO(iso);
    if (!isValid(date)) return iso;
    const zoned = toZonedTime(date, TZ);
    return format(zoned, 'MMM d, yyyy');
  } catch {
    return iso;
  }
}

export function formatTime(iso: string): string {
  try {
    const date = parseISO(iso);
    if (!isValid(date)) return iso;
    const zoned = toZonedTime(date, TZ);
    return format(zoned, 'h:mm a') + ' CT';
  } catch {
    return iso;
  }
}

export function formatRelative(iso: string): string {
  try {
    const date = parseISO(iso);
    if (!isValid(date)) return iso;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return iso;
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
