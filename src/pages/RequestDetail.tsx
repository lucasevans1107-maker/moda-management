import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../store';
import { matchVendors } from '../lib/vendorMatch';
import { isOverdue } from '../lib/urgency';
import { formatDateTime, formatDate, formatCurrency, formatMinutes } from '../lib/format';
import { CATEGORY_LABELS, URGENCY_LABELS, STATUS_LABELS, VALID_TRANSITIONS } from '../types';
import StatusBadge from '../components/StatusBadge';
import UrgencyBadge from '../components/UrgencyBadge';
import MembershipBadge from '../components/MembershipBadge';
import Timeline from '../components/Timeline';
import ConfirmDialog from '../components/ConfirmDialog';
import clsx from 'clsx';

function Card({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('bg-white border border-stone-200 rounded-xl overflow-hidden', className)}>
      {title && (
        <div className="px-5 py-4 border-b border-stone-100">
          <h3 className="text-sm font-semibold text-stone-700">{title}</h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

function EstimateBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    approved: 'bg-green-50 text-green-700 border border-green-200',
    rejected: 'bg-red-50 text-red-700 border border-red-200',
    superseded: 'bg-stone-100 text-stone-400',
  };
  const labels: Record<string, string> = {
    pending: 'Awaiting Approval',
    approved: 'Approved',
    rejected: 'Rejected',
    superseded: 'Superseded',
  };
  return (
    <span className={clsx('inline-flex px-2 py-0.5 rounded-full text-xs font-medium', cls[status] ?? 'bg-stone-100 text-stone-500')}>
      {labels[status] ?? status}
    </span>
  );
}

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const request = useStore((s) => s.requests.find((r) => r.id === id));
  const property = useStore((s) => s.properties.find((p) => p.id === request?.propertyId));
  const homeowner = useStore((s) => s.homeowners.find((h) => h.id === request?.homeownerId));
  const vendors = useStore((s) => s.vendors);
  const coordinators = useStore((s) => s.coordinators);
  const membershipConfigs = useStore((s) => s.membershipConfigs);
  const handymanEntries = useStore((s) => s.handymanEntries);
  const demoRole = useStore((s) => s.demoRole);

  const setHumanResponded = useStore((s) => s.setHumanResponded);
  const assignVendor = useStore((s) => s.assignVendor);
  const setOutreachDraft = useStore((s) => s.setOutreachDraft);
  const addEstimate = useStore((s) => s.addEstimate);
  const approveEstimate = useStore((s) => s.approveEstimate);
  const rejectEstimate = useStore((s) => s.rejectEstimate);
  const setAppointmentRequest = useStore((s) => s.setAppointmentRequest);
  const confirmAppointment = useStore((s) => s.confirmAppointment);
  const completeRequest = useStore((s) => s.completeRequest);
  const addCustomerUpdate = useStore((s) => s.addCustomerUpdate);
  const updateRequestStatus = useStore((s) => s.updateRequestStatus);

  // Local form state
  const [showEstimateForm, setShowEstimateForm] = useState(false);
  const [estimateScope, setEstimateScope] = useState('');
  const [estimateAmount, setEstimateAmount] = useState('');
  const [estimateSubcost, setEstimateSubcost] = useState('');
  const [estimatePreparedBy, setEstimatePreparedBy] = useState('Coordinator — Sofia M. [DEMO]');

  const [showApptForm, setShowApptForm] = useState(false);
  const [apptWindowStart, setApptWindowStart] = useState('');
  const [apptWindowEnd, setApptWindowEnd] = useState('');
  const [apptNotes, setApptNotes] = useState('');

  const [showConfirmApptForm, setShowConfirmApptForm] = useState(false);
  const [confirmStart, setConfirmStart] = useState('');
  const [confirmEnd, setConfirmEnd] = useState('');
  const [confirmBy, setConfirmBy] = useState('Vendor [DEMO]');

  const [completionNotes, setCompletionNotes] = useState('');
  const [showCompleteForm, setShowCompleteForm] = useState(false);

  const [customerUpdate, setCustomerUpdate] = useState('');

  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const [showDraft, setShowDraft] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean; title: string; message: string; onConfirm: () => void; danger?: boolean;
  }>({ open: false, title: '', message: '', onConfirm: () => {} });

  if (!request) {
    return (
      <div className="p-8">
        <p className="text-stone-500">Request not found.</p>
        <Link to="/requests" className="text-sm text-stone-600 underline mt-2 inline-block">Back to Requests</Link>
      </div>
    );
  }

  const isCoordinator = demoRole === 'coordinator';
  const overdue = isOverdue(request);
  const coordinator = coordinators.find((c) => c.id === request.assignedCoordinatorId);

  const vendorMatchResult = property
    ? matchVendors(vendors, property, request.category)
    : { recommendations: [], noMatchReason: 'No property linked.' };

  const assignedVendor = request.vendorAssignment
    ? vendors.find((v) => v.id === request.vendorAssignment!.vendorId)
    : null;

  const membershipConfig = property
    ? membershipConfigs.find((c) => c.tier === property.membership)
    : null;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const handymanThisMonth = property
    ? handymanEntries
        .filter((e) => {
          if (e.propertyId !== property.id) return false;
          const d = new Date(e.date);
          return d >= monthStart && d <= monthEnd;
        })
        .reduce((sum, e) => sum + e.durationMinutes, 0)
    : 0;

  const activeEstimate = request.estimates.find((e) => e.approvalStatus === 'approved');
  const pendingEstimate = request.estimates.find((e) => e.approvalStatus === 'pending');

  function handleApproveVendor(vendorId: string) {
    setConfirmDialog({
      open: true,
      title: 'Approve Vendor Assignment',
      message: `Assign ${vendors.find((v) => v.id === vendorId)?.company ?? vendorId} to this request?`,
      onConfirm: () => {
        assignVendor(request!.id, vendorId, 'Coordinator — Sofia M. [DEMO]');
        setConfirmDialog((d) => ({ ...d, open: false }));
      },
    });
  }

  function handlePrepareOutreach() {
    if (!assignedVendor || !property || !request) return;
    setOutreachDraft(request.id, {
      preparedAt: new Date().toISOString(),
      preparedBy: 'Coordinator — Sofia M. [DEMO]',
      subject: `Service Request — ${CATEGORY_LABELS[request.category]} | ${property.address.street}`,
      body: `Hi ${assignedVendor.contactName},\n\nWe have a service request for one of our clients at ${property.address.street}, ${property.address.city}, IL ${property.address.zip}.\n\nIssue: ${request.issueDescription}\n\nCategory: ${CATEGORY_LABELS[request.category]} | Urgency: ${URGENCY_LABELS[request.urgency]}\n\nPlease confirm your availability at your earliest convenience.\n\nThank you,\nModa Management Team\n[DEMO — not sent]`,
      sent: false,
    });
    setShowDraft(true);
  }

  function handleAddEstimate(e: React.FormEvent) {
    e.preventDefault();
    if (!request) return;
    addEstimate(request.id, {
      scope: estimateScope,
      amount: parseFloat(estimateAmount),
      subcontractorCost: estimateSubcost ? parseFloat(estimateSubcost) : undefined,
      preparedBy: estimatePreparedBy,
      preparedAt: new Date().toISOString(),
      approvalStatus: 'pending',
    });
    setEstimateScope('');
    setEstimateAmount('');
    setEstimateSubcost('');
    setShowEstimateForm(false);
  }

  function handleRequestAppointment(e: React.FormEvent) {
    e.preventDefault();
    if (!request) return;
    setAppointmentRequest(
      request.id,
      {
        requestedAt: new Date().toISOString(),
        requestedWindowStart: new Date(apptWindowStart).toISOString(),
        requestedWindowEnd: new Date(apptWindowEnd).toISOString(),
        notes: apptNotes,
      },
      'Coordinator — Sofia M. [DEMO]'
    );
    setShowApptForm(false);
  }

  function handleConfirmAppointment(e: React.FormEvent) {
    e.preventDefault();
    if (!request) return;
    confirmAppointment(request.id, {
      confirmedAt: new Date().toISOString(),
      confirmedBy: confirmBy,
      scheduledStart: new Date(confirmStart).toISOString(),
      scheduledEnd: new Date(confirmEnd).toISOString(),
    });
    setShowConfirmApptForm(false);
  }

  function handleComplete(e: React.FormEvent) {
    e.preventDefault();
    if (!request) return;
    setConfirmDialog({
      open: true,
      title: 'Mark Request Complete',
      message: 'This will close the request. Are you sure?',
      onConfirm: () => {
        completeRequest(request!.id, completionNotes, 'Coordinator — Sofia M. [DEMO]');
        setShowCompleteForm(false);
        setConfirmDialog((d) => ({ ...d, open: false }));
      },
    });
  }

  // ── Homeowner view (limited) ─────────────────────────────────────────────────
  if (!isCoordinator) {
    return (
      <div className="p-8 max-w-3xl">
        <div className="mb-6 bg-stone-100 border border-stone-200 rounded-lg px-4 py-2 text-xs text-stone-500">
          DEMO PREVIEW — Homeowner view. Internal details are not shown.
        </div>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-stone-500 text-sm hover:text-stone-700 mb-6">
          <ArrowLeft size={14} /> Back
        </button>
        <h1 className="text-xl font-semibold text-stone-900 mb-1">Your Service Request</h1>
        <p className="text-stone-500 text-sm font-mono mb-6">{request.referenceNumber}</p>

        <div className="space-y-4">
          <Card title="Property">
            <p className="text-stone-700 text-sm">{property ? `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zip}` : 'On file'}</p>
          </Card>
          <Card title="Issue Reported">
            <p className="text-stone-700 text-sm">{request.issueDescription}</p>
          </Card>
          <Card title="Status">
            <div className="flex items-center gap-3">
              <StatusBadge status={request.status} />
              <UrgencyBadge urgency={request.urgency} />
            </div>
          </Card>
          {activeEstimate && (
            <Card title="Approved Estimate">
              <p className="text-stone-700 text-sm">{activeEstimate.scope}</p>
              <p className="text-2xl font-semibold text-stone-900 mt-2">{formatCurrency(activeEstimate.amount)}</p>
              <p className="text-xs text-stone-400 mt-1">Approved {activeEstimate.approvedAt ? formatDate(activeEstimate.approvedAt) : ''}</p>
              <p className="text-xs text-stone-400 mt-2 italic">Provisional estimate per draft policy. Subcontractor costs are billed separately and not included in the concierge rate.</p>
            </Card>
          )}
          {pendingEstimate && !activeEstimate && (
            <Card title="Estimate Pending Your Approval">
              <p className="text-stone-700 text-sm">{pendingEstimate.scope}</p>
              <p className="text-2xl font-semibold text-stone-900 mt-2">{formatCurrency(pendingEstimate.amount)}</p>
              <p className="text-xs text-stone-400 mt-1">Awaiting your approval before work begins.</p>
            </Card>
          )}
          {request.appointmentRequest && (
            <Card title="Appointment">
              {request.appointmentConfirmation ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-700">Confirmed Appointment</span>
                  </div>
                  <p className="text-sm text-stone-700">{formatDateTime(request.appointmentConfirmation.scheduledStart)} – {formatDateTime(request.appointmentConfirmation.scheduledEnd)}</p>
                  <p className="text-xs text-stone-400 mt-1">Confirmed by {request.appointmentConfirmation.confirmedBy}</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-amber-500" />
                    <span className="text-sm font-medium text-amber-700">Requested — Pending Confirmation</span>
                  </div>
                  <p className="text-sm text-stone-600">Window requested: {formatDateTime(request.appointmentRequest.requestedWindowStart)} – {formatDateTime(request.appointmentRequest.requestedWindowEnd)}</p>
                  <p className="text-xs text-stone-400 mt-1">We are waiting for vendor confirmation. This is not yet a confirmed appointment.</p>
                </div>
              )}
            </Card>
          )}
          {request.customerUpdates.length > 0 && (
            <Card title="Updates">
              <ul className="space-y-2">
                {request.customerUpdates.map((msg, i) => (
                  <li key={i} className="text-sm text-stone-700 border-l-2 border-stone-200 pl-3">{msg}</li>
                ))}
              </ul>
            </Card>
          )}
          {request.completionNotes && (
            <Card title="Completion Summary">
              <p className="text-sm text-stone-700">{request.completionNotes}</p>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // ── Coordinator view ─────────────────────────────────────────────────────────
  return (
    <div className="p-8 max-w-7xl">
      <ConfirmDialog {...confirmDialog} onCancel={() => setConfirmDialog((d) => ({ ...d, open: false }))} />

      <button onClick={() => navigate('/requests')} className="flex items-center gap-1 text-stone-500 text-sm hover:text-stone-700 mb-6">
        <ArrowLeft size={14} /> Back to Requests
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl font-semibold text-stone-900">{request.referenceNumber}</h1>
            <StatusBadge status={request.status} />
            <UrgencyBadge urgency={request.urgency} />
            {request.isUnverifiedInquiry && (
              <span className="bg-orange-50 text-orange-700 border border-orange-200 text-xs px-2 py-0.5 rounded-full">Unverified Inquiry</span>
            )}
          </div>
          <p className="text-stone-500 text-sm">
            Created {formatDateTime(request.createdAt)} · {CATEGORY_LABELS[request.category]}
            {coordinator && ` · ${coordinator.name}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/homeowner-view/${request.id}`}
            className="flex items-center gap-1 text-xs text-stone-500 border border-stone-200 hover:border-stone-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ExternalLink size={12} />
            Homeowner View
          </Link>
        </div>
      </div>

      {/* Response deadline */}
      <div className={clsx('flex items-center gap-3 rounded-lg px-4 py-3 mb-6 text-sm', overdue ? 'bg-red-50 border border-red-200' : 'bg-stone-50 border border-stone-200')}>
        {overdue ? <AlertTriangle size={16} className="text-red-500" /> : <Clock size={16} className="text-stone-400" />}
        <span className={overdue ? 'text-red-700' : 'text-stone-600'}>
          Response due: <strong>{formatDateTime(request.humanResponseDue)}</strong>
          {request.humanRespondedAt
            ? <span className="ml-2 text-green-600 font-normal">✓ Responded {formatDateTime(request.humanRespondedAt)}</span>
            : overdue
            ? <span className="ml-2 font-normal text-red-600">OVERDUE — human response required</span>
            : null}
        </span>
        {!request.humanRespondedAt && (
          <button
            onClick={() => setHumanResponded(request.id, 'Coordinator — Sofia M. [DEMO]')}
            className="ml-auto text-xs px-3 py-1.5 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors"
          >
            Mark Human Responded
          </button>
        )}
      </div>

      {request.urgency === 'immediate_danger' && (
        <div className="mb-6 bg-red-50 border border-red-300 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-red-600" />
            <p className="font-semibold text-red-800">Immediate Danger Reported</p>
          </div>
          <p className="text-red-700 text-sm mb-1">
            Emergency services or utilities may need to be involved. Moda does not provide emergency dispatch.
          </p>
          <p className="text-red-700 text-sm font-medium">{request.urgencyReason}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main column */}
        <div className="col-span-2 space-y-6">

          {/* Issue */}
          <Card title="Issue Description">
            <p className="text-stone-700 text-sm leading-relaxed">{request.issueDescription}</p>
            <div className="mt-3 flex gap-2 text-xs text-stone-400">
              <span>Channel: {request.channel}</span>
              <span>·</span>
              <span>Urgency: {URGENCY_LABELS[request.urgency]}</span>
            </div>
            {request.urgencyReason && (
              <div className="mt-3 bg-stone-50 rounded-lg px-3 py-2 text-xs text-stone-500">
                <span className="font-semibold text-stone-600">Urgency rationale: </span>
                {request.urgencyReason}
              </div>
            )}
            {request.isUnverifiedInquiry && (
              <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-xs text-orange-700">
                <strong>Unverified inquiry.</strong> Caller identity not confirmed. Callback:{' '}
                {request.callerCallbackName} — {request.callerCallbackPhone}. Do not disclose homeowner records.
              </div>
            )}
          </Card>

          {/* Vendor Assignment */}
          <Card title="Vendor Assignment">
            {request.vendorAssignment ? (
              <div>
                {assignedVendor && (
                  <div className="border border-stone-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-stone-800 text-sm">{assignedVendor.company}</p>
                        <p className="text-stone-500 text-xs mt-0.5">{assignedVendor.contactName} · {assignedVendor.contactPhone}</p>
                      </div>
                      <span className={clsx(
                        'text-xs px-2 py-0.5 rounded-full',
                        assignedVendor.availabilityStatus === 'available' ? 'bg-green-50 text-green-700' :
                        assignedVendor.availabilityStatus === 'busy' ? 'bg-amber-50 text-amber-700' :
                        'bg-stone-100 text-stone-500'
                      )}>
                        {assignedVendor.availabilityStatus === 'available' ? 'Available' : assignedVendor.availabilityStatus === 'busy' ? 'Busy' : 'Availability not confirmed'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-2">Assigned by {request.vendorAssignment.approvedBy} · {formatDateTime(request.vendorAssignment.approvedAt)}</p>
                  </div>
                )}
                {!request.outreachDraft ? (
                  <button
                    onClick={handlePrepareOutreach}
                    className="text-sm px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
                  >
                    Prepare Outreach Draft
                  </button>
                ) : (
                  <div>
                    <button
                      onClick={() => setShowDraft((v) => !v)}
                      className="flex items-center gap-1 text-sm text-stone-600 hover:text-stone-800 mb-3"
                    >
                      {showDraft ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      Outreach Draft
                      <span className="text-xs text-amber-600 ml-2">[DEMO — not sent]</span>
                    </button>
                    {showDraft && (
                      <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-sm text-stone-700">
                        <p className="font-medium text-stone-800 mb-1">{request.outreachDraft.subject}</p>
                        <pre className="whitespace-pre-wrap font-sans text-stone-600 text-sm mt-2">{request.outreachDraft.body}</pre>
                        <p className="text-xs text-stone-400 mt-3">Prepared: {formatDateTime(request.outreachDraft.preparedAt)}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {request.suggestedVendorId && (
                  <div className="bg-stone-50 border border-stone-100 rounded-lg p-3 mb-4 text-xs text-stone-600">
                    <strong>Suggested:</strong> {vendors.find((v) => v.id === request.suggestedVendorId)?.company ?? request.suggestedVendorId}
                    {request.suggestedVendorReason && <p className="mt-1 text-stone-500">{request.suggestedVendorReason}</p>}
                  </div>
                )}
                {vendorMatchResult.recommendations.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs text-stone-500 mb-2">Vendor recommendations for <strong>{CATEGORY_LABELS[request.category]}</strong> in {property?.address.zip}:</p>
                    {vendorMatchResult.recommendations.map((rec) => (
                      <div key={rec.vendor.id} className="border border-stone-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-stone-800 text-sm">{rec.vendor.company}</p>
                            <p className="text-stone-500 text-xs">{rec.vendor.contactName} · {rec.vendor.contactPhone}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-stone-400">Score: {rec.score}</span>
                            <button
                              onClick={() => handleApproveVendor(rec.vendor.id)}
                              className="text-xs px-3 py-1.5 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors"
                            >
                              Assign
                            </button>
                          </div>
                        </div>
                        <ul className="text-xs text-green-700 space-y-0.5">
                          {rec.reasons.map((r, i) => <li key={i}>✓ {r}</li>)}
                        </ul>
                        {rec.warnings.length > 0 && (
                          <ul className="text-xs text-amber-600 space-y-0.5 mt-1">
                            {rec.warnings.map((w, i) => <li key={i}>⚠ {w}</li>)}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700">
                    <strong>Coordinator review required.</strong>{' '}
                    {vendorMatchResult.noMatchReason}
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Estimates */}
          <Card title="Estimates">
            {request.estimates.length > 0 && (
              <div className="space-y-3 mb-4">
                {[...request.estimates].sort((a, b) => b.version - a.version).map((est) => (
                  <div key={est.id} className={clsx('border rounded-lg p-4', est.approvalStatus === 'superseded' ? 'border-stone-100 opacity-60' : 'border-stone-200')}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-stone-400 font-mono">v{est.version}</span>
                          <EstimateBadge status={est.approvalStatus} />
                        </div>
                        <p className="text-sm text-stone-700 font-medium">{est.scope}</p>
                        <p className="text-lg font-semibold text-stone-900 mt-1">{formatCurrency(est.amount)}</p>
                        {est.subcontractorCost != null && (
                          <p className="text-xs text-stone-400 mt-0.5">Subcontractor cost: {formatCurrency(est.subcontractorCost)} (billed separately)</p>
                        )}
                        <p className="text-xs text-stone-400 mt-1">Prepared by {est.preparedBy} · {formatDateTime(est.preparedAt)}</p>
                        {est.approvedBy && <p className="text-xs text-green-600 mt-0.5">Approved by {est.approvedBy} · {est.approvedAt ? formatDateTime(est.approvedAt) : ''}</p>}
                        {est.rejectedReason && <p className="text-xs text-red-500 mt-0.5">Rejected: {est.rejectedReason}</p>}
                        <p className="text-xs text-stone-400 mt-2 italic">Provisional estimate based on draft policy.</p>
                      </div>
                      {est.approvalStatus === 'pending' && (
                        <div className="flex flex-col gap-2 ml-4">
                          <span className="text-xs text-stone-400 text-right">Simulate homeowner:</span>
                          <button
                            onClick={() => approveEstimate(request.id, est.id, 'Homeowner [DEMO]')}
                            className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Approve [DEMO]
                          </button>
                          {rejectingId === est.id ? (
                            <div className="space-y-1">
                              <input
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Rejection reason"
                                className="text-xs border border-stone-200 rounded px-2 py-1 w-full"
                              />
                              <button
                                onClick={() => { rejectEstimate(request.id, est.id, rejectReason); setRejectingId(null); setRejectReason(''); }}
                                className="text-xs w-full px-3 py-1.5 bg-red-600 text-white rounded-lg"
                              >
                                Confirm Reject
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setRejectingId(est.id)}
                              className="text-xs px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Reject [DEMO]
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!showEstimateForm ? (
              <button
                onClick={() => setShowEstimateForm(true)}
                className="text-sm px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
              >
                Add Estimate
              </button>
            ) : (
              <form onSubmit={handleAddEstimate} className="border border-stone-200 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-stone-600 mb-2">New Estimate</p>
                <input required value={estimateScope} onChange={(e) => setEstimateScope(e.target.value)} placeholder="Scope of work" className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-300" />
                <div className="grid grid-cols-2 gap-3">
                  <input required type="number" min="0" step="0.01" value={estimateAmount} onChange={(e) => setEstimateAmount(e.target.value)} placeholder="Total amount ($)" className="text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-300" />
                  <input type="number" min="0" step="0.01" value={estimateSubcost} onChange={(e) => setEstimateSubcost(e.target.value)} placeholder="Subcontractor cost (optional)" className="text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-300" />
                </div>
                <input value={estimatePreparedBy} onChange={(e) => setEstimatePreparedBy(e.target.value)} placeholder="Prepared by [DEMO]" className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-300" />
                <p className="text-xs text-stone-400 italic">Adding a new estimate will supersede any existing pending estimate and require fresh homeowner approval.</p>
                <div className="flex gap-2">
                  <button type="submit" className="text-sm px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors">Save Estimate</button>
                  <button type="button" onClick={() => setShowEstimateForm(false)} className="text-sm px-4 py-2 border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-50">Cancel</button>
                </div>
              </form>
            )}
          </Card>

          {/* Appointment */}
          <Card title="Appointment">
            {request.appointmentConfirmation ? (
              <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-sm font-semibold text-green-800">Confirmed Appointment</span>
                </div>
                <p className="text-sm text-stone-700">
                  <strong>Start:</strong> {formatDateTime(request.appointmentConfirmation.scheduledStart)}
                </p>
                <p className="text-sm text-stone-700">
                  <strong>End:</strong> {formatDateTime(request.appointmentConfirmation.scheduledEnd)}
                </p>
                <p className="text-xs text-stone-400 mt-2">Confirmed by {request.appointmentConfirmation.confirmedBy} · {formatDateTime(request.appointmentConfirmation.confirmedAt)}</p>
              </div>
            ) : request.appointmentRequest ? (
              <div>
                <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-amber-600" />
                    <span className="text-sm font-semibold text-amber-800">REQUESTED — Not confirmed</span>
                  </div>
                  <p className="text-sm text-stone-700">Window: {formatDateTime(request.appointmentRequest.requestedWindowStart)} – {formatDateTime(request.appointmentRequest.requestedWindowEnd)}</p>
                  {request.appointmentRequest.notes && <p className="text-xs text-stone-500 mt-1">{request.appointmentRequest.notes}</p>}
                  <p className="text-xs text-stone-400 mt-2">Requested: {formatDateTime(request.appointmentRequest.requestedAt)}</p>
                </div>
                {!showConfirmApptForm ? (
                  <button onClick={() => setShowConfirmApptForm(true)} className="text-sm px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors">
                    Confirm Appointment (Vendor Response)
                  </button>
                ) : (
                  <form onSubmit={handleConfirmAppointment} className="border border-stone-200 rounded-lg p-4 space-y-3">
                    <p className="text-xs font-semibold text-stone-600">Record Vendor Confirmation</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-stone-500 mb-1 block">Confirmed Start</label>
                        <input required type="datetime-local" value={confirmStart} onChange={(e) => setConfirmStart(e.target.value)} className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-300" />
                      </div>
                      <div>
                        <label className="text-xs text-stone-500 mb-1 block">Confirmed End</label>
                        <input required type="datetime-local" value={confirmEnd} onChange={(e) => setConfirmEnd(e.target.value)} className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-300" />
                      </div>
                    </div>
                    <input value={confirmBy} onChange={(e) => setConfirmBy(e.target.value)} placeholder="Confirmed by [DEMO]" className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-300" />
                    <div className="flex gap-2">
                      <button type="submit" className="text-sm px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">Confirm</button>
                      <button type="button" onClick={() => setShowConfirmApptForm(false)} className="text-sm px-4 py-2 border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-50">Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div>
                {(activeEstimate || request.status === 'ready_to_coordinate') ? (
                  !showApptForm ? (
                    <button onClick={() => setShowApptForm(true)} className="text-sm px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors">
                      Request Appointment Window
                    </button>
                  ) : (
                    <form onSubmit={handleRequestAppointment} className="border border-stone-200 rounded-lg p-4 space-y-3">
                      <p className="text-xs font-semibold text-stone-600">Request Appointment Window</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-stone-500 mb-1 block">Window Start</label>
                          <input required type="datetime-local" value={apptWindowStart} onChange={(e) => setApptWindowStart(e.target.value)} className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-300" />
                        </div>
                        <div>
                          <label className="text-xs text-stone-500 mb-1 block">Window End</label>
                          <input required type="datetime-local" value={apptWindowEnd} onChange={(e) => setApptWindowEnd(e.target.value)} className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-300" />
                        </div>
                      </div>
                      <input value={apptNotes} onChange={(e) => setApptNotes(e.target.value)} placeholder="Notes for vendor (optional)" className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-300" />
                      <p className="text-xs text-stone-400 italic">This requests a window — it is not a confirmed appointment until vendor responds.</p>
                      <div className="flex gap-2">
                        <button type="submit" className="text-sm px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors">Send Request</button>
                        <button type="button" onClick={() => setShowApptForm(false)} className="text-sm px-4 py-2 border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-50">Cancel</button>
                      </div>
                    </form>
                  )
                ) : (
                  <p className="text-sm text-stone-400 italic">Appointment coordination available after homeowner approval of estimate or when status is Ready to Coordinate.</p>
                )}
              </div>
            )}
          </Card>

          {/* Completion */}
          {request.status === 'in_progress' && (
            <Card title="Completion">
              {!showCompleteForm ? (
                <button onClick={() => setShowCompleteForm(true)} className="text-sm px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
                  Mark Complete
                </button>
              ) : (
                <form onSubmit={handleComplete} className="space-y-3">
                  <textarea required value={completionNotes} onChange={(e) => setCompletionNotes(e.target.value)} rows={3} placeholder="Completion notes (what was done, any follow-up needed)..." className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-300" />
                  <div className="flex gap-2">
                    <button type="submit" className="text-sm px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">Mark Complete</button>
                    <button type="button" onClick={() => setShowCompleteForm(false)} className="text-sm px-4 py-2 border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-50">Cancel</button>
                  </div>
                </form>
              )}
            </Card>
          )}

          {request.completionNotes && (
            <Card title="Completion Notes">
              <p className="text-sm text-stone-700">{request.completionNotes}</p>
              {request.completedAt && <p className="text-xs text-stone-400 mt-2">Completed: {formatDateTime(request.completedAt)}</p>}
            </Card>
          )}

          {/* Activity Timeline */}
          <Card title="Activity Timeline">
            <Timeline entries={request.activity} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {property && (
            <Card title="Property">
              <Link to={`/properties/${property.id}`} className="text-sm font-medium text-stone-800 hover:text-stone-600 underline block mb-1">
                {property.address.street}
              </Link>
              <p className="text-stone-500 text-xs">{property.address.city}, {property.address.state} {property.address.zip}</p>
              <div className="mt-2">
                <MembershipBadge tier={property.membership} />
              </div>
              {coordinator && <p className="text-xs text-stone-500 mt-2">Coordinator: {coordinator.name}</p>}
            </Card>
          )}
          {homeowner && (
            <Card title="Homeowner">
              <p className="text-sm font-medium text-stone-800">{homeowner.name}</p>
              <p className="text-xs text-stone-500 mt-1">{homeowner.phone}</p>
              <p className="text-xs text-stone-500">{homeowner.email}</p>
              <p className="text-xs text-stone-400 mt-1">Prefers: {homeowner.preferredChannel}</p>
            </Card>
          )}
          {membershipConfig && property && (
            <Card title="Handyman Usage (This Month)">
              <div className="mb-2">
                <div className="flex justify-between text-xs text-stone-500 mb-1">
                  <span>{formatMinutes(handymanThisMonth)} used</span>
                  <span>{formatMinutes(membershipConfig.handymanMinutesPerMonth)} included</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={clsx('h-full rounded-full', handymanThisMonth > membershipConfig.handymanMinutesPerMonth ? 'bg-red-400' : 'bg-green-500')}
                    style={{ width: `${Math.min(100, (handymanThisMonth / membershipConfig.handymanMinutesPerMonth) * 100)}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-stone-400 italic">Eligibility requires coordinator review. Overage rate policy not yet confirmed.</p>
            </Card>
          )}
          <Card title="Customer Updates">
            <ul className="space-y-2 mb-3">
              {request.customerUpdates.map((msg, i) => (
                <li key={i} className="text-xs text-stone-600 border-l-2 border-stone-200 pl-2">{msg}</li>
              ))}
              {request.customerUpdates.length === 0 && (
                <li className="text-xs text-stone-400 italic">No customer updates yet.</li>
              )}
            </ul>
            <div className="flex gap-2">
              <input
                value={customerUpdate}
                onChange={(e) => setCustomerUpdate(e.target.value)}
                placeholder="Add customer-facing update..."
                className="flex-1 text-xs border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-300"
              />
              <button
                onClick={() => { if (customerUpdate.trim()) { addCustomerUpdate(request.id, customerUpdate.trim()); setCustomerUpdate(''); } }}
                className="text-xs px-3 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors"
              >
                Add
              </button>
            </div>
          </Card>

          {/* Status control */}
          <Card title="Status Control">
            <div className="space-y-2">
              {(['needs_review', 'awaiting_estimate', 'ready_to_coordinate', 'scheduling_requested', 'in_progress', 'canceled'] as const)
                .filter((s) => {
                  return VALID_TRANSITIONS[request!.status]?.includes(s);
                })
                .map((s) => (
                  <button
                    key={s}
                    onClick={() => updateRequestStatus(request.id, s, 'Coordinator — Sofia M. [DEMO]')}
                    className={clsx(
                      'w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors',
                      s === 'canceled' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    )}
                  >
                    → {STATUS_LABELS[s]}
                  </button>
                ))}
              {request.status === 'completed' && (
                <p className="text-xs text-stone-400 italic text-center py-2">Request is complete.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
