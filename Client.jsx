(() => {
const { Icon, Wordmark, Eyebrow, ImageFrame, Button, IconButton, Badge, Tag, Avatar, Input, Select, Checkbox, Radio, Switch, Card, Dialog, Tooltip, Toast, Stat, Tabs } = window.Moda;
const ME = 'whitfield';
const C_NAV = [['home', 'Home'], ['requests', 'Requests'], ['reports', 'Reports'], ['estimates', 'Estimates'], ['membership', 'Membership']];
const lbl = { fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500, color: 'var(--stone)' };
const Wrap = ({ children, style }) => <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px', ...style }}>{children}</div>;
const H = ({ children, size = 52, style }) => <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: size, lineHeight: 1.05, margin: 0, textWrap: 'balance', ...style }}>{children}</h1>;
const statusCopy = { 'New': 'Received — we’ll respond within 24 hours', 'Responded': 'Your concierge has replied', 'Scheduled': 'Scheduled', 'Estimate sent': 'Estimate ready for you', 'Completed': 'Completed' };

function ClientHeader({ page, go, member }) {
  return (
    <header style={{ background: 'var(--ivory)', borderBottom: '1px solid var(--border-hairline)', position: 'sticky', top: 0, zIndex: 10 }}>
      <Wrap style={{ height: 84, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 24 }}>
        <span onClick={() => go('home')} style={{ cursor: 'pointer', justifySelf: 'start' }}><Wordmark size="s" stacked={false} /></span>
        <nav style={{ display: 'flex', gap: 34 }}>
          {C_NAV.map(([id, l]) => (
            <span key={id} onClick={() => go(id)} style={{ cursor: 'pointer', fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', paddingBottom: 5, color: page === id ? 'var(--ink)' : 'var(--stone)', borderBottom: '1px solid ' + (page === id ? 'var(--bronze-500)' : 'transparent'), transition: 'all 200ms var(--ease-quiet)' }}>{l}</span>
          ))}
        </nav>
        <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconButton icon="bell" label="Notifications" />
          <Avatar name="Eleanor Whitfield" size={36} tone="bronze" />
        </div>
      </Wrap>
    </header>
  );
}

function ConciergeCard({ onChat }) {
  return (
    <Card variant="inverse" padding={32} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ ...lbl, color: 'var(--bronze-200)' }}>Your concierge</div>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--oat)' }}><span style={{ width: 6, height: 6, borderRadius: 6, background: '#A7B79C' }}></span>Available now</span>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, lineHeight: 1.1 }}>Moda Concierge</div>
        <div style={{ fontSize: 13, color: 'var(--oat)', marginTop: 8, lineHeight: 1.6 }}>Day and night by call, text, email or here. Esty and the team step in whenever you’d like a person.</div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <Button size="s" variant="accent" icon="message-square" style={{ flex: 1 }} onClick={onChat}>Message</Button>
        <Button size="s" variant="inverse" icon="phone" style={{ flex: 1 }}>Call</Button>
      </div>
    </Card>
  );
}

