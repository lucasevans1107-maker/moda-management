import type { UrgencyLevel } from '../types';
import { URGENCY_LABELS } from '../types';
import clsx from 'clsx';

const URGENCY_CLASSES: Record<UrgencyLevel, string> = {
  routine: 'bg-raised text-muted',
  urgent: 'bg-orange-950 text-orange-300 border border-orange-800',
  immediate_danger: 'bg-red-950 text-red-300 font-semibold',
};

interface Props {
  urgency: UrgencyLevel;
  className?: string;
}

export default function UrgencyBadge({ urgency, className }: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs whitespace-nowrap',
        URGENCY_CLASSES[urgency],
        className
      )}
    >
      {urgency === 'immediate_danger' && (
        <span className="mr-1">!</span>
      )}
      {URGENCY_LABELS[urgency]}
    </span>
  );
}
