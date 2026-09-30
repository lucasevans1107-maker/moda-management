import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../store';
import { assessUrgency } from '../lib/urgency';
import { CATEGORY_LABELS } from '../types';
import type { ServiceCategory } from '../types';
import clsx from 'clsx';

type Step =
  | 'welcome'
  | 'identify'
  | 'verify'
  | 'confirm_property'
  | 'capture_issue'
  | 'followup'
  | 'urgency_assessment'
  | 'review'
  | 'done'
  | 'unverified_collect'
  | 'unverified_issue'
  | 'unverified_urgency'
  | 'unverified_done';

const STEP_LABELS: Partial<Record<Step, string>> = {
  welcome: 'Welcome',
  identify: 'Identify',
  verify: 'Verify',
  confirm_property: 'Confirm Property',
  capture_issue: 'Issue',
  followup: 'Follow-up',
  urgency_assessment: 'Urgency',
  review: 'Review',
  done: 'Done',
};

const MAIN_STEPS: Step[] = ['welcome', 'identify', 'verify', 'confirm_property', 'capture_issue', 'followup', 'urgency_assessment', 'review', 'done'];

const FOLLOWUP_QUESTIONS: Partial<Record<ServiceCategory, string[]>> = {
  hvac: [
    'Is the system currently running (fan/compressor)?',
    'What temperature is the thermostat showing vs. what you\'ve set it to?',
    'When did you first notice the problem?',
  ],
  plumbing: [
    'Is there active water flow or dripping?',
    'Has the water supply been shut off?',
    'Is the issue localized to one fixture or affecting multiple areas?',
  ],
  electrical: [
    'Are any breakers tripped?',
    'Is the issue limited to one circuit or area?',
    'Is there any burning smell or visible damage?',
  ],
};

function getFollowups(cat: ServiceCategory): string[] {
  return FOLLOWUP_QUESTIONS[cat] ?? [
    'How long has this been happening?',
    'Is there any immediate safety concern?',
    'Has this happened before?',
  ];
}

function StepIndicator({ current, steps }: { current: Step; steps: Step[] }) {
  const idx = steps.indexOf(current);
  return (
    <div className="flex items-center gap-1 mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div className={clsx(
            'w-2 h-2 rounded-full',
            i < idx ? 'bg-green-500' : i === idx ? 'bg-indigo-600' : 'bg-stone-200'
          )} />
          {i < steps.length - 1 && <div className="w-6 h-px bg-stone-200" />}
        </div>
      ))}
      {STEP_LABELS[current] && (
        <span className="ml-3 text-xs text-slate-400">{STEP_LABELS[current]}</span>
      )}
    </div>
  );
}