function ChatDrawer({ open, onClose, data, setData, toast }) {
  const me = data.members.find(m => m.id === ME);
  const [msgs, setMsgs] = React.useState([['ai', 'Good afternoon, Eleanor. How can I help with the house today?']]);
  const [text, setText] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const endRef = React.useRef(null);
  React.useEffect(() => { if (endRef.current) endRef.current.parentNode.scrollTop = 1e6; }, [msgs, busy]);
  const ask = async () => {
    const q = text.trim(); if (!q || busy) return;
    const next = [...msgs, ['member', q]]; setMsgs(next); setText(''); setBusy(true);
    const ctx = 'You are the Moda Management AI concierge — a calm, discreet, warm house manager voice. Reply in 1-3 short sentences, no emoji, no lists. ' +
      'Member: Eleanor Whitfield, ' + me.address + ', Signature membership ($499/mo: monthly walk-through, 2 handyman hours/month, dedicated concierge). ' +
      'Handyman hours left this month: ' + (me.allow - me.used) + '. Next walk-through Thursday 9 October 10:00. Extra concierge on-site time is $125/h, 1h minimum then 15-min increments. ' +
      'Any additional work gets a written estimate first. If she reports a problem, say you have logged it as a request. If she asks for a person, say Esty will call her today.\n\n' +
      next.map(([w, t]) => (w === 'ai' ? 'Concierge: ' : 'Eleanor: ') + t).join('\n') + '\nConcierge:';
    let out;
    try { out = (await window.claude.complete(ctx)).trim(); }
    catch (e) { out = 'Thank you, Eleanor — I’ve noted that and logged it for the team. You’ll hear back shortly.'; }
    if (/leak|broken|fix|drip|not working|issue|problem|repair|hang|mount/i.test(q)) {
      setData(d => ({ ...d, requests: [{ id: 'R-' + (219 + d.requests.length), via: 'Portal', member: ME, title: q.length > 60 ? q.slice(0, 57) + '…' : q, type: 'Home issue', received: 'Just now', left: 24, status: 'New', assignee: null }, ...d.requests] }));
      toast('Request logged', 'The team can see it in the staff console.');
    }
    setMsgs(m => [...m, ['ai', out]]); setBusy(false);
  };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 120, pointerEvents: open ? 'auto' : 'none' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'var(--scrim)', opacity: open ? 1 : 0, transition: 'opacity 280ms var(--ease-quiet)' }}></div>
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 440, maxWidth: '100%', background: 'var(--porcelain)', boxShadow: 'var(--shadow-modal)', transform: open ? 'none' : 'translateX(100%)', transition: 'transform 480ms var(--ease-quiet)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><div style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>Moda Concierge</div><div style={{ fontSize: 12, color: 'var(--stone)', marginTop: 2 }}>AI concierge · a person is always one message away</div></div>
          <IconButton icon="x" label="Close" onClick={onClose} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {msgs.map(([w, t], i) => (
            <div key={i} style={{ alignSelf: w === 'ai' ? 'flex-start' : 'flex-end', maxWidth: '86%', padding: '12px 16px', fontSize: 14, lineHeight: 1.6,
              background: w === 'ai' ? 'var(--linen)' : 'var(--bronze-500)', color: w === 'ai' ? 'var(--ink)' : 'var(--white)' }}>{t}</div>
          ))}
          {busy ? <div style={{ alignSelf: 'flex-start', padding: '12px 16px', background: 'var(--linen)', color: 'var(--stone)', fontSize: 14 }}>…</div> : null}
          <div ref={endRef}></div>
        </div>
        <div style={{ padding: '16px 28px 24px', borderTop: '1px solid var(--border-hairline)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{['How many handyman hours do I have left?', 'The guest bath tap is dripping', 'I’d like to speak to Esty'].map(s => <Tag key={s} onClick={() => setText(s)}>{s}</Tag>)}</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); } }}><Input placeholder="Write a message…" value={text} onChange={(e) => setText(e.target.value)} /></div>
            <IconButton icon="arrow-up" label="Send" variant="solid" size="l" onClick={ask} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ClientHome({ go, data, setData, toast, openChat }) {
  const me = data.members.find(m => m.id === ME);
  const reqs = data.requests.filter(r => r.member === ME && r.status !== 'Completed');
  const ests = data.estimates.filter(e => e.member === ME && e.status === 'Awaiting approval');
  const [text, setText] = React.useState('');
  const send = () => {
    if (!text.trim()) return;
    const id = 'R-' + (219 + data.requests.length);
    setData(d => ({ ...d, requests: [{ id, member: ME, title: text.trim(), type: 'Home issue', received: 'Just now', left: 24, status: 'New', assignee: null }, ...d.requests] }));
    setText(''); toast('Request received', 'Your concierge has it — a confirmation is on its way.');
  };
  return (
    <div>
      <ImageFrame src={me.photo} height={520} tone="umber">
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(23,18,14,0.72) 0%, rgba(23,18,14,0.3) 60%, rgba(23,18,14,0.15) 100%), linear-gradient(180deg, transparent 40%, rgba(23,18,14,0.6) 100%)' }}></div>
        <Wrap style={{ position: 'absolute', left: 0, right: 0, bottom: 56, color: 'var(--ivory)' }}>
          <Eyebrow tone="ivory">{me.address}</Eyebrow>
          <H size={84} style={{ margin: '22px 0 18px' }}>Good afternoon, <i>Eleanor.</i></H>
          <div style={{ fontSize: 17, color: 'var(--sand)' }}>Your next walk-through is <span style={{ color: 'var(--ivory)' }}>Thursday, 9 October at 10:00</span>. Esty will be on site with the handyman.</div>
        </Wrap>
      </ImageFrame>
      <Wrap style={{ padding: '64px 48px 120px', display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <Card padding={36} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <H size={34}>What can we take care of?</H>
            <Input multiline rows={3} placeholder="e.g. The guest bath tap is dripping, and we’d like the hallway mirror hung." value={text} onChange={(e) => setText(e.target.value)} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 13, color: 'var(--stone)' }}>Acknowledged instantly — or simply call or text the Moda line.</span>
              <div style={{ display: 'flex', gap: 10 }}><Button size="s" variant="ghost" icon="camera">Add photos</Button><Button size="s" iconRight="arrow-right" onClick={send}>Send</Button></div>
            </div>
          </Card>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}><H size={30}>In hand</H><Button variant="link" onClick={() => go('requests')}>All requests</Button></div>
            {ests.map(e => (
              <div key={e.id} onClick={() => go('estimates')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '22px 0', borderTop: '1px solid var(--border-hairline)', cursor: 'pointer' }}>
                <div><div style={{ fontSize: 16 }}>{e.title}</div><div style={{ fontSize: 13, color: 'var(--stone)', marginTop: 4 }}>Estimate · ${e.amount.toLocaleString()} · awaiting your approval</div></div>
                <Badge tone="warning" dot>Your approval</Badge>
              </div>
            ))}
            {reqs.map(r => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '22px 0', borderTop: '1px solid var(--border-hairline)' }}>
                <div><div style={{ fontSize: 16 }}>{r.title}</div><div style={{ fontSize: 13, color: 'var(--stone)', marginTop: 4 }}>{statusCopy[r.status]} · {r.received}</div></div>
                <Badge tone={statusTone(r.status)}>{r.status === 'New' ? 'Received' : r.status}</Badge>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <ConciergeCard onChat={openChat} />
          <Card padding={32} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Stat label="Handyman hours · October" value={me.allow - me.used} unit={'of ' + me.allow + ' remaining'} />
            <div style={{ height: 2, background: 'var(--linen)' }}><div style={{ height: 2, width: (me.used / me.allow * 100) + '%', background: 'var(--bronze-500)' }}></div></div>
            <div style={{ fontSize: 13, color: 'var(--taupe)' }}>Save small jobs for Thursday — curtains, bulbs, hardware, picture hanging.</div>
          </Card>
          <Card variant="sunken" padding={32} onClick={() => go('reports')} interactive style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={lbl}>Latest report · 11 September</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>2 items need attention</div>
            <Button variant="link" iconRight="arrow-right">Read report</Button>
          </Card>
        </div>
      </Wrap>
    </div>
  );
}

