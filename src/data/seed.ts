import type {
  Homeowner,
  Property,
  Vendor,
  ServiceRequest,
  Coordinator,
  HandymanEntry,
  ConciergeEntry,
  MembershipConfig,
  AppState,
} from '../types';

// ─── Demo label prefix ────────────────────────────────────────────────────────
// All names, addresses, and contacts are fictional and for demonstration only.

export const COORDINATORS: Coordinator[] = [
  {
    id: 'coord-1',
    name: 'Sofia Marchetti',
    email: 'sofia@modamgmt.com',
    phone: '(312) 555-0191',
    role: 'admin',
  },
  {
    id: 'coord-2',
    name: 'Esty Navarro',
    email: 'esty@modamgmt.com',
    phone: '(312) 555-0192',
    role: 'coordinator',
  },
];

export const HOMEOWNERS: Homeowner[] = [
  {
    id: 'ho-1',
    name: 'Claire Ashworth',
    email: 'c.ashworth@example.com',
    phone: '(312) 555-0201',
    preferredChannel: 'phone',
    verificationStatus: 'verified',
    memberSince: '2023-04-01',
    notes: 'Prefers afternoon calls. Premium member since launch.',
  },
  {
    id: 'ho-2',
    name: 'Marcus Delgado',
    email: 'm.delgado@example.com',
    phone: '(312) 555-0202',
    preferredChannel: 'text',
    verificationStatus: 'verified',
    memberSince: '2023-09-15',
    notes: 'Base member. Often travels. Text is fastest.',
  },
  {
    id: 'ho-3',
    name: 'Priya Khatri',
    email: 'p.khatri@example.com',
    phone: '(847) 555-0303',
    preferredChannel: 'email',
    verificationStatus: 'unverified',
    memberSince: '2024-01-10',
    notes: 'New member — identity not yet confirmed for this session.',
  },
];

export const PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    address: {
      street: '4812 N. Lakewood Ave',
      city: 'Chicago',
      state: 'IL',
      zip: '60640',
    },
    homeownerId: 'ho-1',
    membership: 'premium',
    membershipStartDate: '2023-04-01',
    membershipRenewalDate: '2024-04-01',
    assignedCoordinatorId: 'coord-1',
    equipment: [
      {
        id: 'eq-1',
        name: 'Central Air Conditioner',
        brand: 'Carrier',
        model: '24ACC636A003',
        installedYear: 2019,
        lastServicedAt: '2023-06-10',
        notes: 'Annual filter replaced June 2023. Refrigerant topped off.',
      },
      {
        id: 'eq-2',
        name: 'Furnace',
        brand: 'Lennox',
        model: 'EL296V',
        installedYear: 2019,
        lastServicedAt: '2023-10-15',
        notes: 'Serviced for winter 2023.',
      },
      {
        id: 'eq-3',
        name: 'Water Heater',
        brand: 'Rheem',
        model: 'PROG50-40N RH62',
        installedYear: 2018,
        notes: 'No recent service. Monitor anode rod.',
      },
    ],
    preferredVendorIds: ['vendor-1'],
    internalNotes:
      'Client is detail-oriented. Always send written summary after any service visit. Side gate code no longer stored here — see secure vault.',
  },
  {
    id: 'prop-2',
    address: {
      street: '2239 W. Roscoe St',
      city: 'Chicago',
      state: 'IL',
      zip: '60618',
    },
    homeownerId: 'ho-2',
    membership: 'base',
    membershipStartDate: '2023-09-15',
    membershipRenewalDate: '2024-09-15',
    assignedCoordinatorId: 'coord-2',
    equipment: [
      {
        id: 'eq-4',
        name: 'Window AC Unit',
        brand: 'LG',
        model: 'LW8016ER',
        installedYear: 2021,
        notes: 'Living room only. No central HVAC.',
      },
    ],
    preferredVendorIds: ['vendor-3'],
    internalNotes: 'Base member. Handyman allowance resets 15th of each month per signup date.',
  },
  {
    id: 'prop-3',
    address: {
      street: '1177 E. 56th St',
      city: 'Chicago',
      state: 'IL',
      zip: '60637',
    },
    homeownerId: 'ho-3',
    membership: 'base',
    membershipStartDate: '2024-01-10',
    membershipRenewalDate: '2025-01-10',
    assignedCoordinatorId: 'coord-2',
    equipment: [],
    preferredVendorIds: [],
    internalNotes: 'Intake still being finalized. No prior service history.',
  },
];

