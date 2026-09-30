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
        <h1 className="text-2xl font-semibold text-stone-900">Requests</h1>
        <button
          onClick={() => navigate('/receptionist')}
          className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-900 transition-colors"
        >
          <Plus size={16} />
          New Request
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search reference, description, address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-lg bg-white text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as RequestStatus | '')}
          className="text-sm border border-stone-200 rounded-lg bg-white text-stone-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-300"
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          value={urgencyFilter}
          onChange={(e) => setUrgencyFilter(e.target.value as UrgencyLevel | '')}
          className="text-sm border border-stone-200 rounded-lg bg-white text-stone-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-300"
        >
          <option value="">All urgency</option>
          {Object.entries(URGENCY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                {['Reference', 'Property', 'Homeowner', 'Category', 'Urgency', 'Status', 'Created', 'Response Due', 'Assigned'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
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
                    className={`cursor-pointer hover:bg-stone-50 transition-colors relative ${overdue && !danger ? 'bg-red-50 hover:bg-red-100' : ''}`}
                    style={danger ? { borderLeft: '3px solid #dc2626' } : undefined}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-stone-600 font-medium whitespace-nowrap">{r.referenceNumber}</td>
                    <td className="px-4 py-3 text-stone-700 max-w-[160px]">
                      <span className="truncate block">{prop ? prop.address.street : <span className="text-stone-400 italic">Unmatched</span>}</span>
                    </td>
                    <td className="px-4 py-3 text-stone-600 whitespace-nowrap">
                      {owner ? owner.name : r.callerCallbackName ? <span className="text-stone-400">{r.callerCallbackName} (unverified)</span> : <span className="text-stone-400 italic">Unknown</span>}
                    </td>
                    <td className="px-4 py-3 text-stone-600 whitespace-nowrap">{CATEGORY_LABELS[r.category]}</td>
                    <td className="px-4 py-3"><UrgencyBadge urgency={r.urgency} /></td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-stone-500 text-xs whitespace-nowrap">{formatDateTime(r.createdAt)}</td>
                    <td className={`px-4 py-3 text-xs whitespace-nowrap ${overdue ? 'text-red-600 font-medium' : 'text-stone-500'}`}>
                      {r.humanRespondedAt ? (
                        <span className="text-green-600">Responded</span>
                      ) : (
                        formatDateTime(r.humanResponseDue)
                      )}
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs whitespace-nowrap">
                      {coord ? coord.name : <span className="text-stone-300">Unassigned</span>}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-stone-400 text-sm">No requests match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-stone-100 bg-stone-50 text-xs text-stone-400">
          {filtered.length} of {requests.length} requests
        </div>
      </div>
    </div>
  );
}
