(() => {
const { Icon, Wordmark, Eyebrow, ImageFrame, Button, IconButton, Badge, Tag, Avatar, Input, Select, Checkbox, Radio, Switch, Card, Dialog, Tooltip, Toast, Stat, Tabs } = window.Moda;
const NAV = [['today', 'Today', 'sun'], ['ai', 'Concierge AI', 'sparkles'], ['requests', 'Requests', 'inbox'], ['members', 'Members', 'house'], ['walkthrough', 'Walk-throughs', 'clipboard-check'], ['estimates', 'Estimates', 'file-text']];
function Sidebar({ page, go, counts }) {
  return (
    <aside data-theme="light" style={{ width: 248, flexShrink: 0, background: 'var(--night)', color: 'var(--ivory)', display: 'flex', flexDirection: 'column', padding: '32px 0 24px', position: 'sticky', top: 0, height: '100vh', boxSizing: 'border-box' }}>
      <div style={{ padding: '0 28px 40px' }}><Wordmark size="s" tone="ivory" stacked={true} /></div>
      <div style={{ padding: '0 28px 12px', fontSize: 10, letterSpacing: '0.24em', color: 'var(--stone)', fontWeight: 500 }}>CONSOLE</div>
      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        {NAV.map(([id, l, ic]) => { const on = page === id || (id === 'members' && page === 'member'); return (
          <div key={id} onClick={() => go(id)} style={{ display: 'flex', alignItems: 'center', gap: 14, height: 46, padding: '0 28px', cursor: 'pointer', position: 'relative',
            color: on ? 'var(--ivory)' : 'var(--oat)', background: on ? 'rgba(247,243,236,0.06)' : 'transparent', fontSize: 14, fontWeight: on ? 400 : 300, transition: 'all 200ms var(--ease-quiet)' }}>
            {on ? <span style={{ position: 'absolute', left: 0, top: 12, bottom: 12, width: 2, background: 'var(--bronze-300)' }}></span> : null}
            <Icon name={ic} size={17} color={on ? 'var(--bronze-200)' : 'currentColor'} />
            <span style={{ flex: 1 }}>{l}</span>
            {counts[id] ? <span style={{ fontSize: 11, color: 'var(--bronze-200)' }}>{counts[id]}</span> : null}
          </div>); })}
      </nav>
      <div style={{ flex: 1 }}></div>
      <div style={{ margin: '0 20px', padding: '18px 8px 0', borderTop: '1px solid var(--border-inverse)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name="Esty Moreau" size={34} tone="bronze" />
        <div style={{ lineHeight: 1.3 }}><div style={{ fontSize: 13 }}>Esty Moreau</div><div style={{ fontSize: 11, color: 'var(--stone)' }}>Operations</div></div>
      </div>
    </aside>
  );
}
function TopBar({ crumbs = [], actions }) {
  return (
    <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', borderBottom: '1px solid var(--border-hairline)', background: 'var(--ivory)', position: 'sticky', top: 0, zIndex: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500, color: 'var(--stone)' }}>
        {crumbs.map((c, i) => <React.Fragment key={i}>{i ? <Icon name="chevron-right" size={12} /> : null}<span onClick={c.onClick} style={{ color: i === crumbs.length - 1 ? 'var(--ink)' : 'var(--stone)', cursor: c.onClick ? 'pointer' : 'default' }}>{c.label}</span></React.Fragment>)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 260 }}><Input icon="search" placeholder="Search members, requests…" /></div>
        <IconButton icon="bell" label="Notifications" />
        {actions}
      </div>
    </div>
  );
}
function PageHead({ eyebrow, title, sub, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, marginBottom: 40 }}>
      <div>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 52, lineHeight: 1.05, margin: eyebrow ? '16px 0 0' : 0 }}>{title}</h1>
        {sub ? <div style={{ fontSize: 14, color: 'var(--taupe)', marginTop: 10 }}>{sub}</div> : null}
      </div>
      {right}
    </div>
  );
}
const statusTone = (s) => ({ 'New': 'warning', 'Scheduled': 'info', 'Responded': 'neutral', 'Estimate sent': 'accent', 'Completed': 'success', 'Draft': 'neutral', 'Awaiting approval': 'warning', 'Approved': 'success', 'Declined': 'danger', 'Active': 'success', 'Paused': 'neutral' }[s] || 'neutral');
const SLA = ({ left }) => left == null ? <span style={{ color: 'var(--stone)' }}>—</span> : <Tooltip label="Respond within 24 hours of receipt"><Badge tone={left <= 4 ? 'danger' : 'warning'} dot>{left}h left</Badge></Tooltip>;
const money = (n) => '$' + n.toLocaleString('en-US');
const th = { fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500, color: 'var(--stone)', textAlign: 'left', padding: '0 16px 14px 0', borderBottom: '1px solid var(--border-hairline)' };
const td = { padding: '0 16px 0 0', height: 64, borderBottom: '1px solid var(--border-hairline)', fontSize: 14, verticalAlign: 'middle' };
const Serif = ({ children, size = 18, style }) => <span style={{ fontFamily: 'var(--font-display)', fontSize: size, fontWeight: 400, ...style }}>{children}</span>;
Object.assign(window, { Sidebar, TopBar, PageHead, statusTone, SLA, money, th, td, Serif });
})();
