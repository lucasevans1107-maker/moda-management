// ─── Enums & Union Types ────────────────────────────────────────────────────

export type MembershipTier = 'base' | 'premium';
export type PreferredChannel = 'phone' | 'email' | 'text' | 'portal';
export type VerificationStatus = 'verified' | 'unverified' | 'pending';

export type VendorAvailability = 'available' | 'busy' | 'not_confirmed';
export type VendorStatus = 'active' | 'inactive';

export type Trade =
  | 'hvac'
  | 'plumbing'
  | 'electrical'
  | 'handyman'
  | 'appliance'
  | 'structural'
  | 'roofing'
  | 'landscape'
  | 'pest_control'
  | 'cleaning'
  | 'painting'
  | 'general';

export type ServiceCategory =
  | 'hvac'
  | 'plumbing'
  | 'electrical'
  | 'handyman'
  | 'appliance'
  | 'structural'
  | 'roofing'
  | 'landscape'
  | 'pest_control'
  | 'cleaning'
  | 'painting'
  | 'other';

export type UrgencyLevel = 'routine' | 'urgent' | 'immediate_danger';

export type RequestStatus =
  | 'new'
  | 'needs_review'
  | 'awaiting_estimate'
  | 'awaiting_homeowner_approval'
  | 'ready_to_coordinate'
  | 'scheduling_requested'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'canceled';

export type RequestChannel = 'phone' | 'email' | 'text' | 'portal' | 'receptionist';

export type EstimateApprovalStatus = 'pending' | 'approved' | 'rejected' | 'superseded';

export type ActorRole = 'coordinator' | 'homeowner' | 'vendor' | 'system' | 'receptionist';

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface Homeowner {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredChannel: PreferredChannel;
  verificationStatus: VerificationStatus;
  lastContactAt?: string; // Explicitly recorded client contact
  memberSince: string; // ISO date
  notes?: string;
}

export interface Equipment {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  installedYear?: number;
  notes?: string;
  lastServicedAt?: string; // ISO date
}

export interface Property {
  id: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  homeownerId: string;
  membership: MembershipTier;
  membershipStartDate: string; // ISO date
  membershipRenewalDate: string; // ISO date
  assignedCoordinatorId: string;
  equipment: Equipment[];
  preferredVendorIds: string[];
  internalNotes: string;
}

export interface Vendor {
  id: string;
  company: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  trades: Trade[];
  serviceAreas: string[]; // zip codes or city names
  status: VendorStatus;
  availabilityStatus: VendorAvailability;
  priorPropertyIds: string[]; // properties this vendor has worked on
  notes: string;
  licenseNumber?: string;
  insuranceVerified?: boolean;
}

export interface MembershipConfig {
  tier: MembershipTier;
  monthlyRate: number;
  handymanMinutesPerMonth: number;
  inspectionFrequency: 'annual' | 'monthly';
  dedicatedContact: boolean;
}

// ─── Service Request & Related ────────────────────────────────────────────────

export interface ActivityEntry {
  id: string;
  timestamp: string; // ISO
  actor: string; // display label (e.g., "Coordinator — Sofia M.", "[DEMO] System")
  actorRole: ActorRole;
  action: string;
  details?: string;
}

export interface EstimateRecord {
  id: string;
  version: number;
  scope: string;
  amount: number;
  subcontractorCost?: number;
  preparedBy: string;
  preparedAt: string; // ISO
  approvalStatus: EstimateApprovalStatus;
  approvedBy?: string;
  approvedAt?: string; // ISO
  rejectedReason?: string;
}

export interface AppointmentRequest {
  requestedAt: string; // ISO
  requestedWindowStart: string; // ISO
  requestedWindowEnd: string; // ISO
  notes?: string;
}

export interface AppointmentConfirmation {
  confirmedAt: string; // ISO
  confirmedBy: string; // display label
  scheduledStart: string; // ISO
  scheduledEnd: string; // ISO
}

export interface VendorOutreachDraft {
  preparedAt: string; // ISO
  preparedBy: string;
  subject: string;
  body: string;
  sent: false; // always false in standalone demo
}

export interface ServiceRequest {
  id: string;
  referenceNumber: string; // e.g., "MM-2024-0042"
  propertyId: string;
  homeownerId: string;
  channel: RequestChannel;
  issueDescription: string;
  category: ServiceCategory;
  urgency: UrgencyLevel;
  urgencyReason: string;
  status: RequestStatus;
  createdAt: string; // ISO
  humanResponseDue: string; // ISO — 24h after createdAt
  humanRespondedAt?: string; // ISO — set only when a human actually responds
  assignedCoordinatorId?: string;
  suggestedVendorId?: string;
  suggestedVendorReason?: string;
  vendorAssignment?: {
    vendorId: string;
    approvedBy: string;
    approvedAt: string; // ISO
  };
  outreachDraft?: VendorOutreachDraft;
  estimates: EstimateRecord[];
  appointmentRequest?: AppointmentRequest;
  appointmentConfirmation?: AppointmentConfirmation;
  completionNotes?: string;
  completedAt?: string; // ISO
  customerUpdates: string[]; // customer-facing update messages
  activity: ActivityEntry[];
  isUnverifiedInquiry?: boolean;
  callerCallbackPhone?: string;
  callerCallbackName?: string;
}