function ClientRequests({ data, setData, toast }) {
  const mine = data.requests.filter(r => r.member === ME);
  const [cat, setCat] = React.useState('Something needs fixing');
  const [title, setTitle] = React.useState('');
  const [when, setWhen] = React.useState('At my next walk-through');
  const submit = () => {
    if (!title.trim()) return;
    setData(d => ({ ...d, requests: [{ id: 'R-' + (219 + d.requests.length), member: ME, title: title.trim(), type: cat === 'Small job for the handyman' ? 'Handyman' : cat === 'A project or renovation' ? 'Project' : 'Home issue', received: 'Just now', left: 24, status: 'New', assignee: null }, ...d.requests] }));
    setTitle(''); toast('Request received', 'Your concierge has it — a confirmation is on its way.');
  };
  return (
    <Wrap style={{ padding: '80px 48px 120px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.1fr)', gap: 80 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div><Eyebrow>New request</Eyebrow><H style={{ marginTop: 20 }}>Tell us what <i>your home needs.</i></H></div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{['Something needs fixing', 'Small job for the handyman', 'A project or renovation', 'Meet a trade on site'].map(t => <Tag key={t} selected={cat === t} onClick={() => setCat(t)}>{t}</Tag>)}</div>
        <Input variant="line" label="What’s happening" placeholder="Describe it in a sentence or two" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Select variant="line" label="Timing" value={when} onChange={(e) => setWhen(e.target.value)} options={['At my next walk-through', 'As soon as possible', 'This week', 'I’ll be away — anytime']} />
        {cat === 'Meet a trade on site' ? <div style={{ background: 'var(--linen)', padding: '16px 18px', fontSize: 13, color: 'var(--taupe)' }}>Concierge time on site is $125 per hour — one-hour minimum, then 15-minute increments.</div> : null}
        <div><Button iconRight="arrow-right" onClick={submit}>Send request</Button></div>
      </div>
      <div>
        <div style={{ ...lbl, marginBottom: 6 }}>Your requests</div>
        {mine.map(r => (
          <div key={r.id} className="mrise" style={{ padding: '24px 0', borderBottom: '1px solid var(--border-hairline)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1.2 }}>{r.title}</div>
              <div style={{ fontSize: 13, color: 'var(--stone)', marginTop: 6 }}>{r.id} · {r.received} · {statusCopy[r.status]}</div>
            </div>
            <Badge tone={statusTone(r.status)}>{r.status === 'New' ? 'Received' : r.status}</Badge>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

const REPORT = [
  ['Kitchen', [['Dishwasher door seal', 'Attention', 'Visible wear at the lower seal; this is likely the source of the leak you mentioned.'], ['Range hood filter', 'Monitor', 'Due for cleaning at the next visit.'], ['Under-sink plumbing', 'Good', '']]],
  ['Primary suite', [['Shower grout', 'Monitor', 'Fine hairline cracks at the base of the north wall.'], ['Window treatments', 'Good', '']]],
  ['Exterior', [['Gutters', 'Attention', 'Leaf build-up along the rear elevation ahead of autumn rain.'], ['Irrigation', 'Good', '']]],
  ['Mechanical', [['HVAC filters', 'Good', 'Replaced during this visit.'], ['Water heater', 'Good', '']]],
];
function ClientReports({ toast }) {
  const [which, setWhich] = React.useState('sep');
  const [asked, setAsked] = React.useState({ 'Gutters': true });
  const tone = { Good: 'success', Monitor: 'warning', Attention: 'danger' };
  return (
    <div>
      <Wrap style={{ padding: '80px 48px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
        <div><Eyebrow>Walk-through report</Eyebrow><H size={64} style={{ marginTop: 20 }}>11 September, <i>2026</i></H><div style={{ fontSize: 15, color: 'var(--taupe)', marginTop: 12 }}>Prepared by Esty Moreau · 14 Linden Crescent</div></div>
        <Tabs variant="segmented" value={which} onChange={setWhich} items={[{ id: 'sep', label: 'September' }, { id: 'aug', label: 'August' }, { id: 'jul', label: 'July' }]} />
      </Wrap>
      <Wrap style={{ paddingBottom: 120, display: 'grid', gridTemplateColumns: '280px minmax(0,1fr)', gap: 64 }}>
        <div style={{ position: 'sticky', top: 120, alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <ImageFrame src="assets/photos/kitchen-island.jpg" ratio="4 / 5" />
          <div style={{ display: 'flex', gap: 28 }}>{[['Good', 6], ['Monitor', 2], ['Attention', 2]].map(([k, v]) => <div key={k}><div style={{ fontFamily: 'var(--font-display)', fontSize: 40, lineHeight: 1 }}>{v}</div><div style={{ ...lbl, marginTop: 6 }}>{k}</div></div>)}</div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--taupe)', margin: 0 }}>Choose anything you’d like us to estimate. Nothing is booked until you approve.</p>
        </div>
        <div>
          {REPORT.map(([room, items]) => (
            <div key={room} style={{ marginBottom: 48 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, paddingBottom: 14, borderBottom: '1px solid var(--ink)' }}>{room}</div>
              {items.map(([t, s, n]) => (
                <div key={t} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 24, padding: '22px 0', borderBottom: '1px solid var(--border-hairline)', alignItems: 'center' }}>
                  <div><div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><span style={{ fontSize: 16 }}>{t}</span><Badge tone={tone[s]} dot>{s}</Badge></div>{n ? <div style={{ fontSize: 14, color: 'var(--taupe)', marginTop: 8, maxWidth: 560 }}>{n}</div> : null}</div>
                  {s !== 'Good' ? (asked[t] ? <Badge tone="accent">Estimate requested</Badge> : <Button size="s" variant="secondary" onClick={() => { setAsked(a => ({ ...a, [t]: true })); toast('Estimate requested', t + ' — Esty will send pricing shortly.'); }}>Request estimate</Button>) : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Wrap>
    </div>
  );
}

function ClientEstimates({ data, setData, toast }) {
  const mine = data.estimates.filter(e => e.member === ME && e.status !== 'Draft');
  const [sel, setSel] = React.useState(mine[0] && mine[0].id);
  const e = mine.find(x => x.id === sel) || mine[0];
  const set = (status) => { setData(d => ({ ...d, estimates: d.estimates.map(x => x.id === e.id ? { ...x, status } : x) })); toast(status === 'Approved' ? 'Thank you — approved' : 'Estimate declined', status === 'Approved' ? 'Esty will confirm a date with you.' : 'No work will be scheduled.'); };
  return (
    <Wrap style={{ padding: '80px 48px 120px' }}>
      <Eyebrow>Estimates</Eyebrow><H style={{ margin: '20px 0 48px' }}>Nothing begins <i>without your approval.</i></H>
      {e ? <div style={{ display: 'grid', gridTemplateColumns: '300px minmax(0,1fr)', gap: 56 }}>
        <div>{mine.map(x => (
          <div key={x.id} onClick={() => setSel(x.id)} style={{ padding: '20px 18px', cursor: 'pointer', borderTop: '1px solid var(--border-hairline)', background: x.id === e.id ? 'var(--porcelain)' : 'transparent', boxShadow: x.id === e.id ? 'inset 2px 0 0 var(--bronze-500)' : 'none' }}>
            <div style={{ fontSize: 15 }}>{x.title}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, alignItems: 'center' }}><span style={{ fontSize: 13, color: 'var(--stone)' }}>${x.amount.toLocaleString()}</span><Badge tone={statusTone(x.status)}>{x.status === 'Awaiting approval' ? 'Awaiting you' : x.status}</Badge></div>
          </div>))}</div>
        <Card key={e.id} padding={48} className="mrise" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={lbl}>{e.id} · Sent {e.sent}</span><Badge tone={statusTone(e.status)}>{e.status}</Badge></div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, lineHeight: 1.1 }}>{e.title}</div>
          <div>
            {e.lines.map(([l, a]) => <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderTop: '1px solid var(--border-hairline)', fontSize: 15 }}><span>{l}</span><span>${a.toLocaleString()}</span></div>)}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 18, borderTop: '1px solid var(--ink)' }}><span style={{ ...lbl, color: 'var(--ink)' }}>Total</span><span style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 300 }}>${e.amount.toLocaleString()}</span></div>
          </div>
          {e.status === 'Awaiting approval' ? <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--stone)', marginRight: 'auto' }}>Questions? Message Esty before deciding.</span>
            <Button variant="ghost" onClick={() => set('Declined')}>Decline</Button><Button variant="accent" onClick={() => set('Approved')}>Approve estimate</Button></div>
            : <div style={{ fontSize: 14, color: 'var(--taupe)' }}>{e.status === 'Approved' ? 'Approved — your concierge will confirm a date.' : 'Declined. Let us know if you change your mind.'}</div>}
        </Card>
      </div> : null}
    </Wrap>
  );
}

function ClientMembership({ data, setData, toast }) {
  const me = data.members.find(m => m.id === ME);
  const paused = me.status === 'Paused';
  const setPaused = (v) => { setData(d => ({ ...d, members: d.members.map(m => m.id === ME ? { ...m, status: v ? 'Paused' : 'Active' } : m) })); toast(v ? 'Membership paused' : 'Welcome back', v ? 'We’ll keep everything ready for your return.' : 'Your membership is active again.'); };
  const bills = [['Oct 1', 'Signature membership — October', 499], ['Sep 24', 'Concierge on site · plumber (75 min, billed 1h 15m)', 156.25], ['Sep 3', 'Concierge on site · electrician (50 min, 1h minimum)', 125], ['Sep 1', 'Signature membership — September', 499]];
  return (
    <Wrap style={{ padding: '80px 48px 120px' }}>
      <Eyebrow>Membership</Eyebrow><H style={{ margin: '20px 0 48px' }}>Signature, <i>since March 2025.</i></H>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)', gap: 24, marginBottom: 64 }}>
        <Card variant="inverse" padding={36} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ ...lbl, color: 'var(--bronze-200)' }}>Your plan</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}><span style={{ fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 300, lineHeight: 1 }}>$499</span><span style={{ fontSize: 13, color: 'var(--oat)' }}>per month</span></div>
          <div style={{ fontSize: 14, color: 'var(--sand)', lineHeight: 1.8 }}>Monthly walk-through<br />2 handyman hours each month<br />Dedicated concierge</div>
        </Card>
        <Card padding={36} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={lbl}>Renewal</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 34 }}>{me.renews}</div>
          <div style={{ fontSize: 14, color: 'var(--taupe)', lineHeight: 1.6 }}>Renews automatically. To make changes, let us know by 30 January — 30 days before your next cycle.</div>
        </Card>
        <Card padding={36} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={lbl}>Away for a while?</div>
          <div style={{ fontSize: 14, color: 'var(--taupe)', lineHeight: 1.6 }}>Pause your membership while the house is closed. Esty can still check on the home if you need.</div>
          <Switch checked={paused} onChange={setPaused} label={paused ? 'Membership paused' : 'Pause membership'} />
        </Card>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}><H size={32}>Statements</H><Button variant="link" icon="download">Download all</Button></div>
      {bills.map(([d, l, a]) => <div key={l} style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 24, padding: '20px 0', borderTop: '1px solid var(--border-hairline)', fontSize: 15 }}><span style={{ color: 'var(--stone)' }}>{d}</span><span>{l}</span><span>${a.toFixed(2)}</span></div>)}
    </Wrap>
  );
}

