import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpRight, Users } from 'lucide-react';
import { useStore } from '../store';
import { clientContext, membershipLength } from '../lib/crm';
import { formatDateTime } from '../lib/format';

export default function Clients() {
  const state = useStore();
  const [query, setQuery] = useState('');
  const clients = state.homeowners.filter(h => `${h.name} ${h.email} ${h.phone}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="p-8 max-w-7xl mx-auto">
    <p className="text-xs uppercase tracking-[0.2em] text-accent mb-3">Relationships</p>
    <div className="flex justify-between items-center mb-7"><div><h1 className="text-2xl font-semibold">Clients</h1><p className="text-sm text-muted mt-2">Every client, their providers, and what comes next.</p></div><span className="flex gap-2 items-center text-accent bg-surface border border-line p-3 rounded-xl"><Users size={18} />{state.homeowners.length}</span></div>
    <label className="flex items-center gap-3 bg-surface border border-line rounded-xl p-3 mb-5 max-w-lg"><Search size={17} className="text-muted" /><input aria-label="Search clients" className="bg-transparent w-full text-sm outline-none" placeholder="Search name, email, or phone…" value={query} onChange={e => setQuery(e.target.value)} /></label>
    <div className="bg-surface border border-line rounded-xl overflow-x-auto"><table className="w-full text-sm text-left"><thead className="text-xs uppercase tracking-wider text-muted bg-canvas"><tr>{['Client', 'Last contact', 'Providers', 'Next service', 'With Moda'].map(h => <th className="px-5 py-4 whitespace-nowrap" key={h}>{h}</th>)}</tr></thead><tbody className="divide-y divide-line">{clients.map(h => {
      const c = clientContext(state, h.id);
      return <tr key={h.id} className="hover:bg-raised transition-colors"><td className="px-5 py-5 min-w-52"><Link to={`/clients/${h.id}`} className="font-semibold text-ink flex items-center gap-2 hover:text-accent">{h.name}<ArrowUpRight size={14} /></Link><p className="text-xs text-muted mt-1">{h.email}</p><p className="text-xs text-muted mt-1">{c.properties.length} {c.properties.length === 1 ? 'property' : 'properties'}</p></td><td className="px-5 py-5 text-xs text-muted min-w-44">{c.lastContact ? formatDateTime(c.lastContact.occurredAt) : 'No contact recorded'}</td><td className="px-5 py-5 min-w-44 text-muted">{c.providers.map(v => v.company).join(', ') || 'No providers assigned'}</td><td className="px-5 py-5 text-xs text-muted min-w-44">{c.next ? <Link className="text-accent hover:underline" to={`/requests/${c.next.id}`}>{formatDateTime(c.next.appointmentConfirmation!.scheduledStart)}</Link> : 'Not scheduled'}</td><td className="px-5 py-5 whitespace-nowrap text-muted">{membershipLength(h.memberSince)}</td></tr>;
    })}</tbody></table>{!clients.length && <p className="p-10 text-center text-muted">{query ? 'No clients match your search.' : 'No clients yet.'}</p>}</div>
  </div>;
}
