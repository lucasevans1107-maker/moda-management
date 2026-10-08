(() => {
const { Icon, Wordmark, Eyebrow, ImageFrame, Button, IconButton, Badge, Tag, Avatar, Input, Select, Checkbox, Radio, Switch, Card, Dialog, Tooltip, Toast, Stat, Tabs } = window.Moda;
function Members({ go, data }) {
  const [f, setF] = React.useState('All');
  const list = data.members.filter(x => f === 'All' || x.tier === f || x.status === f);
  return (
    <div>
      <TopBar crumbs={[{ label: 'Members' }]} actions={<Button size="s" icon="plus">Add member</Button>} />
      <div style={{ padding: 48 }}>
        <PageHead eyebrow="Residences" title="Members" right={<div style={{ display: 'flex', gap: 8 }}>{['All', 'Signature', 'Essential', 'Paused'].map(t => <Tag key={t} selected={f === t} onClick={() => setF(t)}>{t}</Tag>)}</div>} />
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Residence', 'Membership', 'Concierge', 'Next walk-through', 'Handyman hours', 'Renews', ''].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
          <tbody>{list.map(x => (
            <tr key={x.id} onClick={() => go('member', x.id)} style={{ cursor: 'pointer' }}>
              <td style={{ ...td, height: 76 }}><div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><Avatar name={x.owners.replace('&', '')} size={38} /><div><Serif size={20}>{x.name}</Serif><div style={{ fontSize: 12, color: 'var(--stone)' }}>{x.address}</div></div></div></td>
              <td style={td}><Badge tone={x.tier === 'Signature' ? 'accent' : 'neutral'}>{x.tier}</Badge></td>
              <td style={{ ...td, color: 'var(--taupe)' }}>{x.concierge}</td>
              <td style={td}>{x.next}</td>
              <td style={td}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 72, height: 2, background: 'var(--linen)' }}><div style={{ height: 2, width: (x.used / x.allow * 100) + '%', background: 'var(--bronze-500)' }}></div></div><span style={{ fontSize: 12, color: 'var(--taupe)' }}>{x.used}/{x.allow}h</span></div></td>
              <td style={{ ...td, color: 'var(--taupe)' }}>{x.status === 'Paused' ? <Badge>Paused</Badge> : x.renews}</td>
              <td style={{ ...td, textAlign: 'right' }}><Icon name="arrow-right" size={16} color="var(--stone)" /></td>
            </tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}
function MemberDetail({ go, data, setData, id, toast }) {
  const x = data.members.find(m => m.id === id) || data.members[0];
  const [logOpen, setLogOpen] = React.useState(false);
  const [mins, setMins] = React.useState('75');
  const [who, setWho] = React.useState('');
  const billMin = (n) => Math.max(60, Math.ceil(n / 15) * 15);
  const fee = (n) => billMin(n) / 60 * 125;
  const n = parseInt(mins, 10) || 0;
  const setMember = (patch) => setData(d => ({ ...d, members: d.members.map(m => m.id === x.id ? { ...m, ...patch } : m) }));
  const est = data.estimates.filter(e => e.member === x.id);
  const reqs = data.requests.filter(r => r.member === x.id);
  const label = { fontSize: 10, letterSpacing: '0.2em', color: 'var(--stone)', fontWeight: 500, textTransform: 'uppercase' };
  return (
    <div>
      <TopBar crumbs={[{ label: 'Members', onClick: () => go('members') }, { label: x.name }]} actions={<Button size="s" icon="clipboard-check" onClick={() => go('walkthrough', x.id)}>Start walk-through</Button>} />
      <ImageFrame height={240} tone="umber" src={x.photo} label="">
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(28,26,23,.6))' }}></div>
        <div style={{ position: 'absolute', left: 48, right: 48, bottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', color: 'var(--ivory)' }}>
          <div><Eyebrow tone="ivory">{x.tier} member since {x.since}</Eyebrow><div style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 52, lineHeight: 1, marginTop: 14 }}>{x.name}</div><div style={{ fontSize: 14, color: 'var(--sand)', marginTop: 8 }}>{x.owners} · {x.address}</div></div>
          <Badge tone={x.status === 'Active' ? 'success' : 'neutral'} dot>{x.status}</Badge>
        </div>
      </ImageFrame>
      <div style={{ padding: 48, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, alignItems: 'start' }}>
        <Card padding={28} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Serif size={24}>Membership</Serif>
          {[['Plan', x.tier + ' · ' + (x.tier === 'Signature' ? '$499' : '$99') + ' / month'], ['Walk-throughs', x.tier === 'Signature' ? 'Monthly' : 'Annually'], ['Concierge', x.concierge], ['Renews', x.renews], ['Notice required by', '30 days before renewal']].map(([k, v]) => <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14, paddingBottom: 12, borderBottom: '1px solid var(--border-hairline)' }}><span style={{ color: 'var(--stone)' }}>{k}</span><span>{v}</span></div>)}
          <Switch checked={x.status === 'Paused'} onChange={(v) => { setMember({ status: v ? 'Paused' : 'Active' }); toast(v ? 'Membership paused' : 'Membership resumed', x.name); }} label="Pause membership" />
        </Card>
        <Card padding={28} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Serif size={24}>Time on site</Serif><Button size="s" variant="secondary" icon="plus" onClick={() => setLogOpen(true)}>Log time</Button></div>
          <Stat label="Complimentary handyman · October" value={x.used} unit={'of ' + x.allow + ' hours'} />
          <div style={{ height: 2, background: 'var(--linen)' }}><div style={{ height: 2, width: Math.min(100, x.used / x.allow * 100) + '%', background: 'var(--bronze-500)' }}></div></div>
          <div>
            <div style={{ ...label, marginBottom: 8 }}>Billable concierge time</div>
            {x.onsite.length ? x.onsite.map((o, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '12px 0', borderTop: '1px solid var(--border-hairline)' }}><span><span style={{ color: 'var(--stone)', marginRight: 10 }}>{o.d}</span>{o.who}</span><span>{money(fee(o.min))}</span></div>) : <div style={{ fontSize: 13, color: 'var(--stone)', padding: '12px 0', borderTop: '1px solid var(--border-hairline)' }}>No billable time this cycle.</div>}
          </div>
        </Card>
        <Card padding={28} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Serif size={24}>Activity</Serif>
          {reqs.concat([]).map(r => <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14, paddingBottom: 12, borderBottom: '1px solid var(--border-hairline)' }}><span>{r.title}<div style={{ fontSize: 12, color: 'var(--stone)' }}>{r.id} · {r.received}</div></span><Badge tone={statusTone(r.status)}>{r.status}</Badge></div>)}
          {est.map(e => <div key={e.id} onClick={() => go('estimates')} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14, paddingBottom: 12, borderBottom: '1px solid var(--border-hairline)', cursor: 'pointer' }}><span>{e.title}<div style={{ fontSize: 12, color: 'var(--stone)' }}>{e.id} · {money(e.amount)}</div></span><Badge tone={statusTone(e.status)}>{e.status}</Badge></div>)}
        </Card>
      </div>
      <Dialog open={logOpen} onClose={() => setLogOpen(false)} eyebrow={x.name} title="Log concierge time on site"
        actions={<><Button size="s" variant="ghost" onClick={() => setLogOpen(false)}>Cancel</Button><Button size="s" onClick={() => { setMember({ onsite: [{ d: 'Oct 7', who: who || 'On-site meeting', min: n }, ...x.onsite] }); setLogOpen(false); toast('Time logged', money(fee(n)) + ' added to next invoice'); }}>Log {money(fee(n))}</Button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 8 }}>
          <Input label="Meeting with" placeholder="e.g. Plumber — Hale & Sons" value={who} onChange={(e) => setWho(e.target.value)} />
          <Input label="Minutes on site" type="number" value={mins} onChange={(e) => setMins(e.target.value)} />
          <div style={{ background: 'var(--linen)', padding: '16px 18px', fontSize: 13, color: 'var(--taupe)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Billed as {billMin(n)} min · 1h minimum, then 15-min increments at $125/h</span><Serif size={22} style={{ color: 'var(--ink)' }}>{money(fee(n))}</Serif>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
Object.assign(window, { Members, MemberDetail });
})();
