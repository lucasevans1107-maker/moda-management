import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState,
  ServiceRequest,
  EstimateRecord,
  ActivityEntry,
  HandymanEntry,
  ConciergeEntry,
  RequestStatus,
  VendorOutreachDraft,
  AppointmentRequest,
  AppointmentConfirmation,
} from '../types';
import { VALID_TRANSITIONS } from '../types';
import { buildSeedState } from '../data/seed';

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function generateRefNumber(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `MM-${year}-${num}`;
}

interface StoreActions {
  // Demo controls
  setDemoRole: (role: 'coordinator' | 'homeowner') => void;
  setDemoHomeownerId: (id: string | undefined) => void;
  resetDemo: () => void;

  // Requests
  createRequest: (data: Omit<ServiceRequest, 'id' | 'referenceNumber' | 'activity' | 'customerUpdates' | 'estimates'>) => ServiceRequest;
  updateRequestStatus: (requestId: string, newStatus: RequestStatus, actor: string, details?: string) => boolean;
  addActivity: (requestId: string, entry: Omit<ActivityEntry, 'id'>) => void;
  setHumanResponded: (requestId: string, actor: string) => void;
  assignVendor: (requestId: string, vendorId: string, actor: string) => void;
  setOutreachDraft: (requestId: string, draft: VendorOutreachDraft) => void;
  addEstimate: (requestId: string, estimate: Omit<EstimateRecord, 'id' | 'version'>) => void;
  approveEstimate: (requestId: string, estimateId: string, approvedBy: string) => void;
  rejectEstimate: (requestId: string, estimateId: string, reason: string) => void;
  setAppointmentRequest: (requestId: string, appt: AppointmentRequest, actor: string) => void;
  confirmAppointment: (requestId: string, confirmation: AppointmentConfirmation) => void;
  completeRequest: (requestId: string, notes: string, actor: string) => void;
  addCustomerUpdate: (requestId: string, message: string) => void;

  // Time tracking
  addHandymanEntry: (entry: Omit<HandymanEntry, 'id'>) => void;
  addConciergeEntry: (entry: Omit<ConciergeEntry, 'id'>) => void;
}

type Store = AppState & StoreActions;

