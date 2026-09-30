import { useState } from 'react';
import { useStore } from '../store';
import { calculateConciergeCharge } from '../lib/billing';
import { formatCurrency } from '../lib/format';
import ConfirmDialog from '../components/ConfirmDialog';

type Tab = 'integration' | 'policies' | 'demo';

const CONTRACTS = [
  {
    name: 'lookup_homeowner',
    description: 'Find a homeowner by phone or email. Returns only that a match exists — verification is required separately.',
    request: {
      interactionId: 'string — unique session/call ID',
      phone: 'string? — caller-supplied phone',
      email: 'string? — caller-supplied email',
    },
    response: {
      found: 'boolean',
      homeownerId: 'string? — only if found',
      verificationRequired: 'true — always, even if found',
      error: 'string?',
    },
    notes: 'Never return property history or account details in this call. Caller-supplied identity is not verified.',
  },
  {
    name: 'get_property_context',
    description: 'Returns property and membership details for a verified homeowner.',
    request: {
      interactionId: 'string',
      homeownerId: 'string — from lookup_homeowner',
      verifiedBy: 'string — server-side session token (NOT caller-supplied "verified: true")',
      propertyId: 'string? — optional if homeowner has multiple properties',
    },
    response: {
      success: 'boolean',
      propertyId: 'string?',
      address: 'string?',
      membership: '"base" | "premium"',
      assignedCoordinator: 'string?',
      error: 'string?',
    },
    notes: 'CRITICAL: verifiedBy must be a server-validated session token. A caller-supplied "verified: true" value is not sufficient and must be rejected.',
  },
  {
    name: 'create_service_request',
    description: 'Creates a new service request. Idempotency key prevents duplicate requests from retry events.',
    request: {
      interactionId: 'string',
      propertyId: 'string',
      homeownerId: 'string',
      verifiedHomeownerId: 'string — server-validated, not caller-supplied',
      channel: '"phone" | "email" | "text" | "portal" | "receptionist"',
      issueDescription: 'string',
      category: 'ServiceCategory',
      urgency: '"routine" | "urgent" | "immediate_danger"',
      urgencyReason: 'string',
      idempotencyKey: 'string — UUID per interaction, deduplicate on this key',
    },
    response: {
      success: 'boolean',
      requestId: 'string?',
      referenceNumber: 'string?',
      status: 'RequestStatus?',
      humanResponseDue: 'ISO string? — 24h from creation',
      error: 'string?',
      duplicate: 'boolean? — true if idempotency key already used (return existing request info)',
    },
    notes: 'If idempotencyKey already exists, return existing request data with duplicate: true. Do not create a second record. Failed saves must return error — never return success without a persisted record.',
  },
  {
    name: 'get_request_status',
    description: 'Returns current status of a service request for a verified homeowner.',
    request: {
      interactionId: 'string',
      requestId: 'string',
      verifiedHomeownerId: 'string — server-validated',
    },
    response: {
      success: 'boolean',
      referenceNumber: 'string?',
      status: 'RequestStatus?',
      appointmentConfirmed: 'boolean?',
      scheduledStart: 'ISO string?',
      latestCustomerUpdate: 'string?',
      error: 'string?',
    },
    notes: 'Only return data for the verified homeowner\'s own requests. Verify the request belongs to the homeowner server-side.',
  },
  {
    name: 'request_human_followup',
    description: 'Flags a request for urgent human coordinator review.',
    request: {
      interactionId: 'string',
      requestId: 'string?',
      reason: 'string',
      urgencyLevel: '"routine" | "urgent" | "immediate_danger"',
      callerCallbackPhone: 'string?',
    },
    response: {
      success: 'boolean',
      queued: 'boolean',
      estimatedResponseNote: 'string — e.g., "within 24 hours"',
      error: 'string?',
    },
    notes: 'For immediate_danger: trigger on-call alert. Do not promise a specific response time beyond the 24-hour draft policy.',
  },
  {
    name: 'record_appointment_request',
    description: 'Records a requested appointment window — does not confirm the appointment.',
    request: {
      interactionId: 'string',
      requestId: 'string',
      verifiedHomeownerId: 'string',
      requestedWindowStart: 'ISO string',
      requestedWindowEnd: 'ISO string',
      notes: 'string?',
    },
    response: {
      success: 'boolean',
      status: '"scheduling_requested" — appointment NOT yet confirmed',
      note: 'string — "Vendor confirmation required before this becomes a confirmed appointment"',
      error: 'string?',
    },
    notes: 'A requested window must never be presented to the homeowner as a confirmed appointment. Confirmation requires explicit vendor response.',
  },
];

