import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { useStore } from '../store';
import { isOverdue } from '../lib/urgency';
import { formatDateTime } from '../lib/format';
import { CATEGORY_LABELS, STATUS_LABELS, URGENCY_LABELS } from '../types';
import type { RequestStatus, UrgencyLevel } from '../types';
import StatusBadge from '../components/StatusBadge';
import UrgencyBadge from '../components/UrgencyBadge';

export default function Requests() {
  const navigate = useNavigate();
  const requests = useStore((s) => s.requests);
  const properties = useStore((s) => s.properties);
  const homeowners = useStore((s) => s.homeowners);
  const coordinators = useStore((s) => s.coordinators);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | ''>('');
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | ''>('');

  function getProperty(id: string) {
    return properties.find((p) => p.id === id);
  }
  function getHomeowner(id: string) {
    return homeowners.find((h) => h.id === id);
  }
  function getCoordinator(id?: string) {
    if (!id) return null;
    return coordinators.find((c) => c.id === id);
  }

  const filtered = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter((r) => {
      if (statusFilter && r.status !== statusFilter) return false;
      if (urgencyFilter && r.urgency !== urgencyFilter) return false;
      if (search) {
        const lc = search.toLowerCase();
        const prop = getProperty(r.propertyId);
        const addr = prop ? `${prop.address.street} ${prop.address.city}`.toLowerCase() : '';
        if (
          !r.referenceNumber.toLowerCase().includes(lc) &&
          !r.issueDescription.toLowerCase().includes(lc) &&
          !addr.includes(lc)
        ) {
          return false;
        }
      }
      return true;
    });

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-ink">Requests</h1>
        <button
          onClick={() => navigate('/requests/new')}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-canvas text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors"
        >
          <Plus size={16} />
          New Request
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search reference, description, address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-line rounded-lg bg-surface text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-stone-300"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as RequestStatus | '')}
          className="text-sm border border-line rounded-lg bg-surface text-ink px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-300"
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          value={urgencyFilter}
          onChange={(e) => setUrgencyFilter(e.target.value as UrgencyLevel | '')}
          className="text-sm border border-line rounded-lg bg-surface text-ink px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-300"
        >
          <option value="">All urgency</option>
          {Object.entries(URGENCY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="bg-surface border border-line rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-canvas border-b border-line">
                {['Reference', 'Property', 'Homeowner', 'Category', 'Urgency', 'Status', 'Created', 'Response Due', 'Assigned'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((r) => {
                const overdue = isOverdue(r);
                const danger = r.urgency === 'immediate_danger';
                const prop = getProperty(r.propertyId);
                const owner = getHomeowner(r.homeownerId);
                const coord = getCoordinator(r.assignedCoordinatorId);

                return (
                  <tr
                    key={r.id}
                    onClick={() => navigate(`/requests/${r.id}`)}
                    className={`cursor-pointer hover:bg-canvas transition-colors relative ${overdue && !danger ? 'bg-red-950 hover:bg-red-950' : ''}`}
                    style={danger ? { borderLeft: '3px solid #dc2626' } : undefined}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted font-medium whitespace-nowrap">{r.referenceNumber}</td>
                    <td className="px-4 py-3 text-ink max-w-[160px]">
                      <span className="truncate block">{prop ? prop.address.street : <span className="text-muted italic">Unmatched</span>}</span>
                    </td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {owner ? owner.name : r.callerCallbackName ? <span className="text-muted">{r.callerCallbackName} (unverified)</span> : <span className="text-muted italic">Unknown</span>}
                    </td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap">{CATEGORY_LABELS[r.category]}</td>
                    <td className="px-4 py-3"><UrgencyBadge urgency={r.urgency} /></td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">{formatDateTime(r.createdAt)}</td>
                    <td className={`px-4 py-3 text-xs whitespace-nowrap ${overdue ? 'text-red-300 font-medium' : 'text-muted'}`}>
                      {r.humanRespondedAt ? (
                        <span className="text-green-300">Responded</span>
                      ) : (
                        formatDateTime(r.humanResponseDue)
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">
                      {coord ? coord.name : <span className="text-stone-300">Unassigned</span>}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted text-sm">No requests match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-line bg-canvas text-xs text-muted">
          {filtered.length} of {requests.length} requests
        </div>
      </div>
    </div>
  );
}
