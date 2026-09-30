# Moda Management — Prototype

Residential home-management and concierge service operations dashboard.
Built for demonstration on **October 1, 2024**.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- React Router v7
- Zustand v5 (with localStorage persistence)
- date-fns + date-fns-tz (all times displayed in America/Chicago)

## Demo Notes

**Local persistence** — all data is saved to `localStorage` under `moda-demo-storage`. Refresh preserves the demo state.

**Role switching** — use the sidebar toggle to switch between Coordinator View and Homeowner Preview. This is a UI demo aid — it is not authentication or access control.

**Reset** — go to Settings → Demo Info → Reset Demo Data to restore all seed records.

## Demo Script (5 minutes)

### 1. Overview dashboard (~30 sec)
- Open the app. Overview shows active requests, overdue counts, and recent activity.
- Point out the 24-hour response deadline tracking and overdue highlights.

### 2. Primary workflow — AC not cooling (~2 min)
- Click Requests → MM-2024-0041 (Claire Ashworth, HVAC).
- Walk through the completed workflow:
  - Issue captured via receptionist intake (phone)
  - Prior HVAC service history retrieved from property record
  - Arctic Comfort HVAC recommended (preferred vendor + prior property work + trade match)
  - Coordinator approved vendor assignment
  - Outreach draft prepared (labeled DEMO — not sent)
  - Estimate recorded → homeowner approved
  - Appointment requested → vendor explicitly confirmed (separate steps)
  - Service completed, notes recorded, history updated

### 3. Receptionist Simulator (~1 min)
- Click Receptionist.
- Walk through guided intake as Claire Ashworth (Premium member).
- Show identity verification step (simulated, explicitly labeled).
- Submit a new issue — watch it appear on the dashboard instantly.
- Then try the "unknown caller" path — show that property history is never exposed before verification.

### 4. Unverified inquiry and urgency escalation (~30 sec)
- Show MM-2024-INQR-009 — unknown caller, water dripping, no property match, routed for human review.
- Show MM-2024-0039 — immediate danger (gas smell), emergency instructions displayed, no dispatch offered.

### 5. Base member / handyman allowance (~30 sec)
- Open Properties → 2239 W. Roscoe St (Marcus Delgado, Base).
- Show handyman usage tracking, allowance progress, and eligibility review flag.

### 6. Settings / Integration Docs (~30 sec)
- Settings → Integration Docs: JSON contracts for n8n / voice integration.
- Settings → Business Policies: confirmed vs provisional items, flagged ambiguities.

## Simulated vs Connected Functionality

| Feature | This Demo | Production |
|---------|-----------|------------|
| Data persistence | Browser localStorage | Server database |
| Vendor outreach | Draft only (labeled DEMO, not sent) | Authenticated email/SMS via server |
| Homeowner verification | Simulated button | Server-side auth / PIN / identity check |
| Automated acknowledgment | Simulated | Triggered via n8n / server |
| Role switching | UI toggle (no auth) | Authenticated session with RBAC |
| n8n integration | Contracts documented, adapter stubbed | Live webhooks via authenticated server |
| Voice agent | Architecture documented | Twilio/Retell → n8n → server → DB |
| Push notifications | Not implemented | Server-sent events or polling |

## Business Policies Requiring Moda Confirmation

1. **Base inspection frequency** — document says "annual" in one place and "monthly" alongside handyman in another. Do not automate inspection scheduling until confirmed.
2. **Handyman overage rate** — not established. Flag for coordinator review when allowance exceeded.
3. **Allowance rollover** — not established. Assume no rollover until confirmed.
4. **Emergency coverage** — Moda's scope during emergencies is not defined. Intake directs callers to 911 / utilities; Moda does not dispatch.
5. **Cancellation / pause terms** — draft mentions 30-day notice; exact application unclear. Binding rules not implemented.
6. **Vendor availability guarantees** — not established. All vendor availability treated as "not confirmed" unless explicitly set.
7. **Subcontractor costs** — labeled separately from the $125/hr concierge rate. Never implied as included.

## Integration Architecture

```
Voice Platform (Twilio / Retell)
         │
         ▼
   Authenticated Server / n8n Workflow
         │
         ▼
   Shared Database (Supabase / PlanetScale)
         │
         ▼
   Dashboard (this app, reading from DB)
```

Browser localStorage cannot receive real-time updates from n8n.
The integration adapter in `src/integrations/contracts.ts` documents JSON contracts and can be replaced with HTTP calls when a backend is available.

## Acceptance Criteria

- [x] Simulated intake creates a persisted request (visible after refresh)
- [x] Correct property and history are linked
- [x] Unverified callers cannot access property history
- [x] Vendor recommendations explain their basis (trade, area, prior work, preference)
- [x] Automated acknowledgment does not satisfy human response tracking
- [x] Additional paid work requires estimate approval before work proceeds
- [x] Changed estimates supersede previous approval and require renewed approval
- [x] Appointment requests remain "requested" until vendor explicitly confirms
- [x] Handyman and concierge time tracked separately
- [x] Concierge billing: 45 min → $125, 70 min → $156.25, 90 min → $187.50
- [x] Duplicate events do not create duplicate requests (idempotency key)
- [x] Homeowner preview excludes internal information
- [x] Refresh preserves demo (localStorage persistence)
- [x] Reset Demo works with confirmation dialog
