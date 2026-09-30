import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { isOverdue } from '../lib/urgency';
import { formatDateTime, formatDate } from '../lib/format';
import { CATEGORY_LABELS } from '../types';
import StatusBadge from '../components/StatusBadge';
import UrgencyBadge from '../components/UrgencyBadge';
import { AlertTriangle } from 'lucide-react';
import { inCurrentMonth, upcomingServices } from '../lib/crm';
import { startOfWeek, endOfWeek } from 'date-fns';

export default function Overview() {
  const navigate = useNavigate();
  const requests = useStore((s) => s.requests);
  const properties = useStore((s) => s.properties);

  const homeowners = useStore((s) => s.homeowners);
  const now = new Date();
  const upcoming = upcomingServices(requests, now).slice(0, 4);
  const servicesThisMonth = requests.filter((r) => r.status !== 'canceled' && (r.status === 'completed' ? inCurrentMonth(r.completedAt, now) : inCurrentMonth(r.appointmentConfirmation?.scheduledStart, now)));
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);

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
    return inCurrentMonth(r.completedAt, now);
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
    { label: 'Total Clients', value: homeowners.length, color: 'text-indigo-300' },
    { label: 'Services This Month', value: servicesThisMonth.length, color: 'text-slate-100' },
    { label: 'Active Requests', value: activeRequests.length, color: 'text-slate-100' },
    { label: 'Overdue', value: overdueRequests.length, color: overdueRequests.length > 0 ? 'text-red-300' : 'text-slate-100' },
    { label: 'Scheduled This Week', value: scheduledThisWeek.length, color: 'text-slate-100' },
    { label: 'Completed This Month', value: completedThisMonth.length, color: 'text-green-300' },
  ];

  return (
    <div className="crm-page">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Your client relationships and service operations · {formatDate(now.toISOString())}</p>
        </div>
      </div>

      {dangerRequests.length > 0 && (
        <div className="mb-6 bg-red-950 border border-red-800 rounded-xl p-4 flex gap-3 items-start">
          <AlertTriangle size={18} className="text-red-300 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-300">
              {dangerRequests.length} Immediate Danger{dangerRequests.length > 1 ? ' reports' : ' report'} require attention
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {dangerRequests.map((r) => (
                <button
                  key={r.id}
                  onClick={() => navigate(`/requests/${r.id}`)}
                  className="text-xs text-red-300 underline hover:text-red-300"
                >
                  {r.referenceNumber}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">{s.label}</p>
            <p className={`text-3xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <p className="crm-muted mb-8">Monthly services count completed services by completion date and other confirmed services by appointment date, in Central Time. Canceled services are excluded.</p>
      <div className="crm-grid mb-8">
        <section className="crm-panel"><div className="flex justify-between items-center"><h2>Client directory</h2><Link className="crm-link text-sm" to="/clients">View all clients →</Link></div>
          {homeowners.slice(0, 4).map((h) => <div className="crm-row flex items-center gap-3" key={h.id}><span className="w-10 h-10 rounded-full bg-indigo-950 text-indigo-300 flex items-center justify-center text-sm font-semibold">{h.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}</span><div><Link className="crm-link font-medium" to={`/clients/${h.id}`}>{h.name}</Link><p className="crm-muted">{properties.filter((p) => p.homeownerId === h.id).length} properties · {h.preferredChannel} preferred</p></div></div>)}
          {!homeowners.length && <p className="crm-muted">No clients yet.</p>}
        </section>
        <section className="crm-panel"><h2>Upcoming services</h2>{upcoming.map((r) => <div className="crm-row" key={r.id}><div className="flex justify-between gap-3"><Link className="crm-link" to={`/requests/${r.id}`}>{CATEGORY_LABELS[r.category]}</Link><StatusBadge status={r.status}/></div><p className="text-sm mt-2">{homeowners.find((h) => h.id === r.homeownerId)?.name || 'Unknown client'}</p><p className="crm-muted">{formatDateTime(r.appointmentConfirmation!.scheduledStart)}</p></div>)}{!upcoming.length && <p className="crm-muted">No upcoming confirmed services.</p>}</section>
      </div>
      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-slate-200">Recent Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Reference</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Property</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Urgency</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Response Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recent.map((r) => {
                const overdue = isOverdue(r);
                return (
                  <tr
                    key={r.id}
                    onClick={() => navigate(`/requests/${r.id}`)}
                    className={`cursor-pointer hover:bg-slate-950 transition-colors ${overdue ? 'bg-red-950 hover:bg-red-950' : ''}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-slate-300 font-medium">{r.referenceNumber}</td>
                    <td className="px-4 py-3 text-slate-200 max-w-[180px] truncate">{getPropertyAddress(r.propertyId)}</td>
                    <td className="px-4 py-3 text-slate-300">{CATEGORY_LABELS[r.category]}</td>
                    <td className="px-4 py-3"><UrgencyBadge urgency={r.urgency} /></td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{formatDateTime(r.createdAt)}</td>
                    <td className={`px-4 py-3 text-xs whitespace-nowrap ${overdue ? 'text-red-300 font-medium' : 'text-slate-400'}`}>
                      {r.humanRespondedAt ? (
                        <span className="text-green-300">Responded</span>
                      ) : (
                        formatDateTime(r.humanResponseDue)
                      )}
                    </td>
                  </tr>
                );
              })}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-sm">No requests yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