const POLICIES = [
  { item: 'Base membership', value: '$99/month', status: 'confirmed' as const },
  { item: 'Premium membership', value: '$499/month', status: 'confirmed' as const },
  { item: 'Base handyman allowance', value: '60 min/month', status: 'confirmed' as const },
  { item: 'Premium handyman allowance', value: '120 min/month', status: 'confirmed' as const },
  { item: 'Concierge rate', value: '$125/hour', status: 'confirmed' as const },
  { item: 'Concierge minimum', value: '60 minutes (1 hour)', status: 'confirmed' as const },
  { item: 'Concierge billing increment', value: '15 minutes after minimum', status: 'confirmed' as const },
  { item: '24-hour response expectation', value: 'Human response (not resolution)', status: 'confirmed' as const },
  { item: 'Handyman overage rate', value: 'Not established', status: 'needs_confirmation' as const },
  { item: 'Handyman allowance rollover', value: 'Not established — no rollover assumed', status: 'needs_confirmation' as const },
  { item: 'Emergency coverage', value: 'Not established — Moda does not provide emergency dispatch', status: 'needs_confirmation' as const },
  { item: 'Base inspection frequency', value: 'FLAGGED — PDF says "annual inspection" but also mentions monthly walkthrough with handyman. Requires Moda confirmation before scheduling.', status: 'flagged' as const },
  { item: 'Vendor availability guarantees', value: 'None established', status: 'needs_confirmation' as const },
  { item: 'Cancellation / pause rules', value: 'Draft only — 30-day notice mentioned but scope unclear. Do not implement.', status: 'flagged' as const },
  { item: 'Annual auto-renewal', value: 'Mentioned in draft', status: 'needs_confirmation' as const },
  { item: 'Subcontractor vs. Moda employee distinction', value: 'Established in PDF — only founders are Moda employees. All others subcontracted.', status: 'confirmed' as const },
];

const SIMULATED = [
  { feature: 'Homeowner identity verification', state: 'Simulated — click to proceed in demo' },
  { feature: 'Vendor outreach (email/text)', state: 'Draft prepared, never sent' },
  { feature: 'Homeowner approval (estimate)', state: 'Simulated in coordinator view' },
  { feature: 'Vendor appointment confirmation', state: 'Manually recorded in coordinator view' },
  { feature: 'Actor identity / access control', state: 'Demo labels only — not authenticated' },
  { feature: 'Data persistence', state: 'localStorage — resets on demand, preserved on refresh' },
  { feature: 'n8n / voice integration', state: 'Contracts documented — adapter stub only' },
  { feature: 'SMS / email notifications', state: 'Not connected in standalone demo' },
  { feature: 'Payment processing', state: 'Not built — estimates only' },
];

