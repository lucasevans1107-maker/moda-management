import { differenceInMonths, parseISO, isValid, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import type { AppState, Communication, Homeowner, ServiceRequest } from '../types';

export function clientRequests(id: string, requests: ServiceRequest[]) {
  return requests.filter((r) => r.homeownerId === id);
}
export function lastContact(client: Homeowner, requests: ServiceRequest[], communications: Communication[] = []) {
  // Internal status changes and vendor activity are not client contact.
  const dates = [client.lastContactAt, ...communications.filter(c => c.homeownerId === client.id).map(c => c.occurredAt), ...requests.flatMap((r) => [r.humanRespondedAt,
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

export const membershipLength = tenure;

export function nextService(requests: ServiceRequest[], now = new Date()) {
  return requests.filter(r => (r.status === 'scheduled' || r.status === 'in_progress') && r.appointmentConfirmation && new Date(r.appointmentConfirmation.scheduledStart) >= now)
    .sort((a, b) => a.appointmentConfirmation!.scheduledStart.localeCompare(b.appointmentConfirmation!.scheduledStart))[0];
}

export function clientContext(state: Pick<AppState, 'properties' | 'requests' | 'vendors' | 'communications'>, id: string) {
  const properties = state.properties.filter(p => p.homeownerId === id);
  const requests = state.requests.filter(r => r.homeownerId === id);
  const providerIds = new Set([...properties.flatMap(p => p.preferredVendorIds), ...requests.flatMap(r => r.vendorAssignment ? [r.vendorAssignment.vendorId] : [])]);
  const communications = state.communications.filter(c => c.homeownerId === id).sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  return { properties, requests, providers: state.vendors.filter(v => providerIds.has(v.id)), communications, lastContact: communications[0], next: nextService(requests) };
}

// Existing request intake is the only evidenced contact in the original demo.
// Do not turn internal request activity or unsent drafts into client contacts.
export function intakeCommunications(requests: ServiceRequest[], homeowners: Homeowner[]): Communication[] {
  return requests.flatMap(r => {
    if (r.channel !== 'phone' && r.channel !== 'text' && r.channel !== 'email') return [];
    const homeowner = homeowners.find(h => h.id === r.homeownerId);
    return [{ id: `intake-${r.id}`, requestId: r.id, homeownerId: homeowner?.id, channel: r.channel, direction: 'inbound' as const, occurredAt: r.createdAt, contactName: homeowner?.name ?? r.callerCallbackName ?? 'Unknown caller', contactAddress: (r.channel === 'email' ? homeowner?.email : homeowner?.phone) ?? r.callerCallbackPhone ?? 'Not recorded', summary: r.issueDescription, outcome: r.humanRespondedAt ? 'handled' as const : 'needs_follow_up' as const, source: 'demo' as const }];
  });
}