export const VENDORS: Vendor[] = [
  {
    id: 'vendor-1',
    company: 'Arctic Comfort HVAC',
    contactName: 'Ray Kowalczyk',
    contactPhone: '(312) 555-0501',
    contactEmail: 'ray@arcticcomfort.example.com',
    trades: ['hvac'],
    serviceAreas: ['60640', '60626', '60660', '60613', '60657', '60618'],
    status: 'active',
    availabilityStatus: 'not_confirmed',
    priorPropertyIds: ['prop-1'],
    notes: 'Previous HVAC work at 4812 N. Lakewood (2023). Responded promptly. Recommended.',
    licenseNumber: 'IL-HVAC-88421',
    insuranceVerified: true,
  },
  {
    id: 'vendor-2',
    company: 'Northside Plumbing Co.',
    contactName: 'Ana Lima',
    contactPhone: '(312) 555-0502',
    contactEmail: 'ana@northsideplumbing.example.com',
    trades: ['plumbing'],
    serviceAreas: ['60640', '60657', '60614', '60618', '60626'],
    status: 'active',
    availabilityStatus: 'available',
    priorPropertyIds: [],
    notes: 'New vendor added Q1 2024. Strong reviews.',
    licenseNumber: 'IL-PLM-29301',
    insuranceVerified: true,
  },
  {
    id: 'vendor-3',
    company: 'Reliable Handyman Services',
    contactName: 'Tom Becker',
    contactPhone: '(773) 555-0503',
    contactEmail: 'tom@reliablehandyman.example.com',
    trades: ['handyman', 'general', 'painting'],
    serviceAreas: ['60618', '60647', '60641', '60639', '60637'],
    status: 'active',
    availabilityStatus: 'available',
    priorPropertyIds: ['prop-2'],
    notes: 'Used for multiple handyman visits at Roscoe St. Quick, clean, communicative.',
  },
  {
    id: 'vendor-4',
    company: 'Spark Electric LLC',
    contactName: 'Dena Ortiz',
    contactPhone: '(312) 555-0504',
    contactEmail: 'dena@sparkelectric.example.com',
    trades: ['electrical'],
    serviceAreas: ['60640', '60613', '60657', '60614', '60618', '60637'],
    status: 'active',
    availabilityStatus: 'not_confirmed',
    priorPropertyIds: [],
    notes: 'Licensed master electrician. Added Jan 2024.',
    licenseNumber: 'IL-ELC-77710',
    insuranceVerified: true,
  },
  {
    id: 'vendor-5',
    company: 'All-Season HVAC',
    contactName: 'Greg Patel',
    contactPhone: '(847) 555-0505',
    contactEmail: 'greg@allseasonhvac.example.com',
    trades: ['hvac'],
    serviceAreas: ['60640', '60626', '60660', '60076', '60077'],
    status: 'inactive',
    availabilityStatus: 'not_confirmed',
    priorPropertyIds: [],
    notes: 'Suspended Q4 2023 pending license renewal. Do not assign.',
  },
];

// ─── Seed Service Requests ────────────────────────────────────────────────────
// All timestamps use America/Chicago convention; stored as UTC ISO strings.
// "2024-07-15T14:00:00Z" ≈ 9am CT July 15.

