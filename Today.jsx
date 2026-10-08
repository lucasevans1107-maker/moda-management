(() => {
const { Icon, Wordmark, Eyebrow, ImageFrame, Button, IconButton, Badge, Tag, Avatar, Input, Select, Checkbox, Radio, Switch, Card, Dialog, Tooltip, Toast, Stat, Tabs } = window.Moda;
function Today({ go, data }) {
  const m = (id) => data.members.find(x => x.id === id);
  const urgent = data.requests.filter(r => r.status === 'New');
  const visits = [
    { t: '10:00', end: '12:00', m: 'whitfield', what: 'Monthly walk-through', note: 'Handyman on site · 2h complimentary', icon: 'clipboard-check' },
    { t: '13:30', end: '14:45', m: 'ashby', what: 'Meet AV installer', note: 'Billable · $125/h, 15-min increments', icon: 'key-round' },
    { t: '16:00', end: '17:00', m: 'calloway', what: 'Drapery installation', note: 'Handyman · 0.5h remaining this month', icon: 'hammer' },
  ];
  return (
    <div>
      <TopBar crumbs={[{ label: 'Today' }]} actions={<Button size="s" icon="plus" onClick={() => go('requests')}>New request</Button>} />
      <div style={{ padding: '48px' }}>
        <PageHead eyebrow="Tuesday, 7 October" title={<>Good morning, <i>Esty.</i></>} sub={'Three visits today. The AI concierge has handled 23 conversations — ' + data.conversations.filter(c => c.status === 'Needs a human').length + ' need you.'} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', border: '1px solid var(--border-hairline)', background: 'var(--porcelain)', marginBottom: 40 }}>
          {[['AI conversations today', '23', null, '1 needs you'], ['Visits this week', '7', null, '3 today'], ['Estimates pending', money(6450), null, '1 awaiting approval'], ['Active members', '5', '/ 6', '1 paused']].map(([l, v, u, c, t], i) => (
            <div key={l} style={{ padding: '28px 28px', borderLeft: i ? '1px solid var(--border-hairline)' : 'none' }}><Stat label={l} value={v} unit={u} caption={c} /></div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', gap: 32 }}>
          <Card padding={0}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px', borderBottom: '1px solid var(--border-hairline)' }}>
              <Serif size={26}>Today’s visits</Serif><Button size="s" variant="ghost" icon="calendar">Week</Button>
            </div>
            {visits.map((v, i) => (
              <div key={i} onClick={() => go(v.what.includes('walk') ? 'walkthrough' : 'member', v.m)} style={{ display: 'grid', gridTemplateColumns: '84px 1fr auto', gap: 20, alignItems: 'center', padding: '22px 28px', borderBottom: i < 2 ? '1px solid var(--border-hairline)' : 'none', cursor: 'pointer' }}>
                <div><Serif size={24}>{v.t}</Serif><div style={{ fontSize: 11, color: 'var(--stone)' }}>until {v.end}</div></div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 400 }}>{v.what} · {m(v.m).name}</div>
                  <div style={{ fontSize: 13, color: 'var(--stone)', marginTop: 3 }}>{m(v.m).address} — {v.note}</div>
                </div>
                <Icon name={v.icon} size={18} color="var(--bronze-500)" />
              </div>
            ))}
          </Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <Card padding={0}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px', borderBottom: '1px solid var(--border-hairline)' }}><Serif size={26}>From the AI concierge</Serif><Button size="s" variant="ghost" iconRight="arrow-right" onClick={() => go('ai')}>All</Button></div>
              {data.conversations.slice(0, 3).map((c, i) => (
                <div key={c.id} onClick={() => go('ai')} style={{ padding: '18px 28px', borderBottom: '1px solid var(--border-hairline)', display: 'flex', gap: 14, cursor: 'pointer', alignItems: 'flex-start' }}>
                  <Icon name={{ Call: 'phone', Text: 'message-square', Email: 'mail' }[c.channel]} size={16} color="var(--bronze-700)" style={{ marginTop: 3 }} />
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', gap: 10 }}><span>{c.from.split(' ·')[0]}</span><span style={{ fontSize: 11, color: 'var(--stone)', whiteSpace: 'nowrap' }}>{c.when}</span></div><div style={{ fontSize: 12, color: 'var(--stone)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.summary}</div></div>
                  {c.status === 'Needs a human' ? <Badge tone="danger" dot>You</Badge> : null}
                </div>
              ))}
            </Card>
            <Card padding={0}>
              <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-hairline)' }}><Serif size={26}>Requests to review</Serif></div>
              {urgent.map((r, i) => (
                <div key={r.id} onClick={() => go('requests')} style={{ padding: '20px 28px', borderBottom: i < urgent.length - 1 ? '1px solid var(--border-hairline)' : 'none', display: 'flex', justifyContent: 'space-between', gap: 16, cursor: 'pointer' }}>
                  <div><div style={{ fontSize: 15 }}>{r.title}</div><div style={{ fontSize: 13, color: 'var(--stone)', marginTop: 3 }}>{m(r.member).name} · {r.received}</div></div>
                  <SLA left={r.left} />
                </div>
              ))}
            </Card>
            <Card variant="inverse" padding={28}>
              <div style={{ fontSize: 10, letterSpacing: '0.24em', color: 'var(--bronze-200)', fontWeight: 500 }}>HANDYMAN HOURS · OCTOBER</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 22 }}>
                {data.members.filter(x => x.status === 'Active').slice(0, 4).map(x => (
                  <div key={x.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 7 }}><span>{x.name}</span><span style={{ color: 'var(--oat)' }}>{x.used} / {x.allow}h</span></div>
                    <div style={{ height: 2, background: 'rgba(247,243,236,0.14)' }}><div style={{ height: 2, width: (x.used / x.allow * 100) + '%', background: x.used >= x.allow ? 'var(--bronze-200)' : 'var(--bronze-300)' }}></div></div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { Today });
})();