export default function Receptionist() {
  const navigate = useNavigate();
  const homeowners = useStore((s) => s.homeowners);
  const properties = useStore((s) => s.properties);
  const createRequest = useStore((s) => s.createRequest);

  const [step, setStep] = useState<Step>('welcome');
  const [, setIsMember] = useState<boolean | null>(null);
  const [lookupInput, setLookupInput] = useState('');
  const [matchedHomeownerId, setMatchedHomeownerId] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [issueDescription, setIssueDescription] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('other');
  const [followupAnswers, setFollowupAnswers] = useState<string[]>([]);
  const [urgencyResult, setUrgencyResult] = useState<ReturnType<typeof assessUrgency> | null>(null);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);
  const [createdRefNumber, setCreatedRefNumber] = useState<string | null>(null);
  const idempotencyKey = useRef(Math.random().toString(36));

  // Unverified path
  const [callbackName, setCallbackName] = useState('');
  const [callbackPhone, setCallbackPhone] = useState('');

  const matchedHomeowner = homeowners.find((h) => h.id === matchedHomeownerId);
  const matchedProperties = properties.filter((p) => p.homeownerId === matchedHomeownerId);
  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);
  const followupQuestions = getFollowups(category);

  function handleLookup() {
    const lc = lookupInput.toLowerCase().trim();
    const match = homeowners.find(
      (h) => h.name.toLowerCase().includes(lc) || h.phone.replace(/\D/g, '').includes(lc.replace(/\D/g, ''))
    );
    if (match) {
      setMatchedHomeownerId(match.id);
      setStep('verify');
    } else {
      setStep('unverified_collect');
    }
  }

  function handleAssessUrgency() {
    const fullDesc = [issueDescription, ...followupAnswers.filter(Boolean)].join('\n');
    const result = assessUrgency(fullDesc, category);
    setUrgencyResult(result);
    setStep('urgency_assessment');
  }

  function handleCreateRequest() {
    const now = new Date();
    const due = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const req = createRequest({
      propertyId: selectedPropertyId ?? '',
      homeownerId: matchedHomeownerId ?? '',
      channel: 'receptionist',
      issueDescription: [issueDescription, ...followupAnswers.filter(Boolean)].join('\n---\n'),
      category,
      urgency: urgencyResult?.level ?? 'routine',
      urgencyReason: urgencyResult?.reason ?? '',
      status: 'new',
      createdAt: now.toISOString(),
      humanResponseDue: due.toISOString(),
      suggestedVendorId: undefined,
      suggestedVendorReason: undefined,
    });
    setCreatedRequestId(req.id);
    setCreatedRefNumber(req.referenceNumber);
    setStep('done');
  }

  function handleCreateUnverifiedRequest() {
    const now = new Date();
    const due = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const result = urgencyResult ?? assessUrgency(issueDescription, category);
    const req = createRequest({
      propertyId: '',
      homeownerId: '',
      channel: 'receptionist',
      issueDescription,
      category,
      urgency: result.level,
      urgencyReason: result.reason,
      status: 'needs_review',
      createdAt: now.toISOString(),
      humanResponseDue: due.toISOString(),
      isUnverifiedInquiry: true,
      callerCallbackName: callbackName,
      callerCallbackPhone: callbackPhone,
    });
    setCreatedRequestId(req.id);
    setCreatedRefNumber(req.referenceNumber);
    setStep('unverified_done');
  }

  function reset() {
    setStep('welcome');
    setIsMember(null);
    setLookupInput('');
    setMatchedHomeownerId(null);
    setVerified(false);
    setSelectedPropertyId(null);
    setIssueDescription('');
    setCategory('other');
    setFollowupAnswers([]);
    setUrgencyResult(null);
    setCreatedRequestId(null);
    setCreatedRefNumber(null);
    setCallbackName('');
    setCallbackPhone('');
    idempotencyKey.current = Math.random().toString(36);
  }

  const isMainFlow = MAIN_STEPS.includes(step);

  return (
    <div className="p-8 max-w-2xl">
      <div className="bg-amber-950 border border-amber-800 rounded-lg px-4 py-2 text-xs text-amber-300 mb-6 font-medium">
        GUIDED DEMO — Not live AI. Responses are simulated, not AI-generated.
      </div>

      <h1 className="text-2xl font-semibold text-slate-100 mb-1">Receptionist Intake</h1>
      <p className="text-slate-400 text-sm mb-8">Simulate a homeowner call from first contact to service request creation.</p>

      {isMainFlow && <StepIndicator current={step} steps={MAIN_STEPS} />}

      {/* STEP: Welcome */}
      {step === 'welcome' && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-100 mb-2">Thank you for calling Moda Management.</h2>
          <p className="text-slate-300 text-sm mb-6">Is this caller an existing Moda member?</p>
          <div className="flex gap-3">
            <button onClick={() => { setIsMember(true); setStep('identify'); }} className="flex-1 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors">
              Yes — Existing member
            </button>
            <button onClick={() => { setIsMember(false); setStep('unverified_collect'); }} className="flex-1 py-3 border border-slate-600 text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-950 transition-colors">
              No / Not sure
            </button>
          </div>
        </div>
      )}

      {/* STEP: Identify */}
      {step === 'identify' && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-100 mb-2">Member Lookup</h2>
          <p className="text-slate-300 text-sm mb-4">Enter the caller's name or phone number to locate their account.</p>
          <div className="flex gap-3">
            <input
              value={lookupInput}
              onChange={(e) => setLookupInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              placeholder="Name or phone..."
              className="flex-1 text-sm border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-300"
            />
            <button onClick={handleLookup} disabled={!lookupInput.trim()} className="px-4 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 disabled:opacity-40 transition-colors flex items-center gap-1">
              Look up <ArrowRight size={14} />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-3 italic">Try: "Claire", "Marcus", or a phone number. Caller ID alone does not verify identity.</p>
          <button onClick={() => setStep('welcome')} className="text-xs text-slate-400 mt-4 hover:text-slate-300">Back</button>
        </div>
      )}

      {/* STEP: Verify */}
      {step === 'verify' && matchedHomeowner && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-100 mb-2">Identity Verification</h2>
          <div className="bg-slate-950 rounded-lg p-4 mb-4 text-sm text-slate-300">
            Account found for <strong>{matchedHomeowner.name}</strong>. Before we can share any account information, we need to verify the caller's identity.
          </div>
          <div className="bg-amber-950 border border-amber-800 rounded-lg p-4 mb-4 text-xs text-amber-300">
            <strong>[DEMO]</strong> In production, this step would involve a verification question or code. For this simulation, click below to simulate a successful verification.
            <p className="mt-1 italic">Property history and account details are not visible until after this step.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setVerified(true); setSelectedPropertyId(matchedProperties[0]?.id ?? null); setStep('confirm_property'); }}
              className="px-4 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Simulate Verification [DEMO]
            </button>
            <button onClick={() => setStep('unverified_collect')} className="text-sm text-slate-400 hover:text-slate-200 px-3">
              Verification failed — collect callback
            </button>
          </div>
        </div>
      )}

      {/* STEP: Confirm Property */}
      {step === 'confirm_property' && verified && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-100 mb-2">Confirm Property</h2>
          {matchedProperties.length === 1 ? (
            <>
              <p className="text-slate-300 text-sm mb-4">Is this the property you're calling about?</p>
              <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 mb-4">
                <p className="font-medium text-slate-100">{matchedProperties[0].address.street}</p>
                <p className="text-slate-400 text-sm">{matchedProperties[0].address.city}, {matchedProperties[0].address.state} {matchedProperties[0].address.zip}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setSelectedPropertyId(matchedProperties[0].id); setStep('capture_issue'); }}
                  className="px-4 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 transition-colors"
                >
                  Yes, this property
                </button>
                <button onClick={() => setStep('unverified_collect')} className="text-sm text-slate-400 hover:text-slate-200 px-3">
                  Different address — take as inquiry
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-slate-300 text-sm mb-4">Which property is this about?</p>
              <div className="space-y-2 mb-4">
                {matchedProperties.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPropertyId(p.id)}
                    className={clsx('w-full text-left border rounded-lg p-3 transition-colors', selectedPropertyId === p.id ? 'border-stone-800 bg-slate-950' : 'border-slate-700 hover:bg-slate-950')}
                  >
                    <p className="text-sm font-medium text-slate-100">{p.address.street}</p>
                    <p className="text-xs text-slate-400">{p.address.city}, {p.address.state} {p.address.zip}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep('capture_issue')}
                disabled={!selectedPropertyId}
                className="px-4 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 disabled:opacity-40 transition-colors"
              >
                Continue <ArrowRight size={14} className="inline ml-1" />
              </button>
            </>
          )}
        </div>
      )}

      {/* STEP: Capture Issue */}
      {step === 'capture_issue' && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-100 mb-2">Describe the Issue</h2>
          {selectedProperty && (
            <p className="text-xs text-slate-400 mb-4">Property: {selectedProperty.address.street}</p>
          )}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                className="w-full text-sm border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-300"
              >
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Issue description</label>
              <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                rows={4}
                placeholder="Describe what the homeowner is experiencing..."
                className="w-full text-sm border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-300"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => { setFollowupAnswers(new Array(getFollowups(category).length).fill('')); setStep('followup'); }}
              disabled={!issueDescription.trim()}
              className="px-4 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 disabled:opacity-40 transition-colors"
            >
              Continue <ArrowRight size={14} className="inline ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* STEP: Follow-up Questions */}
      {step === 'followup' && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-100 mb-2">A few follow-up questions</h2>
          <p className="text-slate-400 text-sm mb-4">Category: {CATEGORY_LABELS[category]}</p>
          <div className="space-y-4">
            {followupQuestions.map((q, i) => (
              <div key={i}>
                <label className="text-xs font-medium text-slate-300 block mb-1">{q}</label>
                <input
                  value={followupAnswers[i] ?? ''}
                  onChange={(e) => {
                    const updated = [...followupAnswers];
                    updated[i] = e.target.value;
                    setFollowupAnswers(updated);
                  }}
                  className="w-full text-sm border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-300"
                  placeholder="Homeowner's response..."
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleAssessUrgency}
            className="mt-5 px-4 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Assess Urgency <ArrowRight size={14} className="inline ml-1" />
          </button>
        </div>
      )}

      {/* STEP: Urgency Assessment */}
      {step === 'urgency_assessment' && urgencyResult && (
        <div className="space-y-4">
          {urgencyResult.level === 'immediate_danger' ? (
            <div className="bg-red-950 border border-red-300 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle size={24} className="text-red-300" />
                <h2 className="text-lg font-bold text-red-300">Immediate Danger Reported</h2>
              </div>
              <p className="text-red-300 font-medium mb-3">This report indicates a possible life safety hazard.</p>
              <div className="bg-red-950 rounded-lg p-4 mb-4">
                <p className="text-red-300 text-sm font-semibold mb-1">Emergency Instructions:</p>
                <p className="text-red-300 text-sm">{urgencyResult.emergencyInstructions}</p>
              </div>
              <p className="text-red-300 text-sm font-medium mb-4">Moda does not provide emergency dispatch. Direct the caller to the appropriate emergency service immediately.</p>
              <div className="bg-slate-900 rounded-lg p-3 text-xs text-slate-400 mb-4">
                Urgency rationale: {urgencyResult.reason}
              </div>
              <button onClick={() => setStep('review')} className="px-4 py-2.5 bg-red-700 text-white text-sm rounded-lg hover:bg-red-800 transition-colors">
                Continue — Create Escalation Record
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-medium text-slate-100 mb-3">Urgency Assessment</h2>
              <div className={clsx(
                'rounded-lg p-4 mb-4',
                urgencyResult.level === 'urgent' ? 'bg-orange-950 border border-orange-800' : 'bg-slate-950 border border-slate-700'
              )}>
                <p className={clsx('font-semibold mb-1', urgencyResult.level === 'urgent' ? 'text-orange-300' : 'text-slate-200')}>
                  {urgencyResult.level === 'urgent' ? 'Urgent' : 'Routine'}
                </p>
                <p className="text-sm text-slate-300">{urgencyResult.reason}</p>
              </div>
              <button onClick={() => setStep('review')} className="px-4 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 transition-colors">
                Continue to Review <ArrowRight size={14} className="inline ml-1" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP: Review & Create */}
      {step === 'review' && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-100 mb-4">Review & Create Request</h2>
          <div className="space-y-3 mb-6">
            <div className="bg-slate-950 rounded-lg p-3 text-sm">
              <p className="text-xs text-slate-400 mb-0.5">Property</p>
              <p className="text-slate-200">{selectedProperty ? `${selectedProperty.address.street}, ${selectedProperty.address.city}` : '—'}</p>
            </div>
            <div className="bg-slate-950 rounded-lg p-3 text-sm">
              <p className="text-xs text-slate-400 mb-0.5">Issue</p>
              <p className="text-slate-200">{issueDescription}</p>
            </div>
            <div className="bg-slate-950 rounded-lg p-3 text-sm">
              <p className="text-xs text-slate-400 mb-0.5">Category</p>
              <p className="text-slate-200">{CATEGORY_LABELS[category]}</p>
            </div>
            <div className="bg-slate-950 rounded-lg p-3 text-sm">
              <p className="text-xs text-slate-400 mb-0.5">Urgency</p>
              <p className={clsx('font-medium', urgencyResult?.level === 'immediate_danger' ? 'text-red-300' : urgencyResult?.level === 'urgent' ? 'text-orange-300' : 'text-slate-200')}>
                {urgencyResult?.level === 'immediate_danger' ? 'Immediate Danger' : urgencyResult?.level === 'urgent' ? 'Urgent' : 'Routine'}
              </p>
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-400 mb-4">
            A Moda coordinator will follow up within 24 hours. This is not a promise to resolve the issue within 24 hours.
          </div>
          <button
            onClick={handleCreateRequest}
            className="w-full py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Create Service Request
          </button>
        </div>
      )}

      {/* STEP: Done */}
      {step === 'done' && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle size={24} className="text-green-300" />
            <h2 className="text-lg font-medium text-slate-100">Request Created</h2>
          </div>
          <div className="bg-slate-950 rounded-lg p-4 mb-4">
            <p className="text-xs text-slate-400 mb-0.5">Reference number</p>
            <p className="font-mono text-lg font-semibold text-slate-100">{createdRefNumber}</p>
          </div>
          <p className="text-slate-300 text-sm mb-2">A Moda coordinator will follow up within 24 hours.</p>
          <p className="text-xs text-slate-400 mb-6 italic">This does not mean the issue will be resolved within 24 hours. The 24-hour window applies to a human response, not resolution.</p>
          <div className="flex gap-3">
            <button
              onClick={() => createdRequestId && navigate(`/requests/${createdRequestId}`)}
              className="px-4 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 transition-colors"
            >
              View Request
            </button>
            <button onClick={reset} className="px-4 py-2.5 border border-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-950 transition-colors">
              New Intake
            </button>
          </div>
        </div>
      )}

      {/* UNVERIFIED PATH: Collect callback */}
      {step === 'unverified_collect' && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-100 mb-2">Collect Callback Information</h2>
          <div className="bg-orange-950 border border-orange-800 rounded-lg p-3 mb-4 text-xs text-orange-300">
            Caller identity not confirmed or property not matched. Collecting inquiry details only. Do not disclose any account information.
          </div>
          <div className="space-y-3 mb-4">
            <input value={callbackName} onChange={(e) => setCallbackName(e.target.value)} placeholder="Caller's name" className="w-full text-sm border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-300" />
            <input value={callbackPhone} onChange={(e) => setCallbackPhone(e.target.value)} placeholder="Callback phone number" className="w-full text-sm border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-300" />
          </div>
          <button
            onClick={() => setStep('unverified_issue')}
            disabled={!callbackName.trim() || !callbackPhone.trim()}
            className="px-4 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 disabled:opacity-40 transition-colors"
          >
            Continue <ArrowRight size={14} className="inline ml-1" />
          </button>
        </div>
      )}

      {/* UNVERIFIED PATH: Capture issue */}
      {step === 'unverified_issue' && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-100 mb-2">Describe the Issue</h2>
          <div className="bg-orange-950 border border-orange-800 rounded-lg p-3 mb-4 text-xs text-orange-300">
            Unverified inquiry. Urgency is still assessed for safety purposes.
          </div>
          <div className="space-y-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceCategory)}
              className="w-full text-sm border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-300"
            >
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <textarea
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              rows={4}
              placeholder="Describe the issue..."
              className="w-full text-sm border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-300"
            />
          </div>
          <button
            onClick={() => {
              const result = assessUrgency(issueDescription, category);
              setUrgencyResult(result);
              setStep('unverified_urgency');
            }}
            disabled={!issueDescription.trim()}
            className="mt-4 px-4 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 disabled:opacity-40 transition-colors"
          >
            Assess & Continue <ArrowRight size={14} className="inline ml-1" />
          </button>
        </div>
      )}

      {/* UNVERIFIED PATH: Urgency + create */}
      {step === 'unverified_urgency' && urgencyResult && (
        <div className="space-y-4">
          {urgencyResult.level === 'immediate_danger' && (
            <div className="bg-red-950 border border-red-300 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle size={24} className="text-red-300" />
                <h2 className="text-lg font-bold text-red-300">Immediate Danger Reported</h2>
              </div>
              <div className="bg-red-950 rounded-lg p-4 mb-4">
                <p className="text-red-300 text-sm font-semibold mb-1">Emergency Instructions:</p>
                <p className="text-red-300 text-sm">{urgencyResult.emergencyInstructions}</p>
              </div>
              <p className="text-red-300 text-sm font-medium mb-4">Moda does not provide emergency dispatch.</p>
            </div>
          )}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className={clsx('rounded-lg p-4 mb-4', urgencyResult.level === 'immediate_danger' ? 'bg-red-950 border border-red-800' : urgencyResult.level === 'urgent' ? 'bg-orange-950 border border-orange-800' : 'bg-slate-950 border border-slate-700')}>
              <p className="text-sm font-medium text-slate-200 mb-1">Urgency: {urgencyResult.level === 'immediate_danger' ? 'Immediate Danger' : urgencyResult.level === 'urgent' ? 'Urgent' : 'Routine'}</p>
              <p className="text-xs text-slate-400">{urgencyResult.reason}</p>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              We'll create an inquiry and have a coordinator call back at <strong>{callbackPhone}</strong>. No account information will be shared until identity is confirmed.
            </p>
            <button onClick={handleCreateUnverifiedRequest} className="w-full py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors">
              Create Unverified Inquiry
            </button>
          </div>
        </div>
      )}

      {/* UNVERIFIED PATH: Done */}
      {step === 'unverified_done' && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle size={24} className="text-green-300" />
            <h2 className="text-lg font-medium text-slate-100">Inquiry Recorded</h2>
          </div>
          <div className="bg-slate-950 rounded-lg p-4 mb-4">
            <p className="text-xs text-slate-400 mb-0.5">Reference</p>
            <p className="font-mono text-lg font-semibold text-slate-100">{createdRefNumber}</p>
          </div>
          <p className="text-slate-300 text-sm mb-2">A coordinator will call back at {callbackPhone}.</p>
          <p className="text-xs text-slate-400 mb-6 italic">This inquiry requires human review before any account information is shared. Routed for coordinator follow-up.</p>
          <div className="flex gap-3">
            <button onClick={() => createdRequestId && navigate(`/requests/${createdRequestId}`)} className="px-4 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 transition-colors">
              View Inquiry
            </button>
            <button onClick={reset} className="px-4 py-2.5 border border-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-950 transition-colors">
              New Intake
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
