/**
 * Moda Management — Integration Contracts
 *
 * These JSON contracts define the API surface between:
 *   Voice platform / n8n workflow → Authenticated server → Moda records → Dashboard
 *
 * ARCHITECTURE NOTE:
 * Browser-local storage (used in this standalone demo) cannot receive updates
 * from n8n or external webhooks directly. A real deployment requires a
 * server-side data layer (e.g., Supabase, PlanetScale, or similar) that both
 * the dashboard and n8n can read from and write to.
 *
 * This file is documentation and a typing reference. Replace the adapter
 * functions below with real HTTP calls when a backend is available.
 */

// ─── lookup_homeowner ─────────────────────────────────────────────────────────
//
// Purpose: Find whether an inbound caller matches a known homeowner.
// Called by: Voice agent / receptionist intake / n8n trigger
//
// REQUEST:
export const LOOKUP_HOMEOWNER_REQUEST_EXAMPLE = {
  interactionId: "ia_20240715_abc123",       // unique per call session
  phone: "+13125550201",                      // caller ID — NOT sufficient for verification
  email: null,                               // optional alternate lookup
};
//
// RESPONSE (found):
export const LOOKUP_HOMEOWNER_RESPONSE_FOUND = {
  found: true,
  homeownerId: "ho-1",
  verificationRequired: true,               // always true — caller ID ≠ verified identity
  error: null,
};
//
// RESPONSE (not found):
export const LOOKUP_HOMEOWNER_RESPONSE_NOT_FOUND = {
  found: false,
  homeownerId: null,
  verificationRequired: true,
  error: null,
};
//
// RESPONSE (error):
export const LOOKUP_HOMEOWNER_RESPONSE_ERROR = {
  found: false,
  homeownerId: null,
  verificationRequired: true,
  error: "lookup_timeout",                   // or "invalid_input"
};

// ─── get_property_context ──────────────────────────────────────────────────────
//
// Purpose: Retrieve property info for a verified homeowner.
// SECURITY: verifiedBy must be set server-side — never trust a caller-supplied verified flag.
//
// REQUEST:
export const GET_PROPERTY_CONTEXT_REQUEST = {
  interactionId: "ia_20240715_abc123",
  homeownerId: "ho-1",
  verifiedBy: "server:pin_verified",        // server-set auth method, not caller-supplied
  propertyId: null,                         // optional — use if homeowner has multiple properties
};
//
// RESPONSE (success):
export const GET_PROPERTY_CONTEXT_RESPONSE = {
  success: true,
  propertyId: "prop-1",
  address: "4812 N. Lakewood Ave, Chicago, IL 60640",
  membership: "premium",
  assignedCoordinator: "Sofia Marchetti",
  error: null,
};
//
// RESPONSE (unauthorized):
export const GET_PROPERTY_CONTEXT_UNAUTHORIZED = {
  success: false,
  propertyId: null,
  address: null,
  membership: null,
  assignedCoordinator: null,
  error: "unauthorized",                    // never expose data until verified
};

// ─── create_service_request ───────────────────────────────────────────────────
//
// Purpose: Create a new service request from voice/n8n intake.
// Duplicate prevention: idempotencyKey must be unique per intake session.
// If the same key is submitted twice, return the existing request (duplicate: true).
// A failed save must return a failure — never confirm a request that wasn't persisted.
//
// REQUEST:
export const CREATE_SERVICE_REQUEST_REQUEST = {
  interactionId: "ia_20240715_abc123",
  propertyId: "prop-1",
  homeownerId: "ho-1",
  verifiedHomeownerId: "ho-1",             // server-validated, separate from caller claim
  channel: "phone",
  issueDescription: "Upstairs AC is running but isn't cooling.",
  category: "hvac",
  urgency: "urgent",
  urgencyReason: "Active system failure during summer heat.",
  idempotencyKey: "intake_ia_20240715_abc123_attempt_1",
};
//
// RESPONSE (created):
export const CREATE_SERVICE_REQUEST_RESPONSE_CREATED = {
  success: true,
  requestId: "req-xxxx",
  referenceNumber: "MM-2024-0042",
  status: "new",
  humanResponseDue: "2024-07-16T14:05:00Z",
  duplicate: false,
  error: null,
};
//
// RESPONSE (duplicate — idempotency):
export const CREATE_SERVICE_REQUEST_RESPONSE_DUPLICATE = {
  success: true,
  requestId: "req-xxxx",
  referenceNumber: "MM-2024-0042",
  status: "new",
  humanResponseDue: "2024-07-16T14:05:00Z",
  duplicate: true,                         // same idempotencyKey submitted twice
  error: null,
};
//
// RESPONSE (failure):
export const CREATE_SERVICE_REQUEST_RESPONSE_FAILURE = {
  success: false,
  requestId: null,
  referenceNumber: null,
  status: null,
  humanResponseDue: null,
  duplicate: false,
  error: "save_failed",                    // never return success=true if save failed
};

