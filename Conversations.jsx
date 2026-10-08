(() => {
const { Icon, Eyebrow, Button, IconButton, Badge, Tag, Avatar, Input, Card, Stat, Tabs } = window.Moda;
const CH_ICON = { Call: 'phone', Text: 'message-square', Email: 'mail', Portal: 'monitor', 'Walk-through': 'clipboard-check' };
const ST_TONE = { 'Needs a human': 'danger', 'Handled by AI': 'success', 'Handed off': 'info', 'Taken over': 'accent', 'Resolved': 'neutral' };
const lbl = { fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500, color: 'var(--stone)' };
function AiMark({ size = 30 }) {
  return <span style={{ width: size, height: size, borderRadius: size, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bronze-100)', color: 'var(--bronze-700)', border: '1px solid var(--bronze-600)' }}><Icon name="sparkles" size={size * 0.5} /></span>;
}
function Conversations({ go, data, setData, toast }) {
  const [tab, setTab] = React.useState('all');
  const [sel, setSel] = React.useState(data.conversations[0].id);
  const [reply, setReply] = React.useState('');
  const m = (id) => data.members.find(x => x.id === id);
  const list = data.conversations.filter(c => tab === 'all' ? true : tab === 'human' ? c.status === 'Needs a human' : c.channel === tab);
  const c = data.conversations.find(x => x.id === sel) || list[0];
  const upd = (patch) => setData(d => ({ ...d, conversations: d.conversations.map(x => x.id === c.id ? { ...x, ...patch } : x) }));
  const needs = data.conversations.filter(x => x.status === 'Needs a human').length;
  const send = () => { if (!reply.trim()) return; upd({ transcript: [...c.transcript, ['staff', reply.trim()]], status: 'Taken over' }); setReply(''); toast('Sent as Esty', 'Delivered by ' + (c.channel === 'Call' ? 'text' : c.channel.toLowerCase())); };
  return (
    <div>
      <TopBar crumbs={[{ label: 'Concierge AI' }]} actions={<Button size="s" variant="secondary" icon="settings-2">AI settings</Button>} />
      <div style={{ padding: '48px 48px 0' }}>
        <PageHead eyebrow="Live · answering calls, texts & email" title={<>Concierge <i>conversations</i></>} sub="The AI concierge answers every member, logs requests and drafts estimates. Anything it can’t resolve lands here for a person."
          right={<div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: '1px solid var(--border-hairline)', whiteSpace: 'nowrap', flexShrink: 0 }}><span style={{ width: 8, height: 8, borderRadius: 8, background: 'var(--sage)', boxShadow: '0 0 0 4px var(--sage-wash)' }}></span><span style={{ fontSize: 13 }}>AI concierge online</span></div>} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', border: '1px solid var(--border-hairline)', background: 'var(--porcelain)', marginBottom: 32 }}>
          {[['Handled today', '23', null, '91% without a person'], ['Average first reply', '38', 'sec', 'Promise: 24 hours'], ['Calls answered', '11', '/ 11', 'None missed'], ['Needs a human', String(needs), null, 'Oldest: 14 min']].map(([l, v, u, cap], i) => (
            <div key={l} style={{ padding: 28, borderLeft: i ? '1px solid var(--border-hairline)' : 'none' }}><Stat label={l} value={v} unit={u} caption={cap} /></div>
          ))}
        </div>
        <Tabs value={tab} onChange={setTab} items={[{ id: 'all', label: 'All' }, { id: 'human', label: 'Needs a human', count: needs }, { id: 'Call', label: 'Calls' }, { id: 'Text', label: 'Texts' }, { id: 'Email', label: 'Email' }]} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 340px) minmax(0,1fr)', minHeight: 640 }}>
        <div style={{ borderRight: '1px solid var(--border-hairline)' }}>
          {list.map(x => { const on = c && x.id === c.id; return (
            <div key={x.id} onClick={() => setSel(x.id)} style={{ padding: '20px 24px 20px 48px', borderBottom: '1px solid var(--border-hairline)', cursor: 'pointer', background: on ? 'var(--porcelain)' : 'transparent', boxShadow: on ? 'inset 2px 0 0 var(--bronze-500)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}><Icon name={CH_ICON[x.channel]} size={15} color="var(--bronze-700)" />{x.from}</span>
                <span style={{ fontSize: 11, color: 'var(--stone)', whiteSpace: 'nowrap' }}>{x.when}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--taupe)', margin: '8px 0 10px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{x.summary}</div>
              <Badge tone={ST_TONE[x.status]} dot>{x.status}</Badge>
            </div>); })}
        </div>
        {c ? (
          <div key={c.id} className="mrise" style={{ padding: '32px 40px 48px', display: 'flex', flexWrap: 'wrap-reverse', gap: 32, alignItems: 'flex-start' }}>
            <div style={{ flex: '999 1 420px', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}><Badge tone={ST_TONE[c.status]} dot>{c.status}</Badge><span style={{ fontSize: 12, color: 'var(--stone)' }}>{c.id} · {c.channel} · {c.duration} · {c.when}</span></div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, lineHeight: 1.15 }}>{c.from}</div>
              {c.member ? <div onClick={() => go('member', c.member)} style={{ fontSize: 14, color: 'var(--bronze-700)', cursor: 'pointer', marginTop: 4 }}>{m(c.member).name} · {m(c.member).tier}</div> : <div style={{ fontSize: 14, color: 'var(--stone)', marginTop: 4 }}>Not yet a member</div>}
              {c.status === 'Needs a human' ? <div style={{ marginTop: 24, padding: '16px 18px', background: 'var(--oxblood-wash)', color: 'var(--oxblood)', fontSize: 14, display: 'flex', gap: 12, alignItems: 'flex-start' }}><Icon name="hand" size={18} /><span><b style={{ fontWeight: 500 }}>Why it was escalated:</b> {c.reason}</span></div> : null}
              {c.channel === 'Call' ? <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', border: '1px solid var(--border-hairline)' }}>
                <IconButton icon="play" label="Play recording" variant="outline" size="s" />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, height: 28 }}>{Array.from({ length: 64 }).map((_, i) => <span key={i} style={{ flex: 1, height: 4 + Math.abs(Math.sin(i * 1.7) * 22) + (i % 5), background: i < 22 ? 'var(--bronze-500)' : 'var(--sand)' }}></span>)}</div>
                <span style={{ fontSize: 12, color: 'var(--stone)' }}>{c.duration}</span>
              </div> : null}
              <div style={{ ...lbl, margin: '32px 0 16px' }}>{c.channel === 'Call' ? 'Transcript' : 'Thread'}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {c.transcript.map(([who, t], i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexDirection: who === 'member' ? 'row' : 'row' }}>
                    {who === 'ai' ? <AiMark /> : who === 'staff' ? <Avatar name="Esty Moreau" size={30} tone="bronze" /> : <Avatar name={c.from} size={30} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: 'var(--stone)', marginBottom: 4 }}>{who === 'ai' ? 'Moda concierge · AI' : who === 'staff' ? 'Esty Moreau' : c.from.split(' ·')[0]}</div>
                      <div style={{ fontSize: 15, lineHeight: 1.6, color: who === 'member' ? 'var(--ink)' : 'var(--taupe)' }}>{t}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
                <Input multiline rows={3} placeholder={'Reply to ' + c.from.split(' ·')[0] + ' as Esty — the AI pauses on this thread while you’re in it'} value={reply} onChange={(e) => setReply(e.target.value)} />
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, minWidth: 0 }}>
                  <Button size="s" variant="ghost" icon="sparkles" onClick={() => setReply(c.status === 'Needs a human' ? 'Hi Owen, it’s Esty. I’ve looked at September — the $125 was for meeting the electrician on site. I’m sorry that wasn’t clearer at the time; I’d be glad to talk it through whenever suits you.' : 'Thank you — all noted. Esty')}>Draft with AI</Button>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {c.channel === 'Call' || c.status === 'Needs a human' ? <Button size="s" variant="secondary" icon="phone" onClick={() => { upd({ status: 'Taken over' }); toast('Calling ' + c.from.split(' ·')[0], 'Bridging through the Moda line'); }}>Call back</Button> : null}
                    <Button size="s" iconRight="send" onClick={send}>Send</Button>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ flex: '1 1 260px', maxWidth: 360, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Card padding={24} variant="sunken" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><AiMark size={24} /><span style={lbl}>AI summary</span></div>
                <div style={{ fontSize: 14, lineHeight: 1.65 }}>{c.summary}</div>
              </Card>
              <Card padding={24} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ ...lbl, marginBottom: 8 }}>What the AI did</div>
                {c.actions.map(a => <div key={a} style={{ display: 'flex', gap: 10, fontSize: 14, padding: '8px 0', borderTop: '1px solid var(--border-hairline)' }}><Icon name="check" size={15} color="var(--sage)" style={{ marginTop: 3 }} />{a}</div>)}
              </Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {c.status !== 'Resolved' ? <Button full variant="secondary" icon="check" onClick={() => { upd({ status: 'Resolved' }); toast('Marked resolved', c.id); }}>Mark resolved</Button> : null}
                {c.status === 'Taken over' ? <Button full variant="ghost" icon="sparkles" onClick={() => { upd({ status: 'Handled by AI' }); toast('Handed back to AI', 'The concierge will continue this thread'); }}>Hand back to AI</Button> : null}
              </div>
            </div>
          </div>
        ) : <div></div>}
      </div>
    </div>
  );
}
Object.assign(window, { Conversations, AiMark });
})();
