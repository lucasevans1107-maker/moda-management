import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { CATEGORY_LABELS } from '../types';
import type { ServiceCategory, RequestChannel } from '../types';
import { assessUrgency, getResponseDeadline } from '../lib/urgency';

export default function NewRequest() {
  const { homeowners, properties, createRequest } = useStore();
  const navigate = useNavigate();
  const [homeownerId, setHomeownerId] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('other');
  const [channel, setChannel] = useState<RequestChannel>('portal');
  const [description, setDescription] = useState('');
  const urgency = assessUrgency(description, category);
  const field = 'mt-2 w-full bg-canvas border border-line rounded-lg p-3 text-sm';
  function submit(event: FormEvent) {
    event.preventDefault();
    const property = properties.find(p => p.id === propertyId && p.homeownerId === homeownerId);
    if (!property || !description.trim()) return;
    const now = new Date().toISOString();
    const request = createRequest({ homeownerId, propertyId, category, channel, issueDescription: description.trim(), urgency: urgency.level, urgencyReason: urgency.reason, status: 'needs_review', createdAt: now, humanResponseDue: getResponseDeadline(now).toISOString(), assignedCoordinatorId: property.assignedCoordinatorId });
    navigate(`/requests/${request.id}`);
  }
  return <div className="p-8 max-w-3xl mx-auto"><Link to="/requests" className="text-sm text-muted">← Back to requests</Link><h1 className="text-2xl font-semibold mt-6">New request</h1><p className="text-sm text-muted mt-2 mb-6">Record a client service request for coordinator review.</p><form onSubmit={submit} className="bg-surface border border-line rounded-xl p-6 space-y-5">
    <label className="block text-sm">Client<select required className={field} value={homeownerId} onChange={e => {setHomeownerId(e.target.value);setPropertyId('');}}><option value="">Select a client</option>{homeowners.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}</select></label>
    <label className="block text-sm">Property<select required className={field} value={propertyId} onChange={e => setPropertyId(e.target.value)}><option value="">Select a property</option>{properties.filter(p => p.homeownerId === homeownerId).map(p => <option key={p.id} value={p.id}>{p.address.street}</option>)}</select></label>
    <div className="grid sm:grid-cols-2 gap-5"><label className="block text-sm">Category<select className={field} value={category} onChange={e => setCategory(e.target.value as ServiceCategory)}>{Object.entries(CATEGORY_LABELS).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="block text-sm">Received through<select className={field} value={channel} onChange={e => setChannel(e.target.value as RequestChannel)}><option value="portal">Manual entry / portal</option><option value="phone">Phone</option><option value="text">SMS</option><option value="email">Email</option></select></label></div>
    <label className="block text-sm">Issue description<textarea required rows={5} className={field} value={description} onChange={e => setDescription(e.target.value)} /></label>
    {urgency.emergencyInstructions && <p role="alert" className="p-4 bg-red-950 text-red-300 border border-red-800 rounded-lg text-sm">{urgency.emergencyInstructions}</p>}
    <p className="text-xs text-muted">Demo record only. This form does not send messages or contact a provider.</p><button type="submit" className="rounded-lg bg-raised border border-line px-5 py-3 text-sm font-medium text-accent">Create request</button>
  </form></div>;
}
