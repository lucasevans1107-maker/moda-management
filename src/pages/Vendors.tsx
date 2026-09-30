import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../store';
import { TRADE_LABELS } from '../types';
import type { Trade, VendorStatus } from '../types';
import clsx from 'clsx';

function AvailabilityBadge({ status }: { status: string }) {
  const cls =
    status === 'available' ? 'bg-green-50 text-green-700 border border-green-200' :
    status === 'busy' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
    'bg-stone-100 text-stone-500';
  const label =
    status === 'available' ? 'Available' :
    status === 'busy' ? 'Busy' :
    'Not confirmed';
  return <span className={clsx('inline-flex px-2 py-0.5 rounded-full text-xs', cls)}>{label}</span>;
}

export default function Vendors() {
  const vendors = useStore((s) => s.vendors);
  const properties = useStore((s) => s.properties);

  const [tradeFilter, setTradeFilter] = useState<Trade | ''>('');
  const [statusFilter, setStatusFilter] = useState<VendorStatus | ''>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = vendors.filter((v) => {
    if (tradeFilter && !v.trades.includes(tradeFilter)) return false;
    if (statusFilter && v.status !== statusFilter) return false;
    return true;
  });

  const allTrades = Array.from(new Set(vendors.flatMap((v) => v.trades)));

  function getPriorProperties(ids: string[]) {
    return properties.filter((p) => ids.includes(p.id));
  }

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-semibold text-stone-900 mb-6">Vendor Directory</h1>

      <div className="flex gap-3 mb-6">
        <select
          value={tradeFilter}
          onChange={(e) => setTradeFilter(e.target.value as Trade | '')}
          className="text-sm border border-stone-200 rounded-lg bg-white text-stone-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-300"
        >
          <option value="">All trades</option>
          {allTrades.map((t) => (
            <option key={t} value={t}>{TRADE_LABELS[t]}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as VendorStatus | '')}
          className="text-sm border border-stone-200 rounded-lg bg-white text-stone-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-300"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              {['Company', 'Contact', 'Trades', 'Service Areas', 'Status', 'Availability'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">{h}</th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((v) => {
              const expanded = expandedId === v.id;
              const priorProps = getPriorProperties(v.priorPropertyIds);
              return (
                <>
                  <tr
                    key={v.id}
                    onClick={() => setExpandedId(expanded ? null : v.id)}
                    className={clsx('cursor-pointer transition-colors', v.status === 'inactive' ? 'opacity-60' : '', expanded ? 'bg-stone-50' : 'hover:bg-stone-50')}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-800">{v.company}</p>
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs">
                      <p>{v.contactName}</p>
                      <p>{v.contactPhone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {v.trades.slice(0, 2).map((t) => (
                          <span key={t} className="bg-stone-100 text-stone-600 text-xs px-2 py-0.5 rounded-full">{TRADE_LABELS[t]}</span>
                        ))}
                        {v.trades.length > 2 && <span className="text-stone-400 text-xs">+{v.trades.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs">{v.serviceAreas.slice(0, 3).join(', ')}{v.serviceAreas.length > 3 ? '…' : ''}</td>
                    <td className="px-4 py-3">
                      <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', v.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-500')}>
                        {v.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3"><AvailabilityBadge status={v.availabilityStatus} /></td>
                    <td className="px-4 py-3 text-stone-400">
                      {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </td>
                  </tr>
                  {expanded && (
                    <tr key={`${v.id}-detail`}>
                      <td colSpan={7} className="px-6 py-5 bg-stone-50 border-b border-stone-200">
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Contact</p>
                            <p className="text-sm text-stone-700">{v.contactName}</p>
                            <p className="text-sm text-stone-500">{v.contactPhone}</p>
                            <p className="text-sm text-stone-500">{v.contactEmail}</p>
                            {v.licenseNumber && <p className="text-xs text-stone-400 mt-1">License: {v.licenseNumber}</p>}
                            {v.insuranceVerified && <p className="text-xs text-green-600 mt-0.5">✓ Insurance verified</p>}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Trades</p>
                            <div className="flex flex-wrap gap-1">
                              {v.trades.map((t) => (
                                <span key={t} className="bg-stone-100 text-stone-600 text-xs px-2 py-0.5 rounded-full">{TRADE_LABELS[t]}</span>
                              ))}
                            </div>
                            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mt-3 mb-1">Service Areas</p>
                            <p className="text-xs text-stone-500">{v.serviceAreas.join(', ')}</p>
                          </div>
                          <div>
                            {priorProps.length > 0 && (
                              <>
                                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Prior Properties</p>
                                <ul className="space-y-1">
                                  {priorProps.map((p) => (
                                    <li key={p.id} className="text-xs text-stone-600">{p.address.street}, {p.address.city}</li>
                                  ))}
                                </ul>
                              </>
                            )}
                            {v.notes && (
                              <div className="mt-3">
                                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Notes</p>
                                <p className="text-xs text-stone-500 leading-relaxed">{v.notes}</p>
                              </div>
                            )}
                            {v.status === 'inactive' && (
                              <p className="text-xs text-red-500 font-medium mt-2">INACTIVE — Do not assign</p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-stone-400 text-sm">No vendors match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