// ─── Time / Billing Tracking ──────────────────────────────────────────────────

export interface HandymanEntry {
  id: string;
  propertyId: string;
  serviceRequestId?: string;
  date: string; // ISO date
  durationMinutes: number;
  description: string;
  eligibilityReviewed: boolean;
  eligibilityApproved?: boolean;
  reviewNotes?: string;
}

export interface ConciergeEntry {
  id: string;
  propertyId: string;
  serviceRequestId?: string;
  date: string; // ISO date
  actualMinutes: number;
  billableMinutes: number; // rounded per policy
  ratePerHour: number; // $125
  estimatedCharge: number;
  description: string;
  subcontractorCosts?: number;
  notes?: string;
}

// ─── Staff / Coordinators ─────────────────────────────────────────────────────

export interface Coordinator {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'coordinator' | 'admin';
}

// ─── Integration Contracts ───────────────────────────────────────────────────

export interface LookupHomeownerRequest {
  interactionId: string;
  phone?: string;
  email?: string;
}

export interface LookupHomeownerResponse {
  found: boolean;
  homeownerId?: string;
  verificationRequired: true;
  error?: string;
}

export interface GetPropertyContextRequest {
  interactionId: string;
  homeownerId: string;
  verifiedBy: string; // must be server-side auth, not caller-supplied flag
  propertyId?: string;
}

export interface GetPropertyContextResponse {
  success: boolean;
  propertyId?: string;
  address?: string;
  membership?: MembershipTier;
  assignedCoordinator?: string;
  error?: string;
}

export interface CreateServiceRequestPayload {
  interactionId: string;
  propertyId: string;
  homeownerId: string;
  verifiedHomeownerId: string; // server-validated
  channel: RequestChannel;
  issueDescription: string;
  category: ServiceCategory;
  urgency: UrgencyLevel;
  urgencyReason: string;
  idempotencyKey: string; // prevent duplicate events
}

export interface CreateServiceRequestResponse {
  success: boolean;
  requestId?: string;
  referenceNumber?: string;
  status?: RequestStatus;
  humanResponseDue?: string;
  error?: string;
  duplicate?: boolean; // idempotency hit
}

// ─── Store Shape ──────────────────────────────────────────────────────────────

export interface Communication {
  id: string;
  homeownerId?: string;
  requestId?: string;
  channel: 'phone' | 'text' | 'email';
  direction: 'inbound' | 'outbound';
  occurredAt: string;
  contactName: string;
  contactAddress: string;
  summary: string;
  outcome: 'handled' | 'needs_follow_up';
  source: 'demo' | 'integration';
}

export interface AppState {
  communications: Communication[];
  homeowners: Homeowner[];
  properties: Property[];
  vendors: Vendor[];
  requests: ServiceRequest[];
  handymanEntries: HandymanEntry[];
  conciergeEntries: ConciergeEntry[];
  coordinators: Coordinator[];
  membershipConfigs: MembershipConfig[];
  demoRole: 'coordinator' | 'homeowner';
  demoHomeownerId?: string; // used in homeowner preview mode
  lastResetAt?: string;
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────

export const STATUS_LABELS: Record<RequestStatus, string> = {
  new: 'New',
  needs_review: 'Needs Review',
  awaiting_estimate: 'Awaiting Estimate',
  awaiting_homeowner_approval: 'Awaiting Approval',
  ready_to_coordinate: 'Ready to Coordinate',
  scheduling_requested: 'Scheduling Requested',
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
  canceled: 'Canceled',
};

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  routine: 'Routine',
  urgent: 'Urgent',
  immediate_danger: 'Immediate Danger',
};

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  hvac: 'HVAC',
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  handyman: 'Handyman',
  appliance: 'Appliance',
  structural: 'Structural',
  roofing: 'Roofing',
  landscape: 'Landscape',
  pest_control: 'Pest Control',
  cleaning: 'Cleaning',
  painting: 'Painting',
  other: 'Other',
};

export const TRADE_LABELS: Record<Trade, string> = {
  hvac: 'HVAC',
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  handyman: 'Handyman',
  appliance: 'Appliance Repair',
  structural: 'Structural',
  roofing: 'Roofing',
  landscape: 'Landscape',
  pest_control: 'Pest Control',
  cleaning: 'Cleaning',
  painting: 'Painting',
  general: 'General',
};

// Valid status transitions (coordinator actions only)
export const VALID_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  new: ['needs_review', 'canceled'],
  needs_review: ['awaiting_estimate', 'ready_to_coordinate', 'canceled'],
  awaiting_estimate: ['awaiting_homeowner_approval', 'canceled'],
  awaiting_homeowner_approval: ['ready_to_coordinate', 'awaiting_estimate', 'canceled'],
  ready_to_coordinate: ['scheduling_requested', 'canceled'],
  scheduling_requested: ['scheduled', 'ready_to_coordinate', 'canceled'],
  scheduled: ['in_progress', 'scheduling_requested', 'canceled'],
  in_progress: ['completed', 'canceled'],
  completed: [],
  canceled: [],
};
