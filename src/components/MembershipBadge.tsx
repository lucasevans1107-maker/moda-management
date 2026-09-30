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
          ? 'bg-amber-50 text-amber-800 border border-amber-200'
          : 'bg-stone-100 text-stone-700',
        className
      )}
    >
      {tier === 'premium' ? 'Premium' : 'Base'}
    </span>
  );
}
