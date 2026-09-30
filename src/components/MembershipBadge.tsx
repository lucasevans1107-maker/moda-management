import type { MembershipTier } from '../types';
import clsx from 'clsx';

interface Props {
  tier: MembershipTier;
  className?: string;
}

export default function MembershipBadge({ tier, className }: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        tier === 'premium'
          ? 'bg-amber-950 text-amber-300 border border-amber-800'
          : 'bg-raised text-ink',
        className
      )}
    >
      {tier === 'premium' ? 'Premium' : 'Base'}
    </span>
  );
}
