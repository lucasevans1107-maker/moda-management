import type { UrgencyLevel } from '../types';
import { URGENCY_LABELS } from '../types';
import clsx from 'clsx';

const URGENCY_CLASSES: Record<UrgencyLevel, string> = {
  routine: 'bg-stone-100 text-stone-600',
  urgent: 'bg-orange-50 text-orange-700 border border-orange-200',
  immediate_danger: 'bg-red-100 text-red-800 font-semibold',
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
