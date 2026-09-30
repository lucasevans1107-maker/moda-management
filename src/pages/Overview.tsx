import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { isOverdue } from '../lib/urgency';
import { formatDateTime, formatDate } from '../lib/format';
import { CATEGORY_LABELS } from '../types';
import StatusBadge from '../components/StatusBadge';
import UrgencyBadge from '../components/UrgencyBadge';
import { AlertTriangle } from 'lucide-react';
import { startOfWeek, endOfWeek } from 'date-fns';
import { inCurrentMonth } from '../lib/crm';

export default function Overview() {
  const navigate = useNavigate();
  const requests = useStore((s) => s.requests);
  const properties = useStore((s) => s.properties);

  const homeowners = useStore((s) => s.homeowners);
  const communications = useStore((s) => s.communications);
  const now = new Date();
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

  const servicesThisMonth = requests.filter(r => {
    if (r.status === 'canceled') return false;
    const date = r.status === 'completed' ? r.completedAt : r.appointmentConfirmation?.scheduledStart;
    return date ? inCurrentMonth(date, now) : false;
  });
  const upcoming = requests.filter(r => (r.status === 'scheduled' || r.status === 'in_progress') && r.appointmentConfirmation && new Date(r.appointmentConfirmation.scheduledStart) >= now)
    .sort((a,b) => a.appointmentConfirmation!.scheduledStart.localeCompare(b.appointmentConfirmation!.scheduledStart)).slice(0, 5);
  const stats = [
    { label: 'Total Clients', value: homeowners.length, color: 'text-ink' },
    { label: 'Managed Properties', value: properties.length, color: 'text-ink' },
    { label: 'Services This Month', value: servicesThisMonth.length, color: 'text-accent' },
    { label: 'Contacts This Month', value: communications.filter(c => inCurrentMonth(c.occurredAt, now)).length, color: 'text-ink' },
    { label: 'Active Requests', value: activeRequests.length, color: 'text-ink' },
    { label: 'Overdue', value: overdueRequests.length, color: overdueRequests.length > 0 ? 'text-red-300' : 'text-ink' },
    { label: 'Scheduled This Week', value: scheduledThisWeek.length, color: 'text-ink' },
    { label: 'Completed This Month', value: completedThisMonth.length, color: 'text-green-300' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-3">Moda Management</p>
          <h1 className="text-2xl font-semibold text-ink">Client dashboard</h1>
          <p className="text-muted text-sm mt-1">{formatDate(now.toISOString())}</p>
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

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface border border-line rounded-xl p-5">
            <p className="text-xs text-muted font-medium uppercase tracking-wider mb-2">{s.label}</p>
            <p className={`text-3xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted mb-7">Demo data · Monthly services include confirmed appointments and completed services, counted once per request. Month boundaries use Central Time.</p>
      <div className="grid lg:grid-cols-2 gap-6 mb-7">
        <section className="bg-surface border border-line rounded-xl overflow-hidden">
          <div className="flex justify-between p-5 border-b border-line"><h2 className="text-sm font-semibold">Client relationships</h2><Link to="/clients" className="text-xs text-accent hover:underline">View all clients →</Link></div>
          {homeowners.slice(0, 5).map(h => <Link key={h.id} to={`/clients/${h.id}`} className="flex items-center gap-3 p-5 border-b last:border-b-0 border-line hover:bg-raised"><span className="w-9 h-9 rounded-full bg-raised text-accent flex items-center justify-center text-xs">{h.name.split(' ').map(n => n[0]).join('')}</span><div className="flex-1"><p className="text-sm font-medium">{h.name}</p><p className="text-xs text-muted mt-1">{h.email}</p></div><span className="text-xs text-muted">View profile →</span></Link>)}
          {!homeowners.length && <p className="p-5 text-sm text-muted">No clients yet.</p>}
        </section>
        <section className="bg-surface border border-line rounded-xl overflow-hidden"><div className="p-5 border-b border-line"><h2 className="text-sm font-semibold">Upcoming services</h2></div>
          {upcoming.map(r => <Link key={r.id} to={`/requests/${r.id}`} className="block p-5 border-b last:border-b-0 border-line hover:bg-raised"><div className="flex justify-between gap-2"><p className="text-sm font-medium">{CATEGORY_LABELS[r.category]}</p><StatusBadge status={r.status} /></div><p className="text-xs text-muted mt-2">{homeowners.find(h => h.id === r.homeownerId)?.name ?? 'Unknown client'} · {formatDateTime(r.appointmentConfirmation!.scheduledStart)}</p></Link>)}
          {!upcoming.length && <p className="p-5 text-sm text-muted">No upcoming confirmed services.</p>}
        </section>
      </div>
      <div className="bg-surface border border-line rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-line">
          <h2 className="text-sm font-semibold text-ink">Recent Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-canvas border-b border-line">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Reference</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Property</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Urgency</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Created</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Response Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {recent.map((r) => {
                const overdue = isOverdue(r);
                return (
                  <tr
                    key={r.id}
                    onClick={() => navigate(`/requests/${r.id}`)}
                    className={`cursor-pointer hover:bg-canvas transition-colors ${overdue ? 'bg-red-950 hover:bg-red-950' : ''}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted font-medium">{r.referenceNumber}</td>
                    <td className="px-4 py-3 text-ink max-w-[180px] truncate">{getPropertyAddress(r.propertyId)}</td>
                    <td className="px-4 py-3 text-muted">{CATEGORY_LABELS[r.category]}</td>
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
                  </tr>
                );
              })}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted text-sm">No requests yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
