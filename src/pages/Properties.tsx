import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import MembershipBadge from '../components/MembershipBadge';

export default function Properties() {
  const navigate = useNavigate();
  const properties = useStore((s) => s.properties);
  const homeowners = useStore((s) => s.homeowners);
  const coordinators = useStore((s) => s.coordinators);
  const requests = useStore((s) => s.requests);

  function getHomeowner(id: string) {
    return homeowners.find((h) => h.id === id);
  }
  function getCoordinator(id: string) {
    return coordinators.find((c) => c.id === id);
  }
  function getActiveRequestCount(propertyId: string) {
    return requests.filter(
      (r) => r.propertyId === propertyId && r.status !== 'completed' && r.status !== 'canceled'
    ).length;
  }

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-semibold text-slate-100 mb-6">Properties</h1>
      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800">
              {['Address', 'Homeowner', 'Membership', 'Coordinator', 'Active Requests'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {properties.map((p) => {
              const owner = getHomeowner(p.homeownerId);
              const coord = getCoordinator(p.assignedCoordinatorId);
              const activeCount = getActiveRequestCount(p.id);
              return (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/properties/${p.id}`)}
                  className="cursor-pointer hover:bg-slate-950 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-100">{p.address.street}</p>
                    <p className="text-slate-400 text-xs">{p.address.city}, {p.address.state} {p.address.zip}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-200">{owner?.name ?? '—'}</td>
                  <td className="px-4 py-3"><MembershipBadge tier={p.membership} /></td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{coord?.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    {activeCount > 0 ? (
                      <span className="bg-amber-950 text-amber-300 border border-amber-800 text-xs px-2 py-0.5 rounded-full font-medium">{activeCount}</span>
                    ) : (
                      <span className="text-stone-300 text-xs">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
