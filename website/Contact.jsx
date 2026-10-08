(() => {
const { Icon, Wordmark, Eyebrow, ImageFrame, Button, IconButton, Badge, Tag, Avatar, Input, Select, Checkbox, Radio, Switch, Card, Dialog, Tooltip, Toast, Stat, Tabs } = window.Moda;
function Contact({ go }) {
  const [sent, setSent] = React.useState(false);
  const [tier, setTier] = React.useState('Signature');
  return (
    <div>
      <SiteHeader page="contact" go={go} />
      <Container style={{ padding: '120px 48px 160px', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 120 }}>
        <div>
          <Eyebrow>Consultation</Eyebrow>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 80, lineHeight: 1.0, margin: '28px 0 28px' }}>Let’s begin <i>at home.</i></h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--taupe)', maxWidth: 440 }}>Tell us a little about your home. We’ll be in touch within the day to arrange a visit.</p>
          <div style={{ marginTop: 56 }}><ImageFrame src={'assets/photos/exterior-dusk.jpg'} ratio="4 / 3" tone="umber" /></div>
        </div>
        {sent ? (
          <div className="mrise" style={{ alignSelf: 'center' }}>
            <Icon name="check" size={28} color="var(--bronze-500)" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 52, margin: '24px 0 16px' }}>Thank you.</h2>
            <p style={{ fontSize: 17, color: 'var(--taupe)', margin: '0 0 32px' }}>Your concierge will reach out within 24 hours.</p>
            <Button variant="link" onClick={() => setSent(false)}>Send another enquiry</Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40, paddingTop: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <Input variant="line" label="First name" placeholder="Eleanor" />
              <Input variant="line" label="Last name" placeholder="Whitfield" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <Input variant="line" label="Email" placeholder="eleanor@residence.com" />
              <Input variant="line" label="Telephone" placeholder="(000) 000 0000" />
            </div>
            <Input variant="line" label="Residence address" placeholder="Street, city" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', color: 'var(--taupe)' }}>INTERESTED IN</span>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{['Signature', 'Essential', 'Renovation', 'Not sure yet'].map(t => <Tag key={t} selected={tier === t} onClick={() => setTier(t)}>{t}</Tag>)}</div>
            </div>
            <Input variant="line" label="Anything we should know" multiline rows={3} placeholder="Size of home, upcoming projects, timing…" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
              <span style={{ fontSize: 13, color: 'var(--stone)' }}>We respond to every enquiry within 24 hours.</span>
              <Button size="l" iconRight="arrow-right" onClick={() => setSent(true)}>Send enquiry</Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
Object.assign(window, { Contact });
})();
