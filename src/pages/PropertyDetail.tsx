import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../store';
import { formatDate, formatCurrency, formatMinutes } from '../lib/format';
import { CATEGORY_LABELS } from '../types';
import MembershipBadge from '../components/MembershipBadge';
import StatusBadge from '../components/StatusBadge';
import clsx from 'clsx';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const property = useStore((s) => s.properties.find((p) => p.id === id));
  const homeowner = useStore((s) => s.homeowners.find((h) => h.id === property?.homeownerId));
  const coordinator = useStore((s) => s.coordinators.find((c) => c.id === property?.assignedCoordinatorId));
  const preferredVendors = useStore((s) => s.vendors.filter((v) => property?.preferredVendorIds.includes(v.id)));
  const propertyRequests = useStore((s) =>
    s.requests.filter((r) => r.propertyId === id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );
  const handymanEntries = useStore((s) => s.handymanEntries.filter((e) => e.propertyId === id));
  const conciergeEntries = useStore((s) => s.conciergeEntries.filter((e) => e.propertyId === id));
  const membershipConfigs = useStore((s) => s.membershipConfigs);
  const demoRole = useStore((s) => s.demoRole);

  if (!property) {
    return <div className="p-8 text-slate-400">Property not found.</div>;
  }

  const membershipConfig = membershipConfigs.find((c) => c.tier === property.membership);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const handymanThisMonth = handymanEntries
    .filter((e) => { const d = new Date(e.date); return d >= monthStart && d <= monthEnd; })
    .reduce((sum, e) => sum + e.durationMinutes, 0);
  const handymanAllowance = membershipConfig?.handymanMinutesPerMonth ?? 0;

  return (
    <div className="p-8 max-w-5xl">
      <button onClick={() => navigate('/properties')} className="flex items-center gap-1 text-slate-400 text-sm hover:text-slate-200 mb-6">
        <ArrowLeft size={14} /> Back to Properties
      </button>

      <div className="flex items-start gap-4 mb-8">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-100">{property.address.street}</h1>
          <p className="text-slate-400 text-sm">{property.address.city}, {property.address.state} {property.address.zip}</p>
        </div>
        <MembershipBadge tier={property.membership} className="mt-1" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">

          {/* Homeowner */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Homeowner</h3>
            {homeowner ? (
              <div>
                <p className="font-medium text-slate-100">{homeowner.name}</p>
                <p className="text-slate-400 text-sm mt-1">{homeowner.phone}</p>
                <p className="text-slate-400 text-sm">{homeowner.email}</p>
                <p className="text-xs text-slate-400 mt-1">Prefers: {homeowner.preferredChannel} · Member since {formatDate(homeowner.memberSince)}</p>
              </div>
            ) : <p className="text-slate-400 text-sm">No homeowner linked.</p>}
            {coordinator && (
              <div className="mt-3 pt-3 border-t border-slate-800">
                <p className="text-xs text-slate-400">Assigned coordinator: <span className="text-slate-300">{coordinator.name}</span></p>
              </div>
            )}
          </div>

          {/* Equipment */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-200">Equipment</h3>
            </div>
            {property.equipment.length > 0 ? (
              <ul className="divide-y divide-slate-800">
                {property.equipment.map((eq) => (
                  <li key={eq.id} className="px-5 py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-100">{eq.name}</p>
                        {(eq.brand || eq.model) && (
                          <p className="text-xs text-slate-400 mt-0.5">{[eq.brand, eq.model].filter(Boolean).join(' · ')}</p>
                        )}
                        {eq.installedYear && <p className="text-xs text-slate-400 mt-0.5">Installed: {eq.installedYear}</p>}
                        {eq.lastServicedAt && <p className="text-xs text-slate-400">Last serviced: {formatDate(eq.lastServicedAt)}</p>}
                        {eq.notes && <p className="text-xs text-slate-400 mt-1 italic">{eq.notes}</p>}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-4 text-slate-400 text-sm italic">No equipment recorded.</p>
            )}
          </div>

          {/* Service history */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-200">Service History</h3>
            </div>
            {propertyRequests.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800">
                    {['Reference', 'Category', 'Created', 'Status'].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {propertyRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-950 cursor-pointer" onClick={() => navigate(`/requests/${r.id}`)}>
                      <td className="px-4 py-3 font-mono text-xs text-slate-300">{r.referenceNumber}</td>
                      <td className="px-4 py-3 text-slate-300">{CATEGORY_LABELS[r.category]}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{formatDate(r.createdAt)}</td>
                      <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="px-5 py-4 text-slate-400 text-sm italic">No service requests yet.</p>
            )}
          </div>

          {/* Concierge entries */}
          {conciergeEntries.length > 0 && (
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-slate-200">Concierge Time Entries</h3>
              </div>
              <ul className="divide-y divide-slate-800">
                {conciergeEntries.map((e) => (
                  <li key={e.id} className="px-5 py-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-slate-200">{e.description}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{formatDate(e.date)} · Actual: {formatMinutes(e.actualMinutes)} → Billable: {formatMinutes(e.billableMinutes)}</p>
                        {e.subcontractorCosts != null && (
                          <p className="text-xs text-slate-400">Subcontractor: {formatCurrency(e.subcontractorCosts)} (separate)</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-100">{formatCurrency(e.estimatedCharge)}</p>
                        <p className="text-xs text-slate-400">est. @ ${e.ratePerHour}/hr</p>
                      </div>
                    </div>
                    {e.notes && <p className="text-xs text-slate-400 mt-1 italic">{e.notes}</p>}
                  </li>
                ))}
              </ul>
              <div className="px-5 py-2 bg-slate-950 text-xs text-slate-400 italic">
                Provisional estimates per draft policy. Concierge time and subcontractor costs are separate line items.
              </div>
            </div>
          )}

          {demoRole === 'coordinator' && property.internalNotes && (
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-2">Internal Notes</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{property.internalNotes}</p>
              <p className="text-xs text-amber-300 mt-2 italic">Not visible in homeowner view.</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Membership</h3>
            <MembershipBadge tier={property.membership} className="mb-2" />
            {membershipConfig && (
              <ul className="text-xs text-slate-400 space-y-1 mt-2">
                <li>${membershipConfig.monthlyRate}/month</li>
                <li>Inspection: {membershipConfig.inspectionFrequency}</li>
                <li>Handyman: {formatMinutes(membershipConfig.handymanMinutesPerMonth)}/month included</li>
                <li>Dedicated contact: {membershipConfig.dedicatedContact ? 'Yes' : 'No'}</li>
              </ul>
            )}
            <p className="text-xs text-slate-400 mt-2">Renewal: {formatDate(property.membershipRenewalDate)}</p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Handyman Allowance (This Month)</h3>
            <div className="mb-2">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{formatMinutes(handymanThisMonth)} used</span>
                <span>{formatMinutes(handymanAllowance)} included</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={clsx('h-full rounded-full transition-all', handymanThisMonth > handymanAllowance ? 'bg-red-400' : 'bg-green-500')}
                  style={{ width: `${Math.min(100, handymanAllowance > 0 ? (handymanThisMonth / handymanAllowance) * 100 : 0)}%` }}
                />
              </div>
            </div>
            {handymanEntries.length > 0 && (
              <ul className="space-y-1 mt-3">
                {handymanEntries.map((e) => (
                  <li key={e.id} className="text-xs text-slate-400">
                    {formatDate(e.date)} — {formatMinutes(e.durationMinutes)}
                    {!e.eligibilityReviewed && <span className="text-amber-500 ml-1">(eligibility pending)</span>}
                    {e.eligibilityReviewed && !e.eligibilityApproved && <span className="text-red-500 ml-1">(not eligible)</span>}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-slate-400 italic mt-2">Eligibility requires coordinator review. Overage policy not confirmed.</p>
          </div>

          {preferredVendors.length > 0 && (
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-3">Preferred Vendors</h3>
              <ul className="space-y-2">
                {preferredVendors.map((v) => (
                  <li key={v.id} className="text-sm">
                    <p className="font-medium text-slate-200">{v.company}</p>
                    <p className="text-xs text-slate-400">{v.trades.join(', ')}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
