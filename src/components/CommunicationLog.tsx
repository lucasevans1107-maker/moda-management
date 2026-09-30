import { Link } from 'react-router-dom';
import { Phone, MessageSquare, Mail, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { Communication } from '../types';
import { formatDateTime } from '../lib/format';

const CHANNEL_LABELS = { phone: 'Call', text: 'SMS', email: 'Email' };
const ICONS = { phone: Phone, text: MessageSquare, email: Mail };

export default function CommunicationLog({ entries }: { entries: Communication[] }) {
  if (!entries.length) return <p className="p-8 text-sm text-muted text-center">No communication records match this view.</p>;
  return <div className="divide-y divide-line">{entries.map(c => {
    const Icon = ICONS[c.channel];
    return <details key={c.id} className="group p-5">
      <summary className="cursor-pointer flex flex-wrap items-center gap-4 rounded-lg">
        <span className="rounded-xl p-3 bg-raised text-accent"><Icon size={18} /></span>
        <div className="flex-1 min-w-40"><p className="text-sm font-medium text-ink">{c.contactName} <span className="text-muted font-normal">· {CHANNEL_LABELS[c.channel]}</span></p><p className="text-xs text-muted mt-1">{formatDateTime(c.occurredAt)}</p></div>
        <span className="text-xs text-muted flex items-center gap-1">{c.direction === 'inbound' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}{c.direction}</span>
        <span className={`text-xs px-2.5 py-1 rounded-full ${c.outcome === 'handled' ? 'bg-green-950 text-green-300' : 'bg-amber-950 text-amber-300'}`}>{c.outcome === 'handled' ? 'Handled' : 'Needs follow-up'}</span>
        <span className="text-xs text-muted group-open:hidden">View details +</span>
      </summary>
      <div className="mt-4 md:ml-16 space-y-3 text-sm"><p className="text-ink whitespace-pre-wrap">{c.summary}</p><p className="text-muted">Contact: {c.contactAddress}</p><p className="text-xs text-muted">{c.source === 'demo' ? 'Demo record · recorded request intake; no live call or message sent.' : 'Connected communication record'} · ID: {c.id}</p><div className="flex gap-5">{c.homeownerId && <Link className="text-accent underline" to={`/clients/${c.homeownerId}`}>Client profile</Link>}{c.requestId && <Link className="text-accent underline" to={`/requests/${c.requestId}`}>Request & full activity trail</Link>}</div></div>
    </details>;
  })}</div>;
}
