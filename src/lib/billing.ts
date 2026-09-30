// Concierge billing calculations per provisional Moda policy.
// All results labeled as provisional estimates.

const CONCIERGE_RATE_PER_HOUR = 125;
const MINIMUM_BILLABLE_MINUTES = 60;
const INCREMENT_MINUTES = 15;

export interface ConciergeCalculation {
  actualMinutes: number;
  billableMinutes: number;
  ratePerHour: number;
  estimatedCharge: number;
  breakdown: string;
  isProvisional: true;
}

export function calculateConciergeCharge(actualMinutes: number): ConciergeCalculation {
  if (actualMinutes <= 0) {
    throw new Error('Cannot bill zero or negative duration.');
  }

  let billableMinutes: number;

  if (actualMinutes <= MINIMUM_BILLABLE_MINUTES) {
    billableMinutes = MINIMUM_BILLABLE_MINUTES;
  } else {
    const overMinimum = actualMinutes - MINIMUM_BILLABLE_MINUTES;
    const incrementsNeeded = Math.ceil(overMinimum / INCREMENT_MINUTES);
    billableMinutes = MINIMUM_BILLABLE_MINUTES + incrementsNeeded * INCREMENT_MINUTES;
  }

  const estimatedCharge = (billableMinutes / 60) * CONCIERGE_RATE_PER_HOUR;

  const breakdown =
    actualMinutes <= MINIMUM_BILLABLE_MINUTES
      ? `${actualMinutes} min actual → ${billableMinutes} min billable (1-hour minimum)`
      : `${actualMinutes} min actual → rounded up to next 15-min increment = ${billableMinutes} min billable`;

  return {
    actualMinutes,
    billableMinutes,
    ratePerHour: CONCIERGE_RATE_PER_HOUR,
    estimatedCharge,
    breakdown,
    isProvisional: true,
  };
}

// Handyman allowance tracking
export interface HandymanUsageSummary {
  usedMinutes: number;
  allowanceMinutes: number;
  remainingMinutes: number;
  isOverAllowance: boolean;
  overageMinutes: number;
  note: string;
}

export function summarizeHandymanUsage(
  usedMinutes: number,
  allowanceMinutes: number
): HandymanUsageSummary {
  const remaining = Math.max(0, allowanceMinutes - usedMinutes);
  const overageMinutes = Math.max(0, usedMinutes - allowanceMinutes);

  return {
    usedMinutes,
    allowanceMinutes,
    remainingMinutes: remaining,
    isOverAllowance: usedMinutes > allowanceMinutes,
    overageMinutes,
    note: overageMinutes > 0
      ? `${overageMinutes} min over allowance. Overage rate policy requires coordinator confirmation — not established in current draft.`
      : `${remaining} min remaining this period.`,
  };
}
