import { differenceInMonths, parseISO, isValid, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import type { Homeowner, ServiceRequest } from '../types';

export function clientRequests(id: string, requests: ServiceRequest[]) {
  return requests.filter((r) => r.homeownerId === id);
}
export function lastContact(client: Homeowner, requests: ServiceRequest[]) {
  // Internal status changes and vendor activity are not client contact.
  const dates = [client.lastContactAt, ...requests.flatMap((r) => [r.humanRespondedAt,
    ...r.activity.filter((a) => a.actorRole === 'homeowner').map((a) => a.timestamp)])];
  return dates.filter((d): d is string => !!d && isValid(parseISO(d)))
    .sort((a, b) => Date.parse(b) - Date.parse(a))[0];
}
export function upcomingServices(requests: ServiceRequest[], now = new Date()) {
  return requests.filter((r) => r.status === 'scheduled' && r.appointmentConfirmation &&
    Date.parse(r.appointmentConfirmation.scheduledStart) >= now.getTime())
    .sort((a, b) => Date.parse(a.appointmentConfirmation!.scheduledStart) - Date.parse(b.appointmentConfirmation!.scheduledStart));
}
export function tenure(since: string, now = new Date()) {
  const date = parseISO(since);
  if (!isValid(date)) return 'Unknown';
  if (date > now) return 'Not started';
  const months = differenceInMonths(now, date);
  if (months === 0) return 'Less than a month';
  const years = Math.floor(months / 12), rest = months % 12;
  return [years ? `${years} year${years === 1 ? '' : 's'}` : '', rest ? `${rest} month${rest === 1 ? '' : 's'}` : ''].filter(Boolean).join(', ');
}
export function inCurrentMonth(iso: string | undefined, now = new Date()) {
  if (!iso || !isValid(parseISO(iso))) return false;
  return format(toZonedTime(parseISO(iso), 'America/Chicago'), 'yyyy-MM') === format(toZonedTime(now, 'America/Chicago'), 'yyyy-MM');
}
