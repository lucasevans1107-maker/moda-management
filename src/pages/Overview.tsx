import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { isOverdue } from '../lib/urgency';
import { formatDateTime, formatDate } from '../lib/format';
import { CATEGORY_LABELS } from '../types';
import StatusBadge from '../components/StatusBadge';
import UrgencyBadge from '../components/UrgencyBadge';
import { AlertTriangle } from 'lucide-react';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export default function Overview() {
  const navigate = useNavigate();
  const requests = useStore((s) => s.requests);
  const properties = useStore((s) => s.properties);

  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const activeRequests = requests.filter(
    (r) => r.status !== 'completed' && r.status !== 'canceled'
  );
  const overdueRequests = activeRequests.filter(isOverdue);
  const scheduledThisWeek = requests.filter((r) => {
    if (r.status !== 'scheduled' && r.status !== 'in_progress') return false;
    if (!r.appointmentConfirmation) return false;
    const d = new Date(r.appointmentConfirmation.scheduledStart);
    return d >= weekStart && d <= weekEnd;
  });
  const completedThisMonth = requests.filter((r) => {
    if (r.status !== 'completed' || !r.completedAt) return false;
    const d = new Date(r.completedAt);
    return d >= monthStart && d <= monthEnd;
  });

  const dangerRequests = activeRequests.filter((r) => r.urgency === 'immediate_danger');

  const recent = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  function getPropertyAddress(propertyId: string) {
    const p = properties.find((pr) => pr.id === propertyId);
    return p ? `${p.address.street}, ${p.address.city}` : 'Unknown';
  }

  const stats = [
    { label: 'Active Requests', value: activeRequests.length, color: 'text-stone-800' },
    { label: 'Overdue', value: overdueRequests.length, color: overdueRequests.length > 0 ? 'text-red-600' : 'text-stone-800' },
    { label: 'Scheduled This Week', value: scheduledThisWeek.length, color: 'text-stone-800' },
    { label: 'Completed This Month', value: completedThisMonth.length, color: 'text-green-700' },
  ];

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Overview</h1>
          <p className="text-stone-500 text-sm mt-1">{formatDate(now.toISOString())}</p>
        </div>
      </div>

      {dangerRequests.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 items-start">
          <AlertTriangle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              {dangerRequests.length} Immediate Danger{dangerRequests.length > 1 ? ' reports' : ' report'} require attention
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {dangerRequests.map((r) => (
                <button
                  key={r.id}
                  onClick={() => navigate(`/requests/${r.id}`)}
                  className="text-xs text-red-700 underline hover:text-red-900"
                >
                  {r.referenceNumber}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-xs text-stone-400 font-medium uppercase tracking-wider mb-2">{s.label}</p>
            <p className={`text-3xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <h2 className="text-sm font-semibold text-stone-700">Recent Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">Reference</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">Property</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">Urgency</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">Created</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">Response Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recent.map((r) => {
                const overdue = isOverdue(r);
                return (
                  <tr
                    key={r.id}
                    onClick={() => navigate(`/requests/${r.id}`)}
                    className={`cursor-pointer hover:bg-stone-50 transition-colors ${overdue ? 'bg-red-50 hover:bg-red-100' : ''}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-stone-600 font-medium">{r.referenceNumber}</td>
                    <td className="px-4 py-3 text-stone-700 max-w-[180px] truncate">{getPropertyAddress(r.propertyId)}</td>
                    <td className="px-4 py-3 text-stone-600">{CATEGORY_LABELS[r.category]}</td>
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
                  </tr>
                );
              })}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-stone-400 text-sm">No requests yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
