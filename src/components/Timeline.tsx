import type { ActivityEntry, ActorRole } from '../types';
import { formatDateTime } from '../lib/format';
import clsx from 'clsx';

const ROLE_DOT: Record<ActorRole, string> = {
  coordinator: 'bg-stone-600',
  homeowner: 'bg-blue-500',
  vendor: 'bg-green-500',
  system: 'bg-line',
  receptionist: 'bg-purple-500',
};

interface Props {
  entries: ActivityEntry[];
}

export default function Timeline({ entries }: Props) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (sorted.length === 0) {
    return <p className="text-muted text-sm italic">No activity recorded yet.</p>;
  }

  return (
    <ol className="space-y-4">
      {sorted.map((entry, i) => (
        <li key={entry.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={clsx(
                'w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0',
                ROLE_DOT[entry.actorRole]
              )}
            />
            {i < sorted.length - 1 && (
              <span className="w-px flex-1 bg-raised mt-1" />
            )}
          </div>
          <div className="pb-4 min-w-0">
            <p className="text-xs text-muted mb-0.5">{entry.actor}</p>
            <p className="text-sm font-medium text-ink">{entry.action}</p>
            {entry.details && (
              <p className="text-sm text-muted mt-0.5 whitespace-pre-line">{entry.details}</p>
            )}
            <p className="text-xs text-muted mt-1">{formatDateTime(entry.timestamp)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