// ─── get_request_status ───────────────────────────────────────────────────────
//
// Purpose: Return current status of a request. Requires verified homeowner.
//
// REQUEST:
export const GET_REQUEST_STATUS_REQUEST = {
  interactionId: "ia_20240715_def456",
  requestId: "req-xxxx",
  verifiedHomeownerId: "ho-1",             // must match request's homeownerId
};
//
// RESPONSE:
export const GET_REQUEST_STATUS_RESPONSE = {
  success: true,
  referenceNumber: "MM-2024-0042",
  status: "scheduled",
  statusLabel: "Scheduled",
  appointmentStatus: "confirmed",          // "none" | "requested" | "confirmed"
  scheduledStart: "2024-07-17T14:00:00Z", // only if confirmed
  customerUpdates: [
    "Arctic Comfort confirmed for July 17, 2–4pm.",
  ],
  error: null,
};

// ─── request_human_followup ───────────────────────────────────────────────────
//
// Purpose: Flag a request for immediate human coordinator review.
// Used by: Immediate danger protocol, unverified callers, escalation.
//
// REQUEST:
export const REQUEST_HUMAN_FOLLOWUP_REQUEST = {
  interactionId: "ia_20240715_ghi789",
  requestId: "req-yyyy",
  reason: "immediate_danger",
  callerPhone: "+17735550888",
  notes: "Caller reported gas odor. Immediate danger protocol triggered.",
};
//
// RESPONSE:
export const REQUEST_HUMAN_FOLLOWUP_RESPONSE = {
  success: true,
  escalated: true,
  coordinatorNotified: true,               // always true in demo; real: depends on availability
  error: null,
};

// ─── record_appointment_request ───────────────────────────────────────────────
//
// Purpose: Record a requested appointment window. Does NOT confirm the appointment.
// A requested time is never a confirmed appointment until the vendor explicitly confirms.
//
// REQUEST:
export const RECORD_APPOINTMENT_REQUEST_REQUEST = {
  interactionId: "ia_20240716_jkl012",
  requestId: "req-xxxx",
  verifiedCoordinatorId: "coord-1",
  requestedWindowStart: "2024-07-17T13:00:00Z",
  requestedWindowEnd: "2024-07-17T17:00:00Z",
  notes: "Client available after 1pm.",
};
//
// RESPONSE:
export const RECORD_APPOINTMENT_REQUEST_RESPONSE = {
  success: true,
  status: "scheduling_requested",          // never "scheduled" until vendor confirms
  message: "Appointment request recorded. Awaiting vendor confirmation.",
  error: null,
};

// ─── Adapter stub (replace with HTTP in production) ──────────────────────────

export type IntegrationMode = 'standalone_demo' | 'live';

export const INTEGRATION_MODE: IntegrationMode = 'standalone_demo';

export function getIntegrationStatus() {
  return {
    mode: INTEGRATION_MODE,
    note: 'This demo uses browser-local storage only. No external API calls are made. Replace adapter functions with authenticated HTTP endpoints for production.',
    voiceIntegration: false,
    n8nIntegration: false,
    lastUpdated: '2024-09-28',
  };
}
