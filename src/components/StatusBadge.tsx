import type { RequestStatus } from '../types';
import { STATUS_LABELS } from '../types';
import clsx from 'clsx';

const STATUS_CLASSES: Record<RequestStatus, string> = {
  new: 'bg-raised text-ink',
  needs_review: 'bg-amber-950 text-amber-300 border border-amber-800',
  awaiting_estimate: 'bg-blue-950 text-blue-300 border border-blue-800',
  awaiting_homeowner_approval: 'bg-purple-950 text-purple-300 border border-purple-800',
  ready_to_coordinate: 'bg-raised text-olive border border-line',
  scheduling_requested: 'bg-raised text-accent border border-line',
  scheduled: 'bg-raised text-accent',
  in_progress: 'bg-amber-950 text-amber-300',
  completed: 'bg-green-950 text-green-300 border border-green-800',
  canceled: 'bg-raised text-muted',
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
