(() => {
const { Icon, Wordmark, Eyebrow, ImageFrame, Button, IconButton, Badge, Tag, Avatar, Input, Select, Checkbox, Radio, Switch, Card, Dialog, Tooltip, Toast, Stat, Tabs } = window.Moda;
const H2 = ({ children, style }) => <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 60, lineHeight: 1.05, margin: 0, letterSpacing: '-0.01em', textWrap: 'balance', ...style }}>{children}</h2>;
function Home({ go }) {
  const pillars = [
    ['01', 'The walk-through', 'A considered inspection of your home — monthly or annually — with a written report. You decide what we quote.', 'kitchen-island.jpg', 'linen'],
    ['02', 'A dedicated concierge', 'One point of contact and one team who know your home, your trades and your preferences.', 'living-pendants.jpg', 'sand'],
    ['03', 'White-glove handyman', 'Complimentary hours each month for the small things — hung, mounted, adjusted, replaced.', 'tools.jpg', 'umber'],
  ];
  const handy = ['Adjusting hinges', 'Assembling furniture', 'Window treatments', 'Mounting artwork or TV', 'Replacing small hardware', 'Installing blinds', 'Changing light bulbs', 'Replacing air filters'];
  const steps = [['Consultation', 'We meet you at home and listen.'], ['First walk-through', 'Every room, system and surface, noted.'], ['Report & estimates', 'You choose what we quote. Nothing begins without approval.'], ['Ongoing care', 'Scheduled visits, seasonal maintenance, one call for anything.']];
  return (
    <div>
      <section style={{ position: 'relative' }}>
        <SiteHeader page="home" go={go} overlay />
        <ImageFrame tone="umber" height={880} src={'assets/photos/living-golden.jpg'} label="Hero · living room at golden hour">
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(23,18,14,0.78) 0%, rgba(23,18,14,0.35) 55%, rgba(23,18,14,0.1) 100%), linear-gradient(180deg, rgba(23,18,14,0.45) 0%, transparent 25%)' }}></div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
            <Container style={{ paddingBottom: 72 }}>
              <div className="mrise" style={{ maxWidth: 980, color: 'var(--ivory)' }}>
                <Eyebrow tone="ivory">Private home management</Eyebrow>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 112, lineHeight: 0.98, letterSpacing: '-0.015em', margin: '28px 0 32px' }}>The art of a<br /><i style={{ fontWeight: 300 }}>well-kept</i> home.</h1>
                <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--sand)', maxWidth: 540, margin: '0 0 40px' }}>A membership for homeowners who would rather live in their home than manage it. Inspections, a dedicated concierge and white-glove care — handled.</p>
                <div style={{ display: 'flex', gap: 14 }}>
                  <Button variant="accent" size="l" iconRight="arrow-right" onClick={() => go('contact')}>Request a consultation</Button>
                  <Button variant="inverse" size="l" onClick={() => go('membership')}>View membership</Button>
                </div>
              </div>
            </Container>
          </div>
        </ImageFrame>
      </section>

      <Container style={{ padding: '160px 48px', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 96, alignItems: 'end' }}>
        <H2>Owning a beautiful home shouldn’t feel like a second job.</H2>
        <div>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--taupe)', margin: '0 0 28px' }}>We look after the details others overlook — and coordinate the trades when something larger is needed. Every request answered within 24 hours. Every additional job estimated first.</p>
          <Button variant="link" iconRight="arrow-right" onClick={() => go('services')}>Our approach</Button>
        </div>
      </Container>

      <Container style={{ paddingBottom: 160 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 32 }}>
          {pillars.map(([n, t, d, l, tone], i) => (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: 28, marginTop: i === 1 ? 80 : 0 }}>
              <ImageFrame src={'assets/photos/' + l} ratio="4 / 5" tone={tone} />
              <div style={{ display: 'flex', gap: 20 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--bronze-500)', fontStyle: 'italic' }}>{n}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, lineHeight: 1.1, marginBottom: 12 }}>{t}</div>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--taupe)', margin: 0 }}>{d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <section style={{ background: 'var(--linen)' }}>
        <Container style={{ padding: '144px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, gap: 48 }}>
            <div><Eyebrow>Membership</Eyebrow><H2 style={{ marginTop: 24 }}>Two ways to be looked after.</H2></div>
            <p style={{ fontSize: 15, color: 'var(--taupe)', maxWidth: 360, margin: 0 }}>Annual memberships, billed monthly. Pause whenever you’re away.</p>
          </div>
          <TierCards go={go} />
        </Container>
      </section>

      <Container style={{ padding: '160px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, alignItems: 'center' }}>
        <ImageFrame src={'assets/photos/armchair.jpg'} ratio="4 / 5" tone="sand" />
        <div>
          <Eyebrow>White-glove handyman</Eyebrow>
          <H2 style={{ margin: '24px 0 24px' }}>The small things, <i>done properly.</i></H2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--taupe)', margin: '0 0 40px', maxWidth: 480 }}>Your complimentary hours arrive with each walk-through, with your concierge on site throughout.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 40 }}>
            {handy.map(h => <div key={h} style={{ padding: '16px 0', borderTop: '1px solid var(--border-hairline)', fontSize: 15, display: 'flex', justifyContent: 'space-between' }}>{h}<span style={{ color: 'var(--bronze-300)' }}>—</span></div>)}
          </div>
        </div>
      </Container>

      <section data-theme="light" style={{ background: 'var(--night)', color: 'var(--ivory)' }}>
        <Container style={{ padding: '144px 48px' }}>
          <Eyebrow tone="ivory">How it works</Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 0, marginTop: 64 }}>
            {steps.map(([t, d], i) => (
              <div key={t} style={{ padding: '0 32px 0 0', marginRight: 32, borderRight: i < 3 ? '1px solid var(--border-inverse)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 300, color: 'var(--bronze-300)', lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: '32px 0 12px' }}>{t}</div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--oat)', margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <ImageFrame src={'assets/photos/exterior-garden.jpg'} height={760} tone="umber">
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(28,26,23,0.5)' }}></div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--ivory)', padding: '0 48px' }}>
          <Eyebrow tone="ivory" rule={false}>Begin</Eyebrow>
          <H2 style={{ fontSize: 76, margin: '28px 0 40px', maxWidth: 900 }}>Let us take care of the house, <i>so you can enjoy the home.</i></H2>
          <Button size="l" variant="accent" iconRight="arrow-right" onClick={() => go('contact')}>Request a consultation</Button>
        </div>
      </ImageFrame>
    </div>
  );
}
function TierCards({ go }) {
  const tiers = [
    { name: 'Essential', price: 99, dark: false, lead: 'Thoughtful oversight for a well-run home.', items: ['Annual walk-through & written report', '1 hour of handyman care each month', 'Concierge team on call', 'Estimates before any additional work'] },
    { name: 'Signature', price: 499, dark: true, lead: 'A dedicated concierge and a monthly rhythm of care.', items: ['Monthly walk-through & written report', '2 hours of handyman care each month', 'One dedicated point of contact', 'Priority scheduling of trades'] },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {tiers.map(t => (
        <Card key={t.name} variant={t.dark ? 'inverse' : 'outlined'} padding={48} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, letterSpacing: '0.24em', fontWeight: 500, textTransform: 'uppercase', color: t.dark ? 'var(--bronze-200)' : 'var(--bronze-700)' }}>{t.name}</span>
            {t.dark ? <Badge tone="accent">Most chosen</Badge> : null}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 84, fontWeight: 300, lineHeight: 1 }}>${t.price}</span>
            <span style={{ fontSize: 13, color: t.dark ? 'var(--oat)' : 'var(--stone)' }}>per month</span>
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, margin: 0, color: t.dark ? 'var(--sand)' : 'var(--taupe)' }}>{t.lead}</p>
          <div>
            {t.items.map(it => <div key={it} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '14px 0', borderTop: '1px solid ' + (t.dark ? 'var(--border-inverse)' : 'var(--border-hairline)'), fontSize: 15 }}><Icon name="check" size={15} color="var(--bronze-300)" />{it}</div>)}
          </div>
          <Button variant={t.dark ? 'accent' : 'secondary'} full onClick={() => go('contact')}>Begin with {t.name}</Button>
        </Card>
      ))}
    </div>
  );
}
Object.assign(window, { Home, TierCards });
})();