export const REQUESTS: ServiceRequest[] = [
  // ── Scenario 1: Premium — AC not cooling (primary demo scenario) ─────────
  {
    id: 'req-1',
    referenceNumber: 'MM-2024-0041',
    propertyId: 'prop-1',
    homeownerId: 'ho-1',
    channel: 'phone',
    issueDescription:
      "Upstairs AC is running but isn't cooling. System runs continuously but the upstairs temp won't drop below 79°F. Issue started two days ago.",
    category: 'hvac',
    urgency: 'urgent',
    urgencyReason:
      'Active system failure during summer heat. Residential comfort significantly impacted. No safety hazard identified, but sustained elevated temperature can affect vulnerable occupants.',
    status: 'completed',
    createdAt: '2024-07-15T14:05:00Z',
    humanResponseDue: '2024-07-16T14:05:00Z',
    humanRespondedAt: '2024-07-15T14:45:00Z',
    assignedCoordinatorId: 'coord-1',
    suggestedVendorId: 'vendor-1',
    suggestedVendorReason:
      'Arctic Comfort HVAC previously serviced this property (June 2023). Active, licensed, insured. Service area matches. Preferred vendor on file.',
    vendorAssignment: {
      vendorId: 'vendor-1',
      approvedBy: 'Coordinator — Sofia M. [DEMO]',
      approvedAt: '2024-07-15T15:00:00Z',
    },
    outreachDraft: {
      preparedAt: '2024-07-15T15:01:00Z',
      preparedBy: 'Coordinator — Sofia M. [DEMO]',
      subject: 'Service Request — HVAC Diagnostic | 4812 N. Lakewood Ave',
      body: `Hi Ray,\n\nHope you're well. We have an urgent HVAC situation for one of our premium clients at 4812 N. Lakewood Ave, Chicago, IL 60640.\n\nIssue: Upstairs central AC is running but not cooling. System appears to run continuously without reaching setpoint.\n\nPrevious work: You serviced this unit in June 2023 (refrigerant top-off, filter).\n\nWe'd like to schedule a diagnostic at your earliest availability — ideally within 24–48 hours. Please confirm availability and we'll coordinate with the homeowner.\n\nThank you,\nSofia Marchetti\nModa Management\n[DEMO — not sent]`,
      sent: false,
    },
    estimates: [
      {
        id: 'est-1',
        version: 1,
        scope: 'HVAC diagnostic inspection + refrigerant recharge (2 lbs R-410A estimated)',
        amount: 380,
        subcontractorCost: 320,
        preparedBy: 'Arctic Comfort HVAC (via Coordinator) [DEMO]',
        preparedAt: '2024-07-16T10:00:00Z',
        approvalStatus: 'approved',
        approvedBy: 'Homeowner — Claire A. [DEMO]',
        approvedAt: '2024-07-16T11:30:00Z',
      },
    ],
    appointmentRequest: {
      requestedAt: '2024-07-16T12:00:00Z',
      requestedWindowStart: '2024-07-17T13:00:00Z',
      requestedWindowEnd: '2024-07-17T17:00:00Z',
      notes: 'Client available after 1pm. Side entrance preferred.',
    },
    appointmentConfirmation: {
      confirmedAt: '2024-07-16T14:00:00Z',
      confirmedBy: 'Vendor — Ray K. (Arctic Comfort) [DEMO]',
      scheduledStart: '2024-07-17T14:00:00Z',
      scheduledEnd: '2024-07-17T16:00:00Z',
    },
    completionNotes:
      'Refrigerant was low (1.8 lbs R-410A added). Coils cleaned. System operational at end of visit. Tech noted a slow leak may be present — recommend pressure test next season. Full report shared with homeowner.',
    completedAt: '2024-07-17T16:30:00Z',
    customerUpdates: [
      'We received your report about the AC on July 15. A coordinator will follow up shortly.',
      'We have identified Arctic Comfort HVAC to assist and are arranging a diagnostic visit.',
      'Arctic Comfort confirmed for Wednesday, July 17 between 2–4pm. A coordinator will be on-site.',
      'Service is complete. Refrigerant was recharged and coils were cleaned. Your AC should now be cooling properly. A written summary has been sent to your email.',
    ],
    activity: [
      {
        id: 'act-1-1',
        timestamp: '2024-07-15T14:05:00Z',
        actor: 'Receptionist Simulator [DEMO]',
        actorRole: 'receptionist',
        action: 'Request created via phone intake',
        details: 'Homeowner identity verified. Issue captured: AC running, not cooling.',
      },
      {
        id: 'act-1-2',
        timestamp: '2024-07-15T14:06:00Z',
        actor: 'System [DEMO]',
        actorRole: 'system',
        action: 'Automated acknowledgment sent to homeowner',
        details:
          'Email confirmation sent to c.ashworth@example.com. NOTE: This does not constitute human response.',
      },
      {
        id: 'act-1-3',
        timestamp: '2024-07-15T14:45:00Z',
        actor: 'Coordinator — Sofia M. [DEMO]',
        actorRole: 'coordinator',
        action: 'Human follow-up completed',
        details: 'Called homeowner. Confirmed urgency. Identified Arctic Comfort as best match.',
      },
      {
        id: 'act-1-4',
        timestamp: '2024-07-15T15:00:00Z',
        actor: 'Coordinator — Sofia M. [DEMO]',
        actorRole: 'coordinator',
        action: 'Vendor assignment approved',
        details: 'Arctic Comfort HVAC (vendor-1) assigned. Outreach draft prepared.',
      },
      {
        id: 'act-1-5',
        timestamp: '2024-07-16T10:00:00Z',
        actor: 'Coordinator — Sofia M. [DEMO]',
        actorRole: 'coordinator',
        action: 'Estimate v1 recorded',
        details: '$380 total — HVAC diagnostic + refrigerant recharge. Subcontractor cost: $320.',
      },
      {
        id: 'act-1-6',
        timestamp: '2024-07-16T11:30:00Z',
        actor: 'Homeowner — Claire A. [DEMO]',
        actorRole: 'homeowner',
        action: 'Estimate approved by homeowner',
        details: 'Homeowner approved $380 estimate via text confirmation.',
      },
      {
        id: 'act-1-7',
        timestamp: '2024-07-16T12:00:00Z',
        actor: 'Coordinator — Sofia M. [DEMO]',
        actorRole: 'coordinator',
        action: 'Appointment request sent to vendor',
        details: 'Requested window: July 17, 1–5pm.',
      },
      {
        id: 'act-1-8',
        timestamp: '2024-07-16T14:00:00Z',
        actor: 'Vendor — Ray K. (Arctic Comfort) [DEMO]',
        actorRole: 'vendor',
        action: 'Appointment confirmed by vendor',
        details: 'Confirmed July 17, 2–4pm. Status updated to Scheduled.',
      },
      {
        id: 'act-1-9',
        timestamp: '2024-07-17T14:00:00Z',
        actor: 'Coordinator — Sofia M. [DEMO]',
        actorRole: 'coordinator',
        action: 'Service visit began',
        details: 'Coordinator on-site. Status updated to In Progress.',
      },
      {
        id: 'act-1-10',
        timestamp: '2024-07-17T16:30:00Z',
        actor: 'Coordinator — Sofia M. [DEMO]',
        actorRole: 'coordinator',
        action: 'Request completed',
        details:
          '1.8 lbs R-410A added. Coils cleaned. System operational. Completion notes recorded.',
      },
    ],
  },

  // ── Scenario 2: Base member — handyman request ────────────────────────────
  {
    id: 'req-2',
    referenceNumber: 'MM-2024-0038',
    propertyId: 'prop-2',
    homeownerId: 'ho-2',
    channel: 'text',
    issueDescription:
      'Need help mounting a 65" TV above the fireplace and installing the bracket. Also a couple of picture frames while the handyman is there.',
    category: 'handyman',
    urgency: 'routine',
    urgencyReason:
      'Non-emergency aesthetic/home improvement task. No safety issue. Complimentary handyman hours may apply (eligibility requires coordinator review).',
    status: 'scheduled',
    createdAt: '2024-07-20T16:00:00Z',
    humanResponseDue: '2024-07-21T16:00:00Z',
    humanRespondedAt: '2024-07-20T17:30:00Z',
    assignedCoordinatorId: 'coord-2',
    suggestedVendorId: 'vendor-3',
    suggestedVendorReason:
      'Reliable Handyman Services has prior experience at this property. Active, available, service area matches.',
    vendorAssignment: {
      vendorId: 'vendor-3',
      approvedBy: 'Coordinator — Esty N. [DEMO]',
      approvedAt: '2024-07-20T17:35:00Z',
    },
    outreachDraft: {
      preparedAt: '2024-07-20T17:36:00Z',
      preparedBy: 'Coordinator — Esty N. [DEMO]',
      subject: 'Handyman Visit — 2239 W. Roscoe St',
      body: `Hi Tom,\n\nWe have a routine handyman request for our client at 2239 W. Roscoe St.\n\nWork needed:\n- Mount 65" TV above fireplace with provided bracket\n- Hang 2–3 picture frames\n\nEst. time: 1.5–2 hours\n\nClient available most weekday mornings. Please confirm your next available slot.\n\nThanks,\nEsty Navarro\nModa Management\n[DEMO — not sent]`,
      sent: false,
    },
    estimates: [],
    appointmentRequest: {
      requestedAt: '2024-07-21T09:00:00Z',
      requestedWindowStart: '2024-07-23T09:00:00Z',
      requestedWindowEnd: '2024-07-23T12:00:00Z',
      notes: 'Morning preferred. Client will be home.',
    },
    appointmentConfirmation: {
      confirmedAt: '2024-07-21T11:00:00Z',
      confirmedBy: 'Vendor — Tom B. (Reliable Handyman) [DEMO]',
      scheduledStart: '2024-07-23T09:30:00Z',
      scheduledEnd: '2024-07-23T11:30:00Z',
    },
    customerUpdates: [
      'We received your handyman request on July 20. A coordinator will follow up.',
      'Reliable Handyman Services is confirmed for Tuesday, July 23 from 9:30–11:30am.',
    ],
    activity: [
      {
        id: 'act-2-1',
        timestamp: '2024-07-20T16:00:00Z',
        actor: 'System [DEMO]',
        actorRole: 'system',
        action: 'Request created via text intake',
        details: 'Homeowner submitted via text. Category: Handyman.',
      },
      {
        id: 'act-2-2',
        timestamp: '2024-07-20T17:30:00Z',
        actor: 'Coordinator — Esty N. [DEMO]',
        actorRole: 'coordinator',
        action: 'Human follow-up completed',
        details: 'Texted homeowner to confirm scope. Verified TV bracket is homeowner-supplied.',
      },
      {
        id: 'act-2-3',
        timestamp: '2024-07-20T17:35:00Z',
        actor: 'Coordinator — Esty N. [DEMO]',
        actorRole: 'coordinator',
        action: 'Vendor assigned',
        details: 'Reliable Handyman (vendor-3) selected. Handyman allowance eligibility flagged for review.',
      },
      {
        id: 'act-2-4',
        timestamp: '2024-07-21T11:00:00Z',
        actor: 'Vendor — Tom B. (Reliable Handyman) [DEMO]',
        actorRole: 'vendor',
        action: 'Appointment confirmed',
        details: 'July 23, 9:30–11:30am confirmed.',
      },
    ],
  },

  // ── Scenario 3: Unverified caller — unknown property ─────────────────────
  {
    id: 'req-3',
    referenceNumber: 'MM-2024-INQR-009',
    propertyId: '',
    homeownerId: '',
    channel: 'phone',
    issueDescription:
      'Caller reports water dripping from ceiling in hallway. Unable to match to any property in system. Possible new client or mismatch on address.',
    category: 'plumbing',
    urgency: 'urgent',
    urgencyReason:
      'Active water intrusion. Structural damage possible. Escalated for human review — no property match found, identity unverified.',
    status: 'needs_review',
    createdAt: '2024-07-22T19:00:00Z',
    humanResponseDue: '2024-07-23T19:00:00Z',
    assignedCoordinatorId: undefined,
    estimates: [],
    customerUpdates: [
      'We received an inquiry on July 22. A member of our team will call back at the number provided.',
    ],
    isUnverifiedInquiry: true,
    callerCallbackPhone: '(773) 555-0888',
    callerCallbackName: 'James (last name not given)',
    activity: [
      {
        id: 'act-3-1',
        timestamp: '2024-07-22T19:00:00Z',
        actor: 'Receptionist Simulator [DEMO]',
        actorRole: 'receptionist',
        action: 'Unverified inquiry created',
        details:
          'Caller could not be matched to any property. No property history disclosed. Callback info collected. Routed for human review.',
      },
      {
        id: 'act-3-2',
        timestamp: '2024-07-22T19:01:00Z',
        actor: 'System [DEMO]',
        actorRole: 'system',
        action: 'Escalation flag set — human review required',
        details: 'Unverified inquiry with urgent issue. Assigned to on-call coordinator queue.',
      },
    ],
  },

  // ── Scenario 4: Immediate danger escalation ───────────────────────────────
  {
    id: 'req-4',
    referenceNumber: 'MM-2024-0039',
    propertyId: 'prop-1',
    homeownerId: 'ho-1',
    channel: 'phone',
    issueDescription:
      'Homeowner reported a strong gas smell in the basement. Household evacuated. Called 911 and gas company.',
    category: 'other',
    urgency: 'immediate_danger',
    urgencyReason:
      'Caller reported gas odor — possible gas leak. Immediate danger protocol triggered. Homeowner was advised to evacuate and contact 911 and the gas utility immediately. Moda does not provide emergency dispatch.',
    status: 'needs_review',
    createdAt: '2024-07-18T08:30:00Z',
    humanResponseDue: '2024-07-19T08:30:00Z',
    humanRespondedAt: '2024-07-18T08:45:00Z',
    assignedCoordinatorId: 'coord-1',
    estimates: [],
    customerUpdates: [
      'URGENT: We received your report of a gas odor. Please ensure you have evacuated the property and contacted 911 and Peoples Gas (1-866-556-6001) immediately. Your coordinator has been notified.',
    ],
    activity: [
      {
        id: 'act-4-1',
        timestamp: '2024-07-18T08:30:00Z',
        actor: 'Receptionist Simulator [DEMO]',
        actorRole: 'receptionist',
        action: 'Immediate danger protocol triggered',
        details:
          'Gas odor reported. Intake interrupted. Emergency instructions displayed. Human escalation record created immediately.',
      },
      {
        id: 'act-4-2',
        timestamp: '2024-07-18T08:31:00Z',
        actor: 'System [DEMO]',
        actorRole: 'system',
        action: 'On-call coordinator alerted',
        details: 'Sofia M. notified via priority alert. [DEMO — simulated notification]',
      },
      {
        id: 'act-4-3',
        timestamp: '2024-07-18T08:45:00Z',
        actor: 'Coordinator — Sofia M. [DEMO]',
        actorRole: 'coordinator',
        action: 'Human follow-up completed',
        details:
          'Spoke with homeowner. Confirmed evacuation. Gas company on scene. Will follow up once property cleared.',
      },
    ],
  },
];

