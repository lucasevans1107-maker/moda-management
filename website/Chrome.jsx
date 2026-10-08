(() => {
const { Icon, Wordmark, Eyebrow, ImageFrame, Button, IconButton, Badge, Tag, Avatar, Input, Select, Checkbox, Radio, Switch, Card, Dialog, Tooltip, Toast, Stat, Tabs } = window.Moda;
const NAV = [['home','Home'],['membership','Membership'],['services','Services'],['contact','Contact']];
function SiteHeader({ page, go, overlay }) {
  const fg = overlay ? 'var(--ivory)' : 'var(--ink)';
  return (
    <header data-theme={overlay ? 'light' : undefined} style={{ position: overlay ? 'absolute' : 'relative', top: 0, left: 0, right: 0, zIndex: 10, borderBottom: '1px solid ' + (overlay ? 'var(--border-inverse)' : 'var(--border-hairline)'), background: overlay ? 'transparent' : 'var(--ivory)' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', height: 88, padding: '0 48px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 24, color: fg }}>
        <nav style={{ display: 'flex', gap: 36 }}>
          {NAV.slice(1).map(([id, l]) => (
            <span key={id} onClick={() => go(id)} style={{ cursor: 'pointer', fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', paddingBottom: 4, borderBottom: '1px solid ' + (page === id ? 'var(--bronze-300)' : 'transparent') }}>{l}</span>
          ))}
        </nav>
        <span onClick={() => go('home')} style={{ cursor: 'pointer' }}><Wordmark size="s" tone={overlay ? 'ivory' : 'ink'} /></span>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 28 }}>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}>Member login</span>
          <Button size="s" variant={overlay ? 'inverse' : 'secondary'} onClick={() => go('contact')}>Request a consultation</Button>
        </div>
      </div>
    </header>
  );
}
function SiteFooter({ go }) {
  const col = (t, items) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.24em', fontWeight: 500, color: 'var(--bronze-200)', marginBottom: 6 }}>{t}</div>
      {items.map(([l, id]) => <span key={l} onClick={() => id && go(id)} style={{ fontSize: 14, color: 'var(--oat)', cursor: id ? 'pointer' : 'default' }}>{l}</span>)}
    </div>
  );
  return (
    <footer data-theme="light" style={{ background: 'var(--night)', color: 'var(--ivory)' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '96px 48px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 48 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'flex-start' }}>
            <Wordmark tone="ivory" size="m" />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontStyle: 'italic', fontWeight: 300, color: 'var(--sand)', maxWidth: 340, margin: 0, lineHeight: 1.35 }}>Private home management, quietly done.</p>
          </div>
          {col('MEMBERSHIP', [['Signature', 'membership'], ['Essential', 'membership'], ['Terms', 'membership']])}
          {col('SERVICES', [['Walk-throughs', 'services'], ['White-glove handyman', 'services'], ['Renovation', 'services']])}
          {col('CONTACT', [['Request a consultation', 'contact'], ['hello@modamanagement.com'], ['Member login']])}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 96, paddingTop: 24, borderTop: '1px solid var(--border-inverse)', fontSize: 12, color: 'var(--stone)' }}>
          <span>© 2026 Moda Management</span><span>Privacy · Terms</span>
        </div>
      </div>
    </footer>
  );
}
function Container({ children, style }) { return <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 48px', ...style }}>{children}</div>; }
function PageTitle({ eyebrow, title, intro }) {
  return (
    <Container style={{ padding: '120px 48px 88px' }}>
      <div className="mrise" style={{ maxWidth: 880 }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 88, lineHeight: 1.0, letterSpacing: '-0.01em', margin: '28px 0 28px', textWrap: 'balance' }}>{title}</h1>
        {intro ? <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--taupe)', maxWidth: 600, margin: 0 }}>{intro}</p> : null}
      </div>
    </Container>
  );
}
Object.assign(window, { SiteHeader, SiteFooter, Container, PageTitle });
})();
