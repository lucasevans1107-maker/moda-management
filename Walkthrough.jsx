(() => {
const { Icon, Wordmark, Eyebrow, ImageFrame, Button, IconButton, Badge, Tag, Avatar, Input, Select, Checkbox, Radio, Switch, Card, Dialog, Tooltip, Toast, Stat, Tabs } = window.Moda;
const ROOMS = {
  'Kitchen': [['Dishwasher door seal', 'Attention', 'Visible wear; minor leak reported (R-218).', true], ['Range hood filter', 'Monitor', 'Due for cleaning next visit.', false], ['Under-sink plumbing', 'Good', '', false]],
  'Primary suite': [['Shower grout', 'Monitor', 'Hairline cracks at base, north wall.', false], ['Window treatments', 'Good', '', false]],
  'Living & dining': [['Picture rail', 'Good', '', false], ['Fireplace damper', 'Monitor', 'Stiff to operate.', false]],
  'Exterior': [['Gutters', 'Attention', 'Leaf build-up, rear elevation.', true], ['Irrigation', 'Good', '', false]],
  'Mechanical': [['HVAC filters', 'Good', 'Replaced on this visit (handyman, 0.25h).', false], ['Water heater', 'Good', 'Installed 2021.', false]],
};
function Walkthrough({ go, data, id, toast }) {
  const x = data.members.find(m => m.id === (id || 'whitfield')) || data.members[0];
  const [rooms, setRooms] = React.useState(ROOMS);
  const [room, setRoom] = React.useState('Kitchen');
  const [sent, setSent] = React.useState(false);
  const all = Object.values(rooms).flat();
  const count = (c) => all.filter(i => i[1] === c).length;
  const set = (idx, k, v) => setRooms(r => ({ ...r, [room]: r[room].map((it, i) => i === idx ? Object.assign([...it], { [k]: v }) : it) }));
  const tone = { Good: 'success', Monitor: 'warning', Attention: 'danger' };
  return (
    <div>
      <TopBar crumbs={[{ label: 'Walk-throughs' }, { label: x.name }]} actions={<Button size="s" variant="secondary" icon="eye">Preview report</Button>} />
      <div style={{ padding: 48 }}>
        <PageHead eyebrow={'Monthly walk-through · Thu, Oct 9'} title={x.name} sub={x.address + ' · ' + x.owners}
          right={<div style={{ display: 'flex', gap: 28 }}>{['Good', 'Monitor', 'Attention'].map(c => <div key={c} style={{ textAlign: 'right' }}><Serif size={40}>{count(c)}</Serif><div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--stone)', textTransform: 'uppercase' }}>{c}</div></div>)}</div>} />
        <div style={{ display: 'grid', gridTemplateColumns: '240px minmax(0,1fr)', border: '1px solid var(--border-hairline)', background: 'var(--porcelain)' }}>
          <div style={{ borderRight: '1px solid var(--border-hairline)', padding: '12px 0' }}>
            {Object.keys(rooms).map(r => { const on = r === room; const att = rooms[r].filter(i => i[1] !== 'Good').length; return (
              <div key={r} onClick={() => setRoom(r)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', cursor: 'pointer', fontSize: 15, background: on ? 'var(--ivory)' : 'transparent', boxShadow: on ? 'inset 2px 0 0 var(--bronze-500)' : 'none', fontFamily: 'var(--font-display)', fontSize: 20 }}>
                {r}{att ? <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--bronze-700)' }}>{att}</span> : <Icon name="check" size={14} color="var(--sage)" />}
              </div>); })}
          </div>
          <div style={{ padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}><Serif size={30}>{room}</Serif><Button size="s" variant="ghost" icon="camera">Add photos</Button></div>
            {rooms[room].map((it, i) => (
              <div key={room + i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, padding: '20px 0', borderTop: '1px solid var(--border-hairline)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontSize: 15, fontWeight: 400 }}>{it[0]}</span><Badge tone={tone[it[1]]} dot>{it[1]}</Badge></div>
                  <Input placeholder="Add a note for the member…" value={it[2]} onChange={(e) => set(i, 2, e.target.value)} />
                  {it[1] !== 'Good' ? <Checkbox checked={it[3]} onChange={(v) => set(i, 3, v)} label="Offer a quote in the report" /> : null}
                </div>
                <Tabs variant="segmented" style={{ alignSelf: 'start' }} value={it[1]} onChange={(v) => set(i, 1, v)} items={[{ id: 'Good', label: 'Good' }, { id: 'Monitor', label: 'Monitor' }, { id: 'Attention', label: 'Attention' }]} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 }}>
          <span style={{ fontSize: 13, color: 'var(--taupe)' }}>{all.filter(i => i[3]).length} items offered for quote · The member chooses what we estimate.</span>
          <Button iconRight="send" disabled={sent} onClick={() => { setSent(true); toast('Report sent', 'Delivered to ' + x.owners); }}>{sent ? 'Report sent' : 'Send report to member'}</Button>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { Walkthrough });
})();
