# Moda Management — Warm Atelier

Selected direction: option 3, September 30, 2026. Applies to the marketing website and internal client-care app.

## Foundations
| Token | Value | Role |
|---|---|---|
| Espresso | #211C19 | Canvas |
| Walnut | #302823 | Selected and elevated surfaces |
| Parchment | #F1E8DA | Primary text |
| Sand | #C9AE88 | Primary actions and brand emphasis; dark text on fill |
| Olive | #A9B292 | Positive status with text label |
| Muted | #BDB4A9 | Secondary text |
| Line | #51463B | Decorative dividers |

Libre Baskerville regular: editorial titles, 64–72px desktop hero, 48px mobile hero, 36px page titles, 23px section headings. DM Sans 400/500: UI and body, 14–16px. Small metadata 12px; short decorative uppercase eyebrows 10px with 2.8px tracking. No uppercase paragraphs.

8px base spacing; 16/24/32/48/64/96px hierarchy. 6px controls, 1px rules, restrained surfaces. Avoid nested cards. Primary sand button with Espresso text; secondary transparent outline. Minimum 44px control height. Focus ring 2px Sand, offset 4px. Every input has a persistent label. Status includes text, not color alone. Motion respects reduced-motion settings.

## Website
Warm architectural interior photography with calm composition, travertine and walnut. Editable headline: “A home well cared for. A life well lived.” Website navigation leads to Services, Membership and a consultation form. Annual membership prices and inclusions are proposals from the 2024 brainstorm, not verified current offers. Base: $99/month, annual inspection, one handyman hour/month. Premium: $499/month, monthly inspection, two handyman hours/month, consistent contact. Extra work quoted and approved before work starts. Do not promise priority scheduling or other unsupported benefits.

## Internal app
Dashboard → Clients → client record. Record exposes last contact, next service, member since, tenure, timeline and assigned providers. The Requests workflow retains existing service scheduling and estimate approval. Receptionist is an activity log for calls/SMS/emails, not an interface for talking to a bot. Existing demo records only; no backend, authentication or phone integrations. The CRM preserves its existing localStorage persistence. Demo dates anchored September 30, 2026.

## Responsive behavior
Desktop app uses a narrow left rail and two-column client detail. At 760px or below the rail becomes a compact horizontal navigation and details stack. Website plans and service sections stack. Tables retain horizontal scrolling. Never shrink operational text to fit a desktop layout on mobile.

## Open product decisions
The source Base plan inconsistently mentions annual inspection and a monthly walkthrough. Preview uses the explicit annual inspection inclusion; monthly Base inspection is not promised. Response target in the brief is 24 hours, not an emergency response guarantee. Confirm renewal, pause, cancellation and concierge hourly terms before publication.

## Preview scope
Website and CRM are independently deployable builds. CRM workflows operate locally; the public consultation CTA opens an approved configured booking URL or mailto address. The generated interior asset is included. Photography is AI-generated concept imagery, not a completed Moda project.

## Repository integration
Shared CSS source of truth is `website/src/tokens.css`, imported by the existing CRM stylesheet and the standalone website. CRM uses semantic Tailwind tokens (canvas/surface/raised/line/ink/muted/accent/olive); existing Lucide icons are retained for continuity. Client history uses real existing demo records, not the mock Bennett data. Existing workflows, localStorage and policies are preserved. Public site has its own package.json, lockfile, Vite config and Vercel config. There is no preview toolbar in either production build.