const SEED = buildSeedState();
const INITIAL_STATE: AppState = {
  ...SEED,
  demoRole: 'coordinator',
  demoHomeownerId: undefined,
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setDemoRole: (role) => set({ demoRole: role }),
      setDemoHomeownerId: (id) => set({ demoHomeownerId: id }),

      resetDemo: () =>
        set({
          ...buildSeedState(),
          demoRole: 'coordinator',
          demoHomeownerId: undefined,
          lastResetAt: new Date().toISOString(),
        }),

      createRequest: (data) => {
        const newReq: ServiceRequest = {
          ...data,
          id: generateId('req'),
          referenceNumber: generateRefNumber(),
          estimates: [],
          customerUpdates: [],
          activity: [
            {
              id: generateId('act'),
              timestamp: new Date().toISOString(),
              actor: 'System [DEMO]',
              actorRole: 'system',
              action: 'Request created',
              details: `Via ${data.channel} intake. Urgency: ${data.urgency}.`,
            },
          ],
        };
        set((state) => ({ requests: [...state.requests, newReq] }));
        return newReq;
      },

      updateRequestStatus: (requestId, newStatus, actor, details) => {
        const state = get();
        const req = state.requests.find((r) => r.id === requestId);
        if (!req) return false;
        if (!VALID_TRANSITIONS[req.status].includes(newStatus)) return false;

        const activityEntry: ActivityEntry = {
          id: generateId('act'),
          timestamp: new Date().toISOString(),
          actor,
          actorRole: 'coordinator',
          action: `Status changed to ${newStatus.replace(/_/g, ' ')}`,
          details,
        };

        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? { ...r, status: newStatus, activity: [...r.activity, activityEntry] }
              : r
          ),
        }));
        return true;
      },

      addActivity: (requestId, entry) => {
        const actEntry: ActivityEntry = { ...entry, id: generateId('act') };
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId ? { ...r, activity: [...r.activity, actEntry] } : r
          ),
        }));
      },

      setHumanResponded: (requestId, actor) => {
        const now = new Date().toISOString();
        const actEntry: ActivityEntry = {
          id: generateId('act'),
          timestamp: now,
          actor,
          actorRole: 'coordinator',
          action: 'Human response recorded',
          details: 'Response deadline satisfied.',
        };
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? { ...r, humanRespondedAt: now, activity: [...r.activity, actEntry] }
              : r
          ),
        }));
      },

      assignVendor: (requestId, vendorId, actor) => {
        const now = new Date().toISOString();
        const actEntry: ActivityEntry = {
          id: generateId('act'),
          timestamp: now,
          actor,
          actorRole: 'coordinator',
          action: 'Vendor assignment approved',
          details: `Vendor ID: ${vendorId}`,
        };
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  vendorAssignment: { vendorId, approvedBy: actor, approvedAt: now },
                  activity: [...r.activity, actEntry],
                }
              : r
          ),
        }));
      },

      setOutreachDraft: (requestId, draft) => {
        const actEntry: ActivityEntry = {
          id: generateId('act'),
          timestamp: new Date().toISOString(),
          actor: draft.preparedBy,
          actorRole: 'coordinator',
          action: 'Vendor outreach draft prepared',
          details: 'Draft ready. Not sent. Standalone demo mode.',
        };
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? { ...r, outreachDraft: draft, activity: [...r.activity, actEntry] }
              : r
          ),
        }));
      },

      addEstimate: (requestId, estimateData) => {
        const state = get();
        const req = state.requests.find((r) => r.id === requestId);
        if (!req) return;

        const version = req.estimates.length + 1;
        // Supersede previous pending estimate
        const updatedEstimates = req.estimates.map((e) =>
          e.approvalStatus === 'pending' ? { ...e, approvalStatus: 'superseded' as const } : e
        );
        const newEst: EstimateRecord = {
          ...estimateData,
          id: generateId('est'),
          version,
          approvalStatus: 'pending',
        };
        const actEntry: ActivityEntry = {
          id: generateId('act'),
          timestamp: new Date().toISOString(),
          actor: estimateData.preparedBy,
          actorRole: 'coordinator',
          action: `Estimate v${version} added`,
          details: `$${estimateData.amount.toFixed(2)} — ${estimateData.scope}`,
        };
        set((s) => ({
          requests: s.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  estimates: [...updatedEstimates, newEst],
                  status: 'awaiting_homeowner_approval' as RequestStatus,
                  activity: [...r.activity, actEntry],
                }
              : r
          ),
        }));
      },

      approveEstimate: (requestId, estimateId, approvedBy) => {
        const now = new Date().toISOString();
        const actEntry: ActivityEntry = {
          id: generateId('act'),
          timestamp: now,
          actor: approvedBy,
          actorRole: 'homeowner',
          action: 'Estimate approved by homeowner',
        };
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  estimates: r.estimates.map((e) =>
                    e.id === estimateId
                      ? { ...e, approvalStatus: 'approved' as const, approvedBy, approvedAt: now }
                      : e
                  ),
                  status: 'ready_to_coordinate' as RequestStatus,
                  activity: [...r.activity, actEntry],
                }
              : r
          ),
        }));
      },

      rejectEstimate: (requestId, estimateId, reason) => {
        const actEntry: ActivityEntry = {
          id: generateId('act'),
          timestamp: new Date().toISOString(),
          actor: 'Homeowner [DEMO]',
          actorRole: 'homeowner',
          action: 'Estimate rejected by homeowner',
          details: reason,
        };
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  estimates: r.estimates.map((e) =>
                    e.id === estimateId
                      ? { ...e, approvalStatus: 'rejected' as const, rejectedReason: reason }
                      : e
                  ),
                  status: 'awaiting_estimate' as RequestStatus,
                  activity: [...r.activity, actEntry],
                }
              : r
          ),
        }));
      },

      setAppointmentRequest: (requestId, appt, actor) => {
        const actEntry: ActivityEntry = {
          id: generateId('act'),
          timestamp: new Date().toISOString(),
          actor,
          actorRole: 'coordinator',
          action: 'Appointment request sent to vendor',
          details: `Window: ${appt.requestedWindowStart} – ${appt.requestedWindowEnd}`,
        };
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  appointmentRequest: appt,
                  status: 'scheduling_requested' as RequestStatus,
                  activity: [...r.activity, actEntry],
                }
              : r
          ),
        }));
      },

      confirmAppointment: (requestId, confirmation) => {
        const actEntry: ActivityEntry = {
          id: generateId('act'),
          timestamp: new Date().toISOString(),
          actor: confirmation.confirmedBy,
          actorRole: 'vendor',
          action: 'Appointment confirmed by vendor',
          details: `Scheduled: ${confirmation.scheduledStart} – ${confirmation.scheduledEnd}`,
        };
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  appointmentConfirmation: confirmation,
                  status: 'scheduled' as RequestStatus,
                  activity: [...r.activity, actEntry],
                }
              : r
          ),
        }));
      },

      completeRequest: (requestId, notes, actor) => {
        const now = new Date().toISOString();
        const actEntry: ActivityEntry = {
          id: generateId('act'),
          timestamp: now,
          actor,
          actorRole: 'coordinator',
          action: 'Request marked complete',
          details: notes,
        };
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  status: 'completed' as RequestStatus,
                  completionNotes: notes,
                  completedAt: now,
                  activity: [...r.activity, actEntry],
                }
              : r
          ),
        }));
      },

      addCustomerUpdate: (requestId, message) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? { ...r, customerUpdates: [...r.customerUpdates, message] }
              : r
          ),
        }));
      },

      addHandymanEntry: (entry) => {
        const newEntry: HandymanEntry = { ...entry, id: generateId('hm') };
        set((state) => ({ handymanEntries: [...state.handymanEntries, newEntry] }));
      },

      addConciergeEntry: (entry) => {
        const newEntry: ConciergeEntry = { ...entry, id: generateId('con') };
        set((state) => ({ conciergeEntries: [...state.conciergeEntries, newEntry] }));
      },
    }),
    {
      name: 'moda-demo-storage',
      version: 1,
    }
  )
);

// ─── Selectors ────────────────────────────────────────────────────────────────

export function useRequest(id: string) {
  return useStore((s) => s.requests.find((r) => r.id === id));
}

export function useProperty(id: string) {
  return useStore((s) => s.properties.find((p) => p.id === id));
}

export function useHomeowner(id: string) {
  return useStore((s) => s.homeowners.find((h) => h.id === id));
}

export function useVendor(id: string) {
  return useStore((s) => s.vendors.find((v) => v.id === id));
}

export function useHandymanUsageForProperty(propertyId: string, periodStart: Date, periodEnd: Date) {
  return useStore((s) =>
    s.handymanEntries.filter((e) => {
      if (e.propertyId !== propertyId) return false;
      const d = new Date(e.date);
      return d >= periodStart && d <= periodEnd;
    })
  );
}
