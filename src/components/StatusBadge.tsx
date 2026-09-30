import type { RequestStatus } from '../types';
import { STATUS_LABELS } from '../types';
import clsx from 'clsx';

const STATUS_CLASSES: Record<RequestStatus, string> = {
  new: 'bg-stone-100 text-stone-700',
  needs_review: 'bg-amber-50 text-amber-700 border border-amber-200',
  awaiting_estimate: 'bg-blue-50 text-blue-700 border border-blue-200',
  awaiting_homeowner_approval: 'bg-purple-50 text-purple-700 border border-purple-200',
  ready_to_coordinate: 'bg-teal-50 text-teal-700 border border-teal-200',
  scheduling_requested: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  scheduled: 'bg-indigo-100 text-indigo-800',
  in_progress: 'bg-amber-100 text-amber-800',
  completed: 'bg-green-50 text-green-700 border border-green-200',
  canceled: 'bg-stone-100 text-stone-500',
};

interface Props {
  status: RequestStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
        STATUS_CLASSES[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
