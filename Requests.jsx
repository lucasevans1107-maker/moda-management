(() => {
const { Icon, Wordmark, Eyebrow, ImageFrame, Button, IconButton, Badge, Tag, Avatar, Input, Select, Checkbox, Radio, Switch, Card, Dialog, Tooltip, Toast, Stat, Tabs } = window.Moda;
function Requests({ go, data, setData, toast }) {
  const [tab, setTab] = React.useState('open');
  const [sel, setSel] = React.useState('R-218');
  const m = (id) => data.members.find(x => x.id === id);
  const isOpen = (r) => !['Completed'].includes(r.status);
  const list = data.requests.filter(r => tab === 'open' ? isOpen(r) : tab === 'new' ? r.status === 'New' : r.status === 'Completed');
  const r = data.requests.find(x => x.id === sel);
  const update = (patch) => setData(d => ({ ...d, requests: d.requests.map(x => x.id === sel ? { ...x, ...patch } : x) }));
  return (
    <div>
      <TopBar crumbs={[{ label: 'Requests' }]} actions={<Button size="s" icon="plus">New request</Button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 400px', minHeight: 'calc(100vh - 72px)' }}>
        <div style={{ padding: 48 }}>
          <PageHead eyebrow="Inbox" title="Requests" sub="The AI concierge acknowledges every request instantly. New items wait here for a person to assign and schedule." />
          <Tabs value={tab} onChange={setTab} style={{ marginBottom: 8 }} items={[{ id: 'open', label: 'Open', count: data.requests.filter(isOpen).length }, { id: 'new', label: 'Needs review', count: data.requests.filter(x => x.status === 'New').length }, { id: 'done', label: 'Completed' }]} />
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
            <thead><tr><th style={th}>Request</th><th style={th}>Residence</th><th style={th}>Type</th><th style={th}>Response</th><th style={th}>Status</th></tr></thead>
            <tbody>{list.map(x => (
              <tr key={x.id} onClick={() => setSel(x.id)} style={{ cursor: 'pointer', background: x.id === sel ? 'var(--porcelain)' : 'transparent' }}>
                <td style={{ ...td, paddingLeft: 12, boxShadow: x.id === sel ? 'inset 2px 0 0 var(--bronze-500)' : 'none' }}><div>{x.title}</div><div style={{ fontSize: 12, color: 'var(--stone)', display: 'flex', alignItems: 'center', gap: 6 }}>{x.id} · {x.received} · <Icon name={{ Call: 'phone', Text: 'message-square', Email: 'mail', Portal: 'monitor', 'Walk-through': 'clipboard-check' }[x.via] || 'inbox'} size={12} /> {x.via || 'Portal'}</div></td>
                <td style={td}>{m(x.member).name}</td>
                <td style={{ ...td, color: 'var(--taupe)' }}>{x.type}</td>
                <td style={td}><SLA left={x.left} /></td>
                <td style={td}><Badge tone={statusTone(x.status)}>{x.status}</Badge></td>
              </tr>))}</tbody>
          </table>
        </div>
        {r ? (
          <div key={r.id} className="mrise" style={{ borderLeft: '1px solid var(--border-hairline)', background: 'var(--porcelain)', padding: 36, display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--stone)' }}>{r.id}</span><Badge tone={statusTone(r.status)}>{r.status}</Badge></div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, lineHeight: 1.1, margin: '14px 0 8px' }}>{r.title}</div>
              <div onClick={() => go('member', r.member)} style={{ fontSize: 14, color: 'var(--bronze-700)', cursor: 'pointer' }}>{m(r.member).name} · {m(r.member).address}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, paddingTop: 20, borderTop: '1px solid var(--border-hairline)' }}>
              <div><div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--stone)', fontWeight: 500 }}>MEMBERSHIP</div><div style={{ fontSize: 14, marginTop: 6 }}>{m(r.member).tier}</div></div>
              <div><div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--stone)', fontWeight: 500 }}>HOURS LEFT</div><div style={{ fontSize: 14, marginTop: 6 }}>{m(r.member).allow - m(r.member).used}h this month</div></div>
            </div>
            <Select label="Assign to" value={r.assignee || ''} onChange={(e) => update({ assignee: e.target.value })} options={[{ value: '', label: 'Unassigned' }, 'Esty Moreau', 'Julian Hart']} />
            <Input label="Response to member" multiline rows={4} defaultValue={r.status === 'New' ? 'Thank you — we have this in hand. Your concierge will be in touch shortly to arrange a time.' : ''} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
              <Button full disabled={r.status !== 'New'} onClick={() => { update({ status: 'Responded', left: null, assignee: r.assignee || 'Esty Moreau' }); toast('Response sent', m(r.member).owners + ' will receive it by email.'); }}>Send response</Button>
              <Button full variant="secondary" icon="file-text" onClick={() => go('estimates')}>Create estimate</Button>
            </div>
          </div>
        ) : <div></div>}
      </div>
    </div>
  );
}
Object.assign(window, { Requests });
})();
