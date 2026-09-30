import { useState } from "react";
import { ArrowRight, ArrowUpRight, Menu, X, Plus } from "lucide-react";
const rawBooking = import.meta.env.VITE_CONSULTATION_URL?.trim();
const booking =
  rawBooking && /^https:\/\//i.test(rawBooking) ? rawBooking : null;
const rawEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim();
const email =
  rawEmail && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(rawEmail)
    ? rawEmail
    : null;
const contactHref =
  booking ||
  (email ? `mailto:${email}?subject=Moda%20Management%20consultation` : null);
const copyrightYear = new Date().getFullYear();
function Brand() {
  return (
    <a href="#home" className="brand" aria-label="Moda Management home">
      MODA<small>MANAGEMENT</small>
    </a>
  );
}
function CTA({ children = "Schedule a consultation", secondary = false }) {
  return (
    <a className={`button ${secondary ? "secondary" : ""}`} href="#contact">
      {children}
      <ArrowRight size={19} />
    </a>
  );
}
const faqs = [
  [
    "What does membership include?",
    "Base includes an annual home inspection and one hour of minor handyman service each month. Premium includes monthly inspections, two monthly handyman hours, and a consistent point of contact. We confirm the membership details with you before enrollment.",
  ],
  [
    "How is additional work handled?",
    "Services beyond your membership are quoted separately. You receive an estimate for approval before work begins. We then coordinate the appropriate provider and keep you informed.",
  ],
  [
    "Who carries out the work?",
    "Moda coordinates home care with specialist service providers and subcontractors. Your concierge helps manage visits and communication.",
  ],
  [
    "How quickly will Moda respond?",
    "Our planned response window is within 24 hours of a home-care request. Moda is not an emergency-response service. For immediate danger, contact emergency services.",
  ],
];
export default function App() {
  const [menu, setMenu] = useState(false);
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header id="home" className="webnav">
        <Brand />
        <nav
          id="mobile-navigation"
          aria-label="Main navigation"
          className={menu ? "open" : ""}
        >
          <a href="#services" onClick={() => setMenu(false)}>
            Services
          </a>
          <a href="#membership" onClick={() => setMenu(false)}>
            Membership
          </a>
          <a href="#approach" onClick={() => setMenu(false)}>
            Our approach
          </a>
          <a href="#contact" onClick={() => setMenu(false)}>
            Contact
          </a>
        </nav>
        <a className="nav-cta" href="#contact">
          Let’s care for your home <ArrowUpRight size={18} />
        </a>
        <button
          className="menu-toggle"
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          aria-controls="mobile-navigation"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <main id="main">
        <section className="hero">
          <img
            src="/images/moda-interior.webp"
            width="1536"
            height="1024"
            fetchPriority="high"
            alt="Warm living room with a travertine fireplace, walnut shelving and considered furnishings"
          />
          <div className="hero-shade" />
          <div className="hero-copy">
            <p className="eyebrow">PRIVATE HOMES. THOUGHTFUL CARE.</p>
            <h1>
              A home well
              <br />
              cared for.
              <br />A life well lived.
            </h1>
            <p>
              Proactive home care, trusted providers,
              <br className="desktop" /> and a concierge approach to
              maintenance,
              <br className="desktop" /> renovations, and every detail in
              between.
            </p>
            <CTA>Discover Moda</CTA>
          </div>
          <div className="hero-foot">
            <span>
              CONSIDERED CARE, FROM THE EVERYDAY TO THE EXTRAORDINARY.
            </span>
            <span>HOME MANAGEMENT · DALLAS</span>
          </div>
        </section>
        <section className="membership" id="membership">
          <div className="section-label">
            <p className="eyebrow">THE MODA MEMBERSHIP</p>
            <span>A more considered way to care for home.</span>
          </div>
          <div className="plans">
            {[
              [
                "Base",
                "$99",
                [
                  "Annual home inspection",
                  "1 handyman hour per month",
                  "Access to Moda services",
                ],
              ],
              [
                "Premium",
                "$499",
                [
                  "Monthly home inspection",
                  "2 handyman hours per month",
                  "One consistent point of contact",
                ],
              ],
            ].map(([name, price, features]) => (
              <article className="plan" key={name}>
                <div>
                  <h2>{name}</h2>
                  <p className="price">
                    {price}
                    <small>/month</small>
                  </p>
                </div>
                <ul>
                  {features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="circle-button"
                  aria-label={`Discuss ${name} membership`}
                >
                  <ArrowRight size={20} />
                </a>
              </article>
            ))}
          </div>
          <p className="fine">
            Membership outline. Annual commitment; additional work quoted
            separately. Confirm pricing, inclusions and terms during your
            consultation.
          </p>
        </section>
        <section className="care" id="services">
          <div>
            <p className="eyebrow">ONE HOME. EVERY DETAIL.</p>
            <h2>
              Time for what
              <br />
              matters most.
            </h2>
            <p>
              Your home should be a place to enjoy. We help coordinate its care,
              from the small things that need attention to the improvements
              you’ve been imagining.
            </p>
            <CTA secondary>Explore your home’s needs</CTA>
          </div>
          <div className="service-list">
            {[
              [
                "01",
                "Preventative care",
                "Regular inspections and thoughtful maintenance planning, with your home’s needs in view.",
              ],
              [
                "02",
                "Home repairs",
                "Minor handyman work and coordination with specialist providers for larger repairs.",
              ],
              [
                "03",
                "Renovations",
                "A considered approach to estimates, provider coordination and your next home project.",
              ],
            ].map(([n, t, d]) => (
              <article key={n}>
                <span>{n}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="approach" id="approach">
          <div className="approach-title">
            <p className="eyebrow">PERSONAL ATTENTION. CLEAR NEXT STEPS.</p>
            <h2>
              Considered from
              <br />
              the beginning.
            </h2>
          </div>
          <div className="steps">
            {[
              [
                "01",
                "We get to know your home.",
                "We listen to your priorities and discuss the care your home needs.",
              ],
              [
                "02",
                "You stay in control.",
                "A clear estimate comes first. Additional work starts with your approval.",
              ],
              [
                "03",
                "We coordinate the details.",
                "Your concierge helps organize providers, visits and updates.",
              ],
            ].map(([n, t, d]) => (
              <article key={n}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="questions">
          <div>
            <p className="eyebrow">A FEW THOUGHTFUL ANSWERS</p>
            <h2>Before we begin.</h2>
          </div>
          <div>
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <Plus size={18} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="contact" id="contact">
          <p className="eyebrow">MAKE ROOM FOR LIVING.</p>
          <h2>
            Let us take care
            <br />
            of the details.
          </h2>
          <p>
            Tell us about your home and what would make life a little easier.
          </p>
          {contactHref ? (
            <a
              className="button"
              href={contactHref}
              {...(booking
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              Schedule a consultation
              <ArrowUpRight size={19} />
            </a>
          ) : (
            <p className="contact-pending" role="status">
              Consultation booking is opening soon.
              <br />
              Please check back for availability.
            </p>
          )}
          {email && (
            <a className="contact-email" href={`mailto:${email}`}>
              {email}
            </a>
          )}
        </section>
      </main>
      <footer>
        <Brand />
        <p>Thoughtful care. Beautiful living.</p>
        <small>© {copyrightYear} Moda Management</small>
      </footer>
    </>
  );
}
