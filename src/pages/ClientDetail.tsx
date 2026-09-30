import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { useStore } from '../store';
import { clientContext, membershipLength } from '../lib/crm';
import { formatDate, formatDateTime } from '../lib/format';
import { CATEGORY_LABELS } from '../types';
import StatusBadge from '../components/StatusBadge';
import MembershipBadge from '../components/MembershipBadge';
import CommunicationLog from '../components/CommunicationLog';

export default function ClientDetail() {
  const { id } = useParams();
  const state = useStore();
  const h = state.homeowners.find(h => h.id === id);
  if (!h) return <div className="p-8"><h1 className="text-xl mb-4">Client not found</h1><Link to="/clients" className="text-accent">Back to clients</Link></div>;
  const c = clientContext(state, h.id);
  return <div className="p-8 max-w-7xl mx-auto">
    <Link to="/clients" className="inline-flex items-center gap-2 text-sm text-muted mb-6"><ArrowLeft size={16} />All clients</Link>
    <div className="mb-8"><p className="text-xs text-accent uppercase tracking-[0.2em] mb-2">Client profile</p><h1 className="text-3xl font-semibold">{h.name}</h1><div className="flex flex-wrap gap-5 mt-4 text-sm text-muted"><a href={`mailto:${h.email}`} className="flex items-center gap-2"><Mail size={15} />{h.email}</a><a href={`tel:${h.phone.replace(/[^+\d]/g, '')}`} className="flex items-center gap-2"><Phone size={15} />{h.phone}</a><span>Preferred: {h.preferredChannel}</span></div></div>
    <div className="grid sm:grid-cols-3 gap-4 mb-7">{[
      ['With Moda', membershipLength(h.memberSince), `Member since ${formatDate(h.memberSince)}`],
      ['Last contact', c.lastContact ? formatDateTime(c.lastContact.occurredAt) : 'No contact recorded', c.lastContact ? `${c.lastContact.channel === 'text' ? 'SMS' : c.lastContact.channel} · ${c.lastContact.direction}` : 'Client communications will appear here'],
      ['Next confirmed service', c.next ? formatDateTime(c.next.appointmentConfirmation!.scheduledStart) : 'Not scheduled', c.next ? CATEGORY_LABELS[c.next.category] : 'Only confirmed upcoming appointments appear'],
    ].map(([label, value, sub]) => <div key={label} className="p-5 rounded-xl bg-surface border border-line"><p className="text-xs uppercase tracking-wider text-muted">{label}</p><p className="mt-3 text-lg font-semibold">{value}</p><p className="text-xs text-muted mt-2">{sub}</p></div>)}</div>
    <div className="grid lg:grid-cols-2 gap-6 mb-6"><section className="bg-surface border border-line rounded-xl p-5"><h2 className="font-semibold mb-4">Properties</h2>{c.properties.map(p => <Link to={`/properties/${p.id}`} key={p.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-4 text-sm hover:text-accent"><span>{p.address.street}<span className="block text-xs text-muted mt-1">{p.address.city}, {p.address.state} {p.address.zip}</span></span><MembershipBadge tier={p.membership} /></Link>)}{!c.properties.length && <p className="text-sm text-muted">No properties linked.</p>}{h.notes && <p className="text-sm text-muted border-t border-line pt-4 mt-2">{h.notes}</p>}</section>
    <section className="bg-surface border border-line rounded-xl p-5"><h2 className="font-semibold mb-1">Service providers</h2><p className="text-xs text-muted mb-4">Preferred providers and vendors assigned to this client’s requests.</p>{c.providers.map(v => <div key={v.id} className="border-t border-line py-4"><Link to="/vendors" className="font-medium text-sm hover:text-accent">{v.company}</Link><p className="text-xs text-muted mt-1">{v.contactName} · {v.contactPhone}</p><p className="text-xs text-accent mt-2">{c.properties.some(p => p.preferredVendorIds.includes(v.id)) ? 'Preferred provider' : 'Assigned on a service request'} · {v.status}</p></div>)}{!c.providers.length && <p className="text-sm text-muted">No providers assigned.</p>}</section></div>
    <section className="bg-surface border border-line rounded-xl mb-6"><h2 className="p-5 font-semibold border-b border-line">Service history <span className="text-muted font-normal">({c.requests.length})</span></h2><div className="divide-y divide-line">{[...c.requests].sort((a,b) => b.createdAt.localeCompare(a.createdAt)).map(r => <Link key={r.id} to={`/requests/${r.id}`} className="p-5 flex flex-wrap items-center justify-between gap-3 hover:bg-raised"><div><p className="text-sm font-medium">{CATEGORY_LABELS[r.category]} · {r.referenceNumber}</p><p className="text-xs text-muted mt-1">{formatDateTime(r.createdAt)}</p></div><StatusBadge status={r.status} /></Link>)}{!c.requests.length && <p className="p-5 text-muted text-sm">No services recorded.</p>}</div></section>
    <section className="bg-surface border border-line rounded-xl"><h2 className="p-5 font-semibold border-b border-line">Contact history</h2><CommunicationLog entries={c.communications} /></section>
  </div>;
}
