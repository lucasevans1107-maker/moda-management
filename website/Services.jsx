(() => {
const { Icon, Wordmark, Eyebrow, ImageFrame, Button, IconButton, Badge, Tag, Avatar, Input, Select, Checkbox, Radio, Switch, Card, Dialog, Tooltip, Toast, Stat, Tabs } = window.Moda;
function Services({ go }) {
  const svc = [
    ['Maintenance', 'Seasonal and recurring care, planned around your home and priced before it’s booked.', 'kitchen-sage.jpg', 'linen'],
    ['Home issues', 'Leaks, faults and the unexpected. One call; we coordinate the right trade and meet them on site.', 'bathroom.jpg', 'sand'],
    ['Renovation', 'From a single room to the whole house — scoped, estimated and overseen by your concierge.', 'living-open.jpg', 'umber'],
  ];
  const seasons = [
    ['Spring', ['HVAC service', 'Gutter cleaning', 'Irrigation start-up', 'Exterior wash']],
    ['Summer', ['Pool & patio care', 'Pest prevention', 'Window cleaning', 'Deck sealing']],
    ['Autumn', ['Heating check', 'Chimney sweep', 'Gutter cleaning', 'Irrigation shut-down']],
    ['Winter', ['Pipe protection', 'Generator test', 'Smoke & CO detectors', 'Interior touch-ups']],
  ];
  const [season, setSeason] = React.useState('Spring');
  return (
    <div>
      <SiteHeader page="services" go={go} />
      <PageTitle eyebrow="Services" title={<>From a loose hinge<br />to a <i>new kitchen.</i></>} intro="Members can call on us for anything the home needs. Additional services are quoted individually and added to your plan only with your approval." />
      <Container style={{ paddingBottom: 160, display: 'flex', flexDirection: 'column', gap: 120 }}>
        {svc.map(([t, d, l, tone], i) => (
          <div key={t} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 96, alignItems: 'center', direction: i % 2 ? 'rtl' : 'ltr' }}>
            <ImageFrame src={'assets/photos/' + l} ratio="5 / 4" tone={tone} />
            <div style={{ direction: 'ltr' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, color: 'var(--bronze-500)' }}>0{i + 1}</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 60, lineHeight: 1.05, margin: '16px 0 24px' }}>{t}</h3>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--taupe)', margin: '0 0 32px', maxWidth: 440 }}>{d}</p>
              <Button variant="link" iconRight="arrow-right" onClick={() => go('contact')}>Enquire</Button>
            </div>
          </div>
        ))}
      </Container>
      <section style={{ background: 'var(--linen)' }}>
        <Container style={{ padding: '128px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 48, marginBottom: 56 }}>
            <div><Eyebrow>A recurring schedule</Eyebrow><h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 56, margin: '24px 0 0' }}>The year, <i>in care.</i></h2></div>
            <Tabs variant="segmented" value={season} onChange={setSeason} items={seasons.map(([s]) => ({ id: s, label: s }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 1, background: 'var(--border-hairline)' }}>
            {seasons.map(([s, list]) => (
              <div key={s} style={{ background: s === season ? 'var(--ink)' : 'var(--porcelain)', color: s === season ? 'var(--ivory)' : 'var(--ink)', padding: 32, transition: 'all 280ms var(--ease-quiet)', minHeight: 300 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 28 }}>{s}</div>
                {list.map(x => <div key={x} style={{ fontSize: 14, padding: '10px 0', borderTop: '1px solid ' + (s === season ? 'var(--border-inverse)' : 'var(--border-hairline)'), color: s === season ? 'var(--sand)' : 'var(--taupe)' }}>{x}</div>)}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: 'var(--stone)', marginTop: 20 }}>An example plan. Each is built for the home, and every service is priced in addition to membership.</p>
        </Container>
      </section>
    </div>
  );
}
Object.assign(window, { Services });
})();
