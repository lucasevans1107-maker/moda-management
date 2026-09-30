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
        <div className="bg-stone-100 border border-stone-200 rounded-lg px-4 py-2 text-xs text-stone-500 mb-4">
          DEMO PREVIEW — Homeowner view.
        </div>
        <p className="text-stone-400">Request not found.</p>
        <button onClick={() => navigate(-1)} className="text-sm text-stone-500 underline mt-2">Back</button>
      </div>
    );
  }

  const activeEstimate = request.estimates.find((e) => e.approvalStatus === 'approved');
  const pendingEstimate = request.estimates.find((e) => e.approvalStatus === 'pending');

  return (
    <div className="p-8 max-w-2xl">
      <div className="bg-stone-100 border border-stone-200 rounded-lg px-4 py-2 text-xs text-stone-500 mb-6">
        DEMO PREVIEW — Homeowner view. Internal operational details, vendor discussions, and coordinator notes are not visible here.
      </div>

      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-stone-500 text-sm hover:text-stone-700 mb-6">
        <ArrowLeft size={14} /> Back
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-900">Your Service Request</h1>
        <p className="font-mono text-stone-400 text-sm mt-1">{request.referenceNumber}</p>
      </div>

      <div className="space-y-4">
        {property && (
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Property</h3>
            <p className="text-stone-800 font-medium">{property.address.street}</p>
            <p className="text-stone-500 text-sm">{property.address.city}, {property.address.state} {property.address.zip}</p>
          </div>
        )}

        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Issue Reported</h3>
          <p className="text-stone-700 text-sm leading-relaxed">{request.issueDescription}</p>
          <p className="text-stone-400 text-xs mt-2">Reported {formatDate(request.createdAt)}</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Status</h3>
          <StatusBadge status={request.status} />
        </div>

        {activeEstimate && (
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Approved Estimate</h3>
            <p className="text-stone-700 text-sm mb-1">{activeEstimate.scope}</p>
            <p className="text-2xl font-semibold text-stone-900">{formatCurrency(activeEstimate.amount)}</p>
            {activeEstimate.approvedAt && (
              <p className="text-xs text-stone-400 mt-1">Approved {formatDate(activeEstimate.approvedAt)}</p>
            )}
            <p className="text-xs text-stone-400 mt-2 italic">Provisional estimate per draft policy. Subcontractor costs are billed separately and are not included in the concierge rate.</p>
          </div>
        )}

        {pendingEstimate && !activeEstimate && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-purple-500 uppercase tracking-wider mb-2">Estimate Pending Your Approval</h3>
            <p className="text-stone-700 text-sm mb-1">{pendingEstimate.scope}</p>
            <p className="text-2xl font-semibold text-stone-900">{formatCurrency(pendingEstimate.amount)}</p>
            <p className="text-purple-600 text-xs mt-2">Work will not begin until you approve this estimate. Your coordinator will be in touch.</p>
          </div>
        )}

        {request.appointmentRequest && (
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Appointment</h3>
            {request.appointmentConfirmation ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-sm font-semibold text-green-700">Confirmed Appointment</span>
                </div>
                <p className="text-stone-700 text-sm">{formatDateTime(request.appointmentConfirmation.scheduledStart)}</p>
                <p className="text-stone-500 text-sm">to {formatDateTime(request.appointmentConfirmation.scheduledEnd)}</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-amber-500" />
                  <span className="text-sm font-semibold text-amber-700">Appointment Requested — Awaiting Confirmation</span>
                </div>
                <p className="text-stone-600 text-sm">Requested window: {formatDateTime(request.appointmentRequest.requestedWindowStart)} – {formatDateTime(request.appointmentRequest.requestedWindowEnd)}</p>
                <p className="text-stone-400 text-xs mt-1">This is a requested window, not yet confirmed. We will notify you once the vendor confirms.</p>
              </div>
            )}
          </div>
        )}

        {request.customerUpdates.length > 0 && (
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Updates</h3>
            <ul className="space-y-3">
              {request.customerUpdates.map((msg, i) => (
                <li key={i} className="text-sm text-stone-700 border-l-2 border-stone-200 pl-3 leading-relaxed">
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        )}

        {request.completionNotes && request.status === 'completed' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-green-600" />
              <h3 className="text-sm font-semibold text-green-700">Service Complete</h3>
            </div>
            <p className="text-stone-700 text-sm leading-relaxed">{request.completionNotes}</p>
            {request.completedAt && (
              <p className="text-stone-400 text-xs mt-2">Completed {formatDate(request.completedAt)}</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-stone-200">
        <Link
          to={`/requests/${request.id}`}
          className="text-xs text-stone-400 hover:text-stone-600 underline"
        >
          Coordinator view (demo only)
        </Link>
      </div>
    </div>
  );
}
