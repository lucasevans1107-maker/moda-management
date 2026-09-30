import type { ServiceCategory, UrgencyLevel } from '../types';

export interface UrgencyResult {
  level: UrgencyLevel;
  reason: string;
  emergencyInstructions?: string;
}

const IMMEDIATE_DANGER_KEYWORDS = [
  'gas smell', 'gas leak', 'smell gas', 'carbon monoxide', 'co detector',
  'smoke', 'fire', 'flooding', 'flood', 'sewage backup', 'sparks',
  'electrical fire', 'burning smell', 'structural collapse', 'ceiling collapsed',
  'roof collapsed', 'wall cracked', 'crack in foundation',
];

const URGENT_KEYWORDS = [
  'not cooling', 'not heating', 'no heat', 'no cooling', 'no hot water',
  'water leak', 'dripping', 'pipe burst', 'pipe broken', 'overflowing',
  'no power', 'power out', 'outlet sparking', 'breaker tripping',
  'sewage', 'sewer', 'toilet overflow', 'roof leaking', 'water coming in',
  'running continuously', 'running non-stop',
];

export function assessUrgency(description: string, category: ServiceCategory): UrgencyResult {
  const lower = description.toLowerCase();

  // Check for immediate danger first
  for (const kw of IMMEDIATE_DANGER_KEYWORDS) {
    if (lower.includes(kw)) {
      return {
        level: 'immediate_danger',
        reason: `Keyword "${kw}" matched in description — possible life safety hazard.`,
        emergencyInstructions:
          'If there is an immediate risk to life or property, call 911 immediately. For gas odors, evacuate and call Peoples Gas: 1-866-556-6001. For electrical emergencies, contact ComEd: 1-800-334-7661. Moda does not provide emergency dispatch.',
      };
    }
  }

  // Check for urgent keywords
  for (const kw of URGENT_KEYWORDS) {
    if (lower.includes(kw)) {
      return {
        level: 'urgent',
        reason: `Keyword "${kw}" matched — active system failure or water intrusion likely.`,
      };
    }
  }

  // Category-based defaults
  if (category === 'plumbing' && lower.includes('water')) {
    return {
      level: 'urgent',
      reason: 'Plumbing issue with water involvement — elevated urgency by default pending review.',
    };
  }

  if (category === 'electrical') {
    return {
      level: 'urgent',
      reason: 'Electrical issues carry elevated urgency pending coordinator review.',
    };
  }

  return {
    level: 'routine',
    reason: 'No urgent or danger keywords detected. Classified as routine pending coordinator review.',
  };
}

export function getResponseDeadline(createdAt: string): Date {
  const d = new Date(createdAt);
  d.setHours(d.getHours() + 24);
  return d;
}

export function isOverdue(request: { humanResponseDue: string; humanRespondedAt?: string }): boolean {
  if (request.humanRespondedAt) return false;
  return new Date() > new Date(request.humanResponseDue);
}
