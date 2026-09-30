import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpRight } from 'lucide-react';
import { useStore } from '../store';
import { clientRequests, lastContact, upcomingServices, tenure } from '../lib/crm';
import { formatDateTime } from '../lib/format';

export default function Clients() {
  const { homeowners, properties, requests, communications } = useStore();
  const [query, setQuery] = useState('');
  const filtered = homeowners.filter((h) => [h.name, h.email, h.phone, ...properties.filter((p) => p.homeownerId === h.id).map((p) => p.address.street)].join(' ').toLowerCase().includes(query.toLowerCase()));
  return <div className="crm-page">
    <div className="crm-header"><div><p className="text-xs text-indigo-300 uppercase tracking-widest mb-2">Relationships</p><h1>Clients</h1><p className="crm-muted">{homeowners.length} clients · Every home, every relationship, in one place.</p></div></div>
    <div className="crm-panel">
      <label className="flex items-center gap-3 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 mb-6"><Search size={18} className="text-slate-400"/><input aria-label="Search clients" className="bg-transparent outline-none w-full" placeholder="Search name, email, phone or property…" value={query} onChange={(e) => setQuery(e.target.value)}/></label>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-slate-400"><tr>{['Client', 'Properties', 'Last contact', 'Next service', 'Time with Moda', ''].map((h) => <th key={h} className="p-3 font-medium whitespace-nowrap">{h}</th>)}</tr></thead><tbody>
        {filtered.map((h) => { const reqs = clientRequests(h.id, requests); const contact = lastContact(h, reqs, communications); const next = upcomingServices(reqs)[0]; return <tr key={h.id} className="border-t border-slate-800 hover:bg-slate-800/50">
          <td className="p-3"><Link className="crm-link font-semibold" to={`/clients/${h.id}`}>{h.name}</Link><p className="crm-muted mt-1">{h.email}</p></td>
          <td className="p-3">{properties.filter((p) => p.homeownerId === h.id).length}</td><td className="p-3 whitespace-nowrap">{contact ? formatDateTime(contact) : 'Not recorded'}</td>
          <td className="p-3 whitespace-nowrap">{next ? formatDateTime(next.appointmentConfirmation!.scheduledStart) : 'Not scheduled'}</td><td className="p-3 whitespace-nowrap">{tenure(h.memberSince)}</td><td className="p-3"><Link aria-label={`View ${h.name}`} className="crm-link" to={`/clients/${h.id}`}><ArrowUpRight size={18}/></Link></td>
        </tr>; })}
      </tbody></table>{filtered.length === 0 && <p className="text-center crm-muted py-12">{homeowners.length ? 'No clients match your search.' : 'No clients yet.'}</p>}</div>
    </div>
  </div>;
}
