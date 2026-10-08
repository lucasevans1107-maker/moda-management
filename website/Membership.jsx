(() => {
const { Icon, Wordmark, Eyebrow, ImageFrame, Button, IconButton, Badge, Tag, Avatar, Input, Select, Checkbox, Radio, Switch, Card, Dialog, Tooltip, Toast, Stat, Tabs } = window.Moda;
function Membership({ go }) {
  const rows = [
    ['Walk-through inspection & report', 'Annually', 'Monthly'],
    ['Complimentary handyman care', '1 hour / month', '2 hours / month'],
    ['Point of contact', 'Concierge team', 'One dedicated concierge'],
    ['Response to any request', 'Within 24 hours', 'Within 24 hours'],
    ['Estimates before additional work', true, true],
    ['Custom maintenance plan', true, true],
    ['Pause while you’re away', true, true],
  ];
  const terms = [
    ['How is membership billed?', 'Memberships are annual and billed monthly. They renew automatically at the end of each year; we simply ask for 30 days’ notice before the next payment cycle if you wish to change or end it.'],
    ['Can I pause?', 'Yes. If you’re travelling or the home is closed for a season, your membership can be paused.'],
    ['What happens when something larger is needed?', 'We send a written estimate for your approval. Work begins only once you’ve said yes.'],
    ['What if my concierge needs to meet a trade on site?', 'On-site time beyond your complimentary hours is $125 per hour — a one-hour minimum, then billed in 15-minute increments.'],
  ];
  const [open, setOpen] = React.useState(0);
  const cell = { padding: '22px 0', borderTop: '1px solid var(--border-hairline)', fontSize: 15 };
  return (
    <div>
      <SiteHeader page="membership" go={go} />
      <PageTitle eyebrow="Membership" title={<>One membership.<br /><i>Every detail.</i></>} intro="Choose the rhythm of care that suits your home. Both memberships include access to every Moda service." />
      <Container style={{ paddingBottom: 144 }}><TierCards go={go} /></Container>
      <ImageFrame src={'assets/photos/dining.jpg'} height={560} tone="sand" />
      <section style={{ background: 'var(--porcelain)', borderTop: '1px solid var(--border-hairline)', borderBottom: '1px solid var(--border-hairline)' }}>
        <Container style={{ padding: '120px 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 24 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, paddingBottom: 24 }}>Compare</div>
            {['Essential · $99', 'Signature · $499'].map(h => <div key={h} style={{ fontSize: 11, letterSpacing: '0.22em', fontWeight: 500, textTransform: 'uppercase', alignSelf: 'end', paddingBottom: 24, color: 'var(--bronze-700)' }}>{h}</div>)}
            {rows.map(r => r.map((c, i) => <div key={r[0] + i} style={{ ...cell, color: i ? 'var(--ink)' : 'var(--taupe)' }}>{c === true ? <Icon name="check" size={17} color="var(--bronze-500)" /> : c}</div>))}
          </div>
        </Container>
      </section>
      <Container style={{ padding: '144px 48px', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 96 }}>
        <div><Eyebrow>The fine print</Eyebrow><h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 56, lineHeight: 1.05, margin: '24px 0 0' }}>Clear terms,<br /><i>kindly kept.</i></h2></div>
        <div>
          {terms.map(([q, a], i) => (
            <div key={q} style={{ borderTop: '1px solid var(--border-hairline)' }}>
              <div onClick={() => setOpen(open === i ? -1 : i)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 0', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 26 }}>
                {q}<Icon name={open === i ? 'minus' : 'plus'} size={18} />
              </div>
              {open === i ? <p className="mrise" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--taupe)', margin: '0 0 28px', maxWidth: 560 }}>{a}</p> : null}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
Object.assign(window, { Membership });
})();
