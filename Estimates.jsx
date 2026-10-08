(() => {
const { Icon, Wordmark, Eyebrow, ImageFrame, Button, IconButton, Badge, Tag, Avatar, Input, Select, Checkbox, Radio, Switch, Card, Dialog, Tooltip, Toast, Stat, Tabs } = window.Moda;
function Estimates({ go, data, setData, toast }) {
  const [tab, setTab] = React.useState('all');
  const [open, setOpen] = React.useState(null);
  const m = (id) => data.members.find(x => x.id === id);
  const list = data.estimates.filter(e => tab === 'all' || (tab === 'pending' ? ['Draft', 'Awaiting approval'].includes(e.status) : e.status === 'Approved'));
  const e = data.estimates.find(x => x.id === open);
  const setStatus = (s) => setData(d => ({ ...d, estimates: d.estimates.map(x => x.id === open ? { ...x, status: s, sent: s === 'Awaiting approval' ? 'Oct 7' : x.sent } : x) }));
  return (
    <div>
      <TopBar crumbs={[{ label: 'Estimates' }]} actions={<Button size="s" icon="plus">New estimate</Button>} />
      <div style={{ padding: 48 }}>
        <PageHead eyebrow="Additional work" title="Estimates" sub="Work begins only after the member approves." />
        <Tabs value={tab} onChange={setTab} items={[{ id: 'all', label: 'All', count: data.estimates.length }, { id: 'pending', label: 'Pending' }, { id: 'approved', label: 'Approved' }]} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 20, marginTop: 32 }}>
          {list.map(x => (
            <Card key={x.id} interactive onClick={() => setOpen(x.id)} padding={28} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--stone)' }}>{x.id} · {m(x.member).name.toUpperCase()}</span><Badge tone={statusTone(x.status)}>{x.status}</Badge></div>
              <Serif size={26} style={{ lineHeight: 1.15 }}>{x.title}</Serif>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 16, borderTop: '1px solid var(--border-hairline)' }}>
                <Serif size={36} style={{ fontWeight: 300 }}>{money(x.amount)}</Serif><span style={{ fontSize: 12, color: 'var(--stone)' }}>{x.status === 'Draft' ? 'Not yet sent' : 'Sent ' + x.sent}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
      {e ? <Dialog open onClose={() => setOpen(null)} width={560} eyebrow={e.id + ' · ' + m(e.member).name} title={e.title}
        actions={e.status === 'Draft' ? <><Button size="s" variant="ghost" onClick={() => setOpen(null)}>Keep as draft</Button><Button size="s" iconRight="send" onClick={() => { setStatus('Awaiting approval'); toast('Estimate sent', 'Awaiting approval from ' + m(e.member).owners); setOpen(null); }}>Send for approval</Button></>
          : e.status === 'Awaiting approval' ? <><Button size="s" variant="ghost" onClick={() => { setStatus('Declined'); setOpen(null); }}>Mark declined</Button><Button size="s" variant="accent" onClick={() => { setStatus('Approved'); toast('Estimate approved', 'Ready to schedule'); setOpen(null); }}>Record approval</Button></>
          : <Button size="s" variant="secondary" onClick={() => setOpen(null)}>Close</Button>}>
        <div style={{ marginTop: 8 }}>
          {e.lines.map(([l, a]) => <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderTop: '1px solid var(--border-hairline)', fontSize: 14, color: 'var(--ink)' }}><span>{l}</span><span>{money(a)}</span></div>)}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '16px 0 0', borderTop: '1px solid var(--ink)' }}><span style={{ fontSize: 10, letterSpacing: '0.22em', fontWeight: 500, color: 'var(--ink)' }}>TOTAL</span><Serif size={32}>{money(e.lines.reduce((s, [, a]) => s + a, 0))}</Serif></div>
        </div>
      </Dialog> : null}
    </div>
  );
}
Object.assign(window, { Estimates });
})();
