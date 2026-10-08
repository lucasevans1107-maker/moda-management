import React from 'react';
export function Badge({ children, tone = 'neutral', dot = false, style }) {
  const t = {
    neutral: ['var(--linen)', 'var(--taupe)'], accent: ['var(--bronze-100)', 'var(--bronze-700)'],
    success: ['var(--sage-wash)', 'var(--sage)'], warning: ['var(--ochre-wash)', 'var(--bronze-900)'],
    danger: ['var(--oxblood-wash)', 'var(--oxblood)'], info: ['var(--slate-wash)', 'var(--slate)'],
    inverse: ['var(--ink)', 'var(--ivory)'],
  }[tone];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 22, padding: '0 9px', background: t[0], color: t[1],
      fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', whiteSpace: 'nowrap', ...style }}>
      {dot ? <span style={{ width: 5, height: 5, borderRadius: 5, background: 'currentColor' }}></span> : null}
      {children}
    </span>
  );
}