export default function Settings() {
  const [tab, setTab] = useState<Tab>('policies');
  const [showReset, setShowReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const resetDemo = useStore((s) => s.resetDemo);

  const conciergeExamples = [45, 70, 90].map((min) => {
    const r = calculateConciergeCharge(min);
    return { actual: min, billable: r.billableMinutes, charge: r.estimatedCharge, breakdown: r.breakdown };
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: 'policies', label: 'Business Policies' },
    { key: 'integration', label: 'Integration Docs' },
    { key: 'demo', label: 'Demo Info' },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <ConfirmDialog
        open={showReset}
        title="Reset Demo Data"
        message="This will restore all fictional seed data and clear any changes made during this session. Are you sure?"
        onConfirm={() => { resetDemo(); setShowReset(false); setResetDone(true); }}
        onCancel={() => setShowReset(false)}
        confirmLabel="Reset"
        danger
      />

      <h1 className="text-2xl font-semibold text-slate-100 mb-6">Settings & Documentation</h1>

      <div className="flex gap-1 mb-6 bg-slate-800 rounded-lg p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === t.key ? 'bg-slate-900 text-slate-100 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Business Policies ── */}
      {tab === 'policies' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-slate-200">Policy Status</h2>
              <p className="text-xs text-slate-400 mt-0.5">Source: Moda Management ONE-PAGER (VISION 2024). Provisional — requires Moda confirmation.</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Policy Item</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Value / Detail</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {POLICIES.map((p) => (
                  <tr key={p.item}>
                    <td className="px-4 py-3 font-medium text-slate-200">{p.item}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs leading-relaxed max-w-xs">{p.value}</td>
                    <td className="px-4 py-3">
                      {p.status === 'confirmed' && <span className="bg-green-950 text-green-300 border border-green-800 text-xs px-2 py-0.5 rounded-full">Confirmed</span>}
                      {p.status === 'needs_confirmation' && <span className="bg-amber-950 text-amber-300 border border-amber-800 text-xs px-2 py-0.5 rounded-full">Needs Confirmation</span>}
                      {p.status === 'flagged' && <span className="bg-red-950 text-red-300 border border-red-800 text-xs px-2 py-0.5 rounded-full">Flagged</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Concierge Billing Examples</h3>
            <p className="text-xs text-slate-400 mb-3 italic">Provisional estimates per draft policy. 1-hour minimum, then 15-min increments. $125/hr.</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-950 rounded">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-400">Actual Time</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-400">Billable Time</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-400">Est. Charge</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-400">Breakdown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {conciergeExamples.map((ex) => (
                  <tr key={ex.actual}>
                    <td className="px-3 py-2.5 text-slate-200">{ex.actual} min</td>
                    <td className="px-3 py-2.5 text-slate-200 font-medium">{ex.billable} min</td>
                    <td className="px-3 py-2.5 text-slate-100 font-semibold">{formatCurrency(ex.charge)}</td>
                    <td className="px-3 py-2.5 text-slate-400 text-xs">{ex.breakdown}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Integration Docs ── */}
      {tab === 'integration' && (
        <div className="space-y-6">
          <div className="bg-amber-950 border border-amber-800 rounded-lg p-4 text-sm text-amber-300">
            <strong>Architecture note:</strong> Browser localStorage cannot receive updates from n8n directly. A server-side adapter is required. State any integration through: Voice platform → authenticated server / n8n workflow → shared backend records → dashboard. The integration adapter in <code className="bg-amber-950 px-1 rounded">src/integrations/adapter.ts</code> is a stub for this standalone demo.
          </div>
          {CONTRACTS.map((c) => (
            <div key={c.name} className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800 flex items-start justify-between">
                <div>
                  <code className="text-sm font-semibold text-slate-100">{c.name}</code>
                  <p className="text-xs text-slate-400 mt-0.5">{c.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-0">
                <div className="p-5 border-r border-slate-800">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Request</p>
                  <pre className="text-xs text-slate-200 bg-slate-950 rounded-lg p-3 overflow-auto leading-relaxed">{JSON.stringify(c.request, null, 2)}</pre>
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Response</p>
                  <pre className="text-xs text-slate-200 bg-slate-950 rounded-lg p-3 overflow-auto leading-relaxed">{JSON.stringify(c.response, null, 2)}</pre>
                </div>
              </div>
              {c.notes && (
                <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400">
                  <strong>Note:</strong> {c.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Demo Info ── */}
      {tab === 'demo' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-slate-200">Simulated vs. Connected</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Feature</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Demo State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {SIMULATED.map((s) => (
                  <tr key={s.feature}>
                    <td className="px-4 py-3 font-medium text-slate-200">{s.feature}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{s.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Local Persistence</h3>
            <p className="text-sm text-slate-300 mb-2">
              All data is stored in <code className="bg-slate-800 px-1 rounded text-xs">localStorage</code> under the key <code className="bg-slate-800 px-1 rounded text-xs">moda-demo-storage</code>. Changes persist across page refreshes. Use Reset Demo to restore original seed data.
            </p>
            <p className="text-xs text-slate-400 italic">localStorage is not production data storage. It is not encrypted, not shared across devices, and is accessible to anyone with browser access. This is a demo only.</p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Run Locally</h3>
            <pre className="bg-slate-950 rounded-lg p-4 text-xs text-slate-200">
{`cd /path/to/moda
npm install
npm run dev

# App runs at http://localhost:5173`}
            </pre>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">5-Minute Demo Script</h3>
            <ol className="space-y-3 text-sm text-slate-300">
              <li className="flex gap-2"><span className="font-semibold text-slate-100 flex-shrink-0">1.</span>Open <strong>Overview</strong> — point out active requests, overdue indicator, immediate danger banner.</li>
              <li className="flex gap-2"><span className="font-semibold text-slate-100 flex-shrink-0">2.</span>Open <strong>Receptionist</strong> — review call, SMS, and email counts and expand a communication to view its paper trail. Use Requests → New Request for manual intake.</li>
              <li className="flex gap-2"><span className="font-semibold text-slate-100 flex-shrink-0">3.</span>Navigate to the <strong>created request</strong> — show response deadline, vendor recommendation (Arctic Comfort with rationale), assign vendor, prepare outreach draft.</li>
              <li className="flex gap-2"><span className="font-semibold text-slate-100 flex-shrink-0">4.</span>Add an <strong>estimate</strong>, simulate homeowner approval, request appointment window, confirm appointment. Show that "requested" vs "confirmed" are distinct.</li>
              <li className="flex gap-2"><span className="font-semibold text-slate-100 flex-shrink-0">5.</span>Switch to <strong>Homeowner view</strong> — show limited information: no internal notes, no vendor discussion. Show approved estimate and confirmed appointment.</li>
              <li className="flex gap-2"><span className="font-semibold text-slate-100 flex-shrink-0">6.</span>Open <strong>Settings → Business Policies</strong> — highlight flagged items (Base inspection frequency, overage rates) requiring Moda confirmation.</li>
            </ol>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Reset Demo Data</h3>
            <p className="text-sm text-slate-400 mb-4">Restores all fictional seed data and clears session changes.</p>
            {resetDone && <p className="text-green-300 text-sm mb-3">Demo data has been reset.</p>}
            <button
              onClick={() => { setResetDone(false); setShowReset(true); }}
              className="px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Reset Demo Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
