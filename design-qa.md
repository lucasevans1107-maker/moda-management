# Warm Atelier design QA

Status: passed. Reviewed 30 September 2026 against the selected option 3 Warm Atelier reference.

The implementation carries the reference's espresso canvas, walnut surfaces, sand actions, cream typography, serif headings and restrained dividers into the existing CRM and standalone website. CRM content remains the repository's existing operational data; the reference's illustrative records are not substituted. Client detail prioritizes communication and next service while retaining contact, membership, property and service history workflows.

## Evidence

- [CRM desktop](docs/qa/crm.png)
- [Website desktop](docs/qa/website.png)
- [CRM at 390px width](docs/qa/crm-mobile.png)
- [Website at 390px width](docs/qa/website-mobile.png)

Desktop screenshots were compared side by side with the selected design. Mobile checks used a 390 × 844 iframe viewport, not device emulation. No outstanding actionable P0/P1/P2 visual issues found in the reviewed screens.

## Verification

- CRM production build and standalone website production build pass.
- Existing domain tests pass: Central Time month boundaries, membership tenure, future confirmed services, contact isolation and provider preferences.
- CRM client search, client detail navigation and receptionist SMS filter checked in browser.
- Public membership navigation, FAQ disclosure and mobile menu expand/collapse checked in browser.
- No application-origin browser console errors observed.
- Locally hosted fonts resolve in the production build.

## Delivery limits

The CRM retains its existing local demo persistence and role switcher; this change does not add production authentication or a backend. The public website builds separately and imports no CRM records. Consultation booking intentionally shows an opening-soon message until a real URL or contact email is configured. See [Vercel setup](docs/VERCEL.md).
