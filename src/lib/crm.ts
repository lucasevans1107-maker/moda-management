import { differenceInMonths, parseISO, isValid } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import type { AppState, Communication, Homeowner, ServiceRequest } from '../types';

export function inCurrentMonth(iso: string, now = new Date()) {
  return isValid(parseISO(iso)) && formatInTimeZone(iso, 'America/Chicago', 'yyyy-MM') === formatInTimeZone(now, 'America/Chicago', 'yyyy-MM');
}

export function membershipLength(memberSince: string, now = new Date()) {
  const start = parseISO(memberSince);
  if (!isValid(start)) return 'Not recorded';
  if (start > now) return 'Not started';
  const months = differenceInMonths(now, start);
  if (months === 0) return 'Less than a month';
  const years = Math.floor(months / 12);
  return [years ? `${years} ${years === 1 ? 'year' : 'years'}` : '', months % 12 ? `${months % 12} ${months % 12 === 1 ? 'month' : 'months'}` : ''].filter(Boolean).join(', ');
}

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