function ClientPortal({ data, setData, toast }) {
  const [page, setPage] = React.useState(() => localStorage.getItem('moda-client-page') || 'home');
  const go = (p) => { setPage(p); localStorage.setItem('moda-client-page', p); window.scrollTo(0, 0); };
  const P = { home: ClientHome, requests: ClientRequests, reports: ClientReports, estimates: ClientEstimates, membership: ClientMembership }[page] || ClientHome;
  const [chat, setChat] = React.useState(false);
  return (
    <div style={{ minHeight: '100vh', background: 'var(--ivory)' }}>
      <ClientHeader page={page} go={go} />
      <div key={page} className="mrise"><P go={go} data={data} setData={setData} toast={toast} openChat={() => setChat(true)} /></div>
      <ChatDrawer open={chat} onClose={() => setChat(false)} data={data} setData={setData} toast={toast} />
      {!chat ? <button onClick={() => setChat(true)} style={{ position: 'fixed', right: 32, bottom: 32, zIndex: 90, height: 52, padding: '0 22px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bronze-500)', color: 'var(--white)', border: 'none', borderRadius: 999, cursor: 'pointer', boxShadow: 'var(--shadow-float)', fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase' }}><Icon name="message-square" size={17} />Concierge</button> : null}
      <footer style={{ borderTop: '1px solid var(--border-hairline)' }}><Wrap style={{ height: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--stone)' }}><span>Moda Management · Member portal</span><span>Urgent? Call or text the Moda line — answered day and night.</span></Wrap></footer>
    </div>
  );
}
Object.assign(window, { ClientPortal });
})();