export const HANDYMAN_ENTRIES: HandymanEntry[] = [
  {
    id: 'hm-1',
    propertyId: 'prop-1',
    serviceRequestId: undefined,
    date: '2024-06-05',
    durationMinutes: 60,
    description: 'Monthly walkthrough handyman hour — light bulb replacements, cabinet hinge adjustment, caulk touch-up in master bath.',
    eligibilityReviewed: true,
    eligibilityApproved: true,
    reviewNotes: 'Qualifies under Premium 2-hour monthly allowance.',
  },
  {
    id: 'hm-2',
    propertyId: 'prop-2',
    serviceRequestId: 'req-2',
    date: '2024-07-23',
    durationMinutes: 120,
    description: 'TV mount + picture frames. Pending coordinator eligibility review — TV mount may fall outside standard handyman scope.',
    eligibilityReviewed: false,
  },
];

export const CONCIERGE_ENTRIES: ConciergeEntry[] = [
  {
    id: 'con-1',
    propertyId: 'prop-1',
    serviceRequestId: 'req-1',
    date: '2024-07-17',
    actualMinutes: 90,
    billableMinutes: 90,
    ratePerHour: 125,
    estimatedCharge: 187.5,
    description: 'On-site coordination during HVAC diagnostic and repair visit.',
    subcontractorCosts: 320,
    notes:
      'Coordinator present full 90 min. Subcontractor cost billed separately per estimate. [PROVISIONAL — based on draft policy]',
  },
];

// ─── Membership Configs ───────────────────────────────────────────────────────

export const MEMBERSHIP_CONFIGS: MembershipConfig[] = [
  {
    tier: 'base',
    monthlyRate: 99,
    handymanMinutesPerMonth: 60,
    inspectionFrequency: 'annual',
    dedicatedContact: false,
  },
  {
    tier: 'premium',
    monthlyRate: 499,
    handymanMinutesPerMonth: 120,
    inspectionFrequency: 'monthly',
    dedicatedContact: true,
  },
];

// ─── Full seed state ──────────────────────────────────────────────────────────

export function buildSeedState(): Omit<AppState, 'demoRole' | 'demoHomeownerId' | 'lastResetAt'> {
  return {
    homeowners: HOMEOWNERS,
    properties: PROPERTIES,
    vendors: VENDORS,
    requests: REQUESTS,
    handymanEntries: HANDYMAN_ENTRIES,
    conciergeEntries: CONCIERGE_ENTRIES,
    coordinators: COORDINATORS,
    membershipConfigs: MEMBERSHIP_CONFIGS,
  };
}
