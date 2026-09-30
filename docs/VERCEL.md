# Deploy Moda as two Vercel projects

The repository contains two independent apps. Keep the current CRM project at the repository root. Import the same repository again for the public website, selecting `website` as its Root Directory.

| Setting | Existing CRM | Public website |
|---|---|---|
| Root Directory | `.` (repository root) | `website` |
| Framework Preset | Vite | Vite |
| Install Command | `npm ci` | `npm ci` |
| Build Command | `npm run build` | `npm run build` |
| Output Directory | `dist` | `dist` |
| Suggested project name | Existing project | `moda-management-website` |

Each directory includes its own vercel.json. The CRM includes an SPA fallback for direct client/request URLs. The public site is a standalone single page with anchor navigation and has no CRM routes, demo records, store, or role switcher in its bundle. Its dependencies and lockfile are self-contained. Do not set the public project's Root Directory to the repository root.

## Connect the consultation action

Set either of these public build-time environment variables on the **website project**, for both Preview and Production as needed, then redeploy:

- `VITE_CONSULTATION_URL`: approved HTTPS booking/contact URL (preferred).
- `VITE_CONTACT_EMAIL`: approved business email, used as a mailto fallback.

If neither is set, the contact section accurately says booking is opening soon. No fake form submissions are shown. The site stores no lead data and sends no messages automatically. A hosted booking page is preferred if no email client is configured on the visitor's device.

VITE_ values are bundled in browser code. Never put API keys or private values there.

## Preview and production

Import the GitHub branch `codex/warm-atelier-site` for a preview, or merge the PR and deploy `main`. The existing Vercel Git integration may automatically create a CRM preview when the branch is pushed. Creating a second public website project still requires the Vercel account/project setup.

Use separate domains for the public website and internal CRM. The existing CRM is still a localStorage prototype, and its role switcher is not authentication. This change does not make it production-secure. Noindex headers reduce indexing; they do not restrict access. Real client data requires authenticated server-side access controls before use.

## Content before launch

Confirm the proposed $99/$499 membership pricing and terms with Moda. The brief is from 2024 and contains a Base inspection cadence conflict; the website uses the explicit annual inspection inclusion and never promises a monthly Base inspection. Photography is generated concept imagery, not a completed Moda project. No customer testimonials, licenses or certifications are invented.

Official references: https://vercel.com/docs/frameworks/frontend/vite and https://vercel.com/docs/project-configuration/vercel-json
