import { Link, useParams } from 'react-router-dom';
import { useStore } from '../store';
import { clientRequests, lastContact, upcomingServices, tenure } from '../lib/crm';
import { formatDate, formatDateTime } from '../lib/format';
import { CATEGORY_LABELS, TRADE_LABELS } from '../types';
import StatusBadge from '../components/StatusBadge';

export default function ClientDetail() {
  const { id } = useParams();
  const { homeowners, properties, vendors, requests, recordClientContact, demoRole } = useStore();
  const client = homeowners.find((h) => h.id === id);
  if (!client) return <div className="crm-page"><h1>Client not found</h1><Link className="crm-link" to="/clients">Back to clients</Link></div>;
  const homes = properties.filter((p) => p.homeownerId === id);
  const reqs = clientRequests(client.id, requests);
  const contact = lastContact(client, reqs);
  const next = upcomingServices(reqs)[0];
  const preferred = new Set(homes.flatMap((p) => p.preferredVendorIds));
  const assigned = new Set(reqs.map((r) => r.vendorAssignment?.vendorId).filter(Boolean));
  const providers = vendors.filter((v) => preferred.has(v.id) || assigned.has(v.id));
  return <div className="crm-page">
    <Link className="crm-link text-sm" to="/clients">← All clients</Link>
    <div className="crm-header mt-6"><div><p className="text-xs text-indigo-300 uppercase tracking-widest mb-2">Client profile</p><h1>{client.name}</h1><p className="crm-muted">Member since {formatDate(client.memberSince)} · {tenure(client.memberSince)}</p></div>{demoRole === 'coordinator' && <button className="crm-button" onClick={() => recordClientContact(client.id)}>Record contact now</button>}</div>
    <div className="crm-stats">{[['Last contact', contact ? formatDateTime(contact) : 'Not recorded'], ['Next service', next ? formatDateTime(next.appointmentConfirmation!.scheduledStart) : 'Not scheduled'], ['Time with Moda', tenure(client.memberSince)], ['Total services', String(reqs.filter((r) => r.status === 'completed').length)]].map(([label, value]) => <div className="crm-panel" key={label}><p className="crm-muted mb-3">{label}</p><p className="font-semibold">{value}</p></div>)}</div>
    <div className="crm-grid">
      <section className="crm-panel"><h2>Contact & membership</h2><dl className="space-y-4 text-sm"><div><dt className="crm-muted">Email</dt><dd><a className="crm-link" href={`mailto:${client.email}`}>{client.email}</a></dd></div><div><dt className="crm-muted">Phone</dt><dd><a className="crm-link" href={`tel:${client.phone}`}>{client.phone}</a></dd></div><div><dt className="crm-muted">Preferred channel</dt><dd className="capitalize">{client.preferredChannel}</dd></div><div><dt className="crm-muted">Client notes</dt><dd>{client.notes || 'No notes recorded.'}</dd></div></dl></section>
      <section className="crm-panel"><h2>Service providers <span className="text-slate-400">({providers.length})</span></h2>{providers.map((v) => <div className="crm-row" key={v.id}><p className="font-medium">{v.company}</p><p className="crm-muted mt-1">{v.trades.map((t) => TRADE_LABELS[t]).join(' · ')}</p><p className="text-xs text-indigo-300 mt-2">{[preferred.has(v.id) && 'Preferred provider', assigned.has(v.id) && 'Assigned to service'].filter(Boolean).join(' · ')}</p><a className="crm-link text-sm" href={`tel:${v.contactPhone}`}>{v.contactPhone}</a></div>)}{!providers.length && <p className="crm-muted">No providers assigned yet.</p>}</section>
      <section className="crm-panel"><h2>Properties</h2>{homes.map((p) => <div className="crm-row" key={p.id}><Link className="crm-link" to={`/properties/${p.id}`}>{p.address.street}</Link><p className="crm-muted">{p.address.city}, {p.address.state} {p.address.zip}</p><p className="text-sm mt-2 capitalize">{p.membership} membership</p></div>)}{!homes.length && <p className="crm-muted">No properties linked.</p>}</section>
      <section className="crm-panel"><h2>Next confirmed service</h2>{next ? <><Link className="crm-link" to={`/requests/${next.id}`}>{CATEGORY_LABELS[next.category]} · {next.referenceNumber}</Link><p className="mt-3">{formatDateTime(next.appointmentConfirmation!.scheduledStart)}</p><p className="crm-muted mt-2">{next.issueDescription}</p></> : <p className="crm-muted">No upcoming confirmed appointment. Pending scheduling requests appear in the service history below.</p>}</section>
    </div>
    <section className="crm-panel mt-5"><h2>Service history</h2>{[...reqs].sort((a,b) => Date.parse(b.createdAt)-Date.parse(a.createdAt)).map((r) => <div className="crm-row flex justify-between gap-4" key={r.id}><div><Link className="crm-link" to={`/requests/${r.id}`}>{r.referenceNumber} · {CATEGORY_LABELS[r.category]}</Link><p className="crm-muted mt-1">{r.issueDescription}</p><p className="text-xs text-slate-400 mt-2">Opened {formatDateTime(r.createdAt)}</p></div><div className="shrink-0"><StatusBadge status={r.status}/></div></div>)}{!reqs.length && <p className="crm-muted">No service history yet.</p>}</section>
  </div>;
}
