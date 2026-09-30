import { useState } from 'react';
import { Phone, MessageSquare, Mail, Activity } from 'lucide-react';
import { useStore } from '../store';
import { inCurrentMonth } from '../lib/crm';
import CommunicationLog from '../components/CommunicationLog';

export default function Receptionist() {
  const communications = useStore(s => s.communications);
  const [channel, setChannel] = useState('all');
  const [period, setPeriod] = useState('month');
  const [query, setQuery] = useState('');
  const periodEntries = communications.filter(c => period === 'all' || inCurrentMonth(c.occurredAt));
  const entries = periodEntries.filter(c => (channel === 'all' || c.channel === channel) && `${c.contactName} ${c.contactAddress} ${c.summary}`.toLowerCase().includes(query.toLowerCase())).sort((a,b) => b.occurredAt.localeCompare(a.occurredAt));
  const stats = [
    { label: 'Calls logged', value: periodEntries.filter(c => c.channel === 'phone').length, icon: Phone },
    { label: 'SMS messages', value: periodEntries.filter(c => c.channel === 'text').length, icon: MessageSquare },
    { label: 'Emails', value: periodEntries.filter(c => c.channel === 'email').length, icon: Mail },
    { label: 'Needs follow-up', value: periodEntries.filter(c => c.outcome === 'needs_follow_up').length, icon: Activity },
  ];
  return <div className="p-8 max-w-7xl mx-auto"><p className="text-xs uppercase tracking-[0.2em] text-accent mb-3">Communication center</p><h1 className="text-2xl font-semibold">Receptionist</h1><p className="text-sm text-muted mt-2 mb-6">Calls, messages, and a clear trail of every recorded interaction.</p>
    <div className="bg-surface border border-line rounded-xl p-5 mb-6 flex flex-wrap gap-4 justify-between items-center"><div><p className="font-medium text-sm">Phone number not connected</p><p className="text-xs text-muted mt-2">Demo activity only. Live calls, SMS, and email will appear after the receptionist integration is connected.</p></div><span className="text-xs rounded-full bg-amber-950 text-amber-300 px-3 py-1.5">Demo mode</span></div>
    <div className="flex justify-end mb-4"><select aria-label="Activity period" value={period} onChange={e => setPeriod(e.target.value)} className="text-sm bg-surface border border-line rounded-lg px-3 py-2"><option value="month">This month (CT)</option><option value="all">All time</option></select></div>
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">{stats.map(s => <div key={s.label} className="bg-surface border border-line rounded-xl p-5"><div className="flex items-center justify-between text-muted"><p className="text-xs uppercase tracking-wider">{s.label}</p><s.icon size={17} /></div><p className="text-3xl font-semibold mt-4">{s.value}</p></div>)}</div>
    <section className="bg-surface border border-line rounded-xl overflow-hidden"><div className="p-5 border-b border-line"><div className="flex flex-wrap gap-4 justify-between items-center mb-4"><h2 className="font-semibold">Activity log <span className="text-muted font-normal">({entries.length})</span></h2><input aria-label="Search communications" placeholder="Search contacts or activity…" value={query} onChange={e => setQuery(e.target.value)} className="bg-canvas border border-line rounded-lg px-3 py-2 text-sm w-full sm:w-72" /></div><div className="flex flex-wrap gap-2">{[['all','All activity'],['phone','Calls'],['text','SMS'],['email','Emails']].map(([value,label]) => <button key={value} aria-pressed={channel === value} onClick={() => setChannel(value)} className={`px-3 py-2 rounded-lg text-xs font-medium ${channel === value ? 'bg-raised text-accent' : 'text-muted hover:bg-raised'}`}>{label}</button>)}</div></div><CommunicationLog entries={entries} /></section>
  </div>;
}
