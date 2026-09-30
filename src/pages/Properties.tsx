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
      <h1 className="text-2xl font-semibold text-stone-900 mb-6">Properties</h1>
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              {['Address', 'Homeowner', 'Membership', 'Coordinator', 'Active Requests'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {properties.map((p) => {
              const owner = getHomeowner(p.homeownerId);
              const coord = getCoordinator(p.assignedCoordinatorId);
              const activeCount = getActiveRequestCount(p.id);
              return (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/properties/${p.id}`)}
                  className="cursor-pointer hover:bg-stone-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-stone-800">{p.address.street}</p>
                    <p className="text-stone-400 text-xs">{p.address.city}, {p.address.state} {p.address.zip}</p>
                  </td>
                  <td className="px-4 py-3 text-stone-700">{owner?.name ?? '—'}</td>
                  <td className="px-4 py-3"><MembershipBadge tier={p.membership} /></td>
                  <td className="px-4 py-3 text-stone-500 text-xs">{coord?.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    {activeCount > 0 ? (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2 py-0.5 rounded-full font-medium">{activeCount}</span>
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
