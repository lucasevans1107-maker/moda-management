import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { useStore } from '../store';
import { formatDateTime, formatDate, formatCurrency } from '../lib/format';
import StatusBadge from '../components/StatusBadge';

export default function HomeownerView() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();

  const request = useStore((s) => s.requests.find((r) => r.id === requestId));
  const property = useStore((s) => s.properties.find((p) => p.id === request?.propertyId));

  if (!request) {
    return (
      <div className="p-8 max-w-2xl">
        <div className="bg-raised border border-line rounded-lg px-4 py-2 text-xs text-muted mb-4">
          DEMO PREVIEW — Homeowner view.
        </div>
        <p className="text-muted">Request not found.</p>
        <button onClick={() => navigate(-1)} className="text-sm text-muted underline mt-2">Back</button>
      </div>
    );
  }

  const activeEstimate = request.estimates.find((e) => e.approvalStatus === 'approved');
  const pendingEstimate = request.estimates.find((e) => e.approvalStatus === 'pending');

  return (
    <div className="p-8 max-w-2xl">
      <div className="bg-raised border border-line rounded-lg px-4 py-2 text-xs text-muted mb-6">
        DEMO PREVIEW — Homeowner view. Internal operational details, vendor discussions, and coordinator notes are not visible here.
      </div>

      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted text-sm hover:text-ink mb-6">
        <ArrowLeft size={14} /> Back
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-ink">Your Service Request</h1>
        <p className="font-mono text-muted text-sm mt-1">{request.referenceNumber}</p>
      </div>

      <div className="space-y-4">
        {property && (
          <div className="bg-surface border border-line rounded-xl p-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Property</h3>
            <p className="text-ink font-medium">{property.address.street}</p>
            <p className="text-muted text-sm">{property.address.city}, {property.address.state} {property.address.zip}</p>
          </div>
        )}

        <div className="bg-surface border border-line rounded-xl p-5">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Issue Reported</h3>
          <p className="text-ink text-sm leading-relaxed">{request.issueDescription}</p>
          <p className="text-muted text-xs mt-2">Reported {formatDate(request.createdAt)}</p>
        </div>

        <div className="bg-surface border border-line rounded-xl p-5">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Status</h3>
          <StatusBadge status={request.status} />
        </div>

        {activeEstimate && (
          <div className="bg-surface border border-line rounded-xl p-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Approved Estimate</h3>
            <p className="text-ink text-sm mb-1">{activeEstimate.scope}</p>
            <p className="text-2xl font-semibold text-ink">{formatCurrency(activeEstimate.amount)}</p>
            {activeEstimate.approvedAt && (
              <p className="text-xs text-muted mt-1">Approved {formatDate(activeEstimate.approvedAt)}</p>
            )}
            <p className="text-xs text-muted mt-2 italic">Provisional estimate per draft policy. Subcontractor costs are billed separately and are not included in the concierge rate.</p>
          </div>
        )}

        {pendingEstimate && !activeEstimate && (
          <div className="bg-purple-950 border border-purple-800 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-purple-500 uppercase tracking-wider mb-2">Estimate Pending Your Approval</h3>
            <p className="text-ink text-sm mb-1">{pendingEstimate.scope}</p>
            <p className="text-2xl font-semibold text-ink">{formatCurrency(pendingEstimate.amount)}</p>
            <p className="text-purple-300 text-xs mt-2">Work will not begin until you approve this estimate. Your coordinator will be in touch.</p>
          </div>
        )}

        {request.appointmentRequest && (
          <div className="bg-surface border border-line rounded-xl p-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Appointment</h3>
            {request.appointmentConfirmation ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-green-300" />
                  <span className="text-sm font-semibold text-green-300">Confirmed Appointment</span>
                </div>
                <p className="text-ink text-sm">{formatDateTime(request.appointmentConfirmation.scheduledStart)}</p>
                <p className="text-muted text-sm">to {formatDateTime(request.appointmentConfirmation.scheduledEnd)}</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-amber-500" />
                  <span className="text-sm font-semibold text-amber-300">Appointment Requested — Awaiting Confirmation</span>
                </div>
                <p className="text-muted text-sm">Requested window: {formatDateTime(request.appointmentRequest.requestedWindowStart)} – {formatDateTime(request.appointmentRequest.requestedWindowEnd)}</p>
                <p className="text-muted text-xs mt-1">This is a requested window, not yet confirmed. We will notify you once the vendor confirms.</p>
              </div>
            )}
          </div>
        )}

        {request.customerUpdates.length > 0 && (
          <div className="bg-surface border border-line rounded-xl p-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Updates</h3>
            <ul className="space-y-3">
              {request.customerUpdates.map((msg, i) => (
                <li key={i} className="text-sm text-ink border-l-2 border-line pl-3 leading-relaxed">
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        )}

        {request.completionNotes && request.status === 'completed' && (
          <div className="bg-green-950 border border-green-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-green-300" />
              <h3 className="text-sm font-semibold text-green-300">Service Complete</h3>
            </div>
            <p className="text-ink text-sm leading-relaxed">{request.completionNotes}</p>
            {request.completedAt && (
              <p className="text-muted text-xs mt-2">Completed {formatDate(request.completedAt)}</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-line">
        <Link
          to={`/requests/${request.id}`}
          className="text-xs text-muted hover:text-muted underline"
        >
          Coordinator view (demo only)
        </Link>
      </div>
    </div>
  );
}
