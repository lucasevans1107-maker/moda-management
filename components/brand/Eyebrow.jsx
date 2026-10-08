import React from 'react';
/** Small uppercase overline, optionally led by a bronze rule. */
export function Eyebrow({ children, rule = true, tone = 'accent', style }) {
  const color = { accent: 'var(--text-accent)', muted: 'var(--text-tertiary)', ivory: 'var(--bronze-200)' }[tone] || tone;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 'var(--text-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color, ...style }}>
      {rule ? <span style={{ width: 28, height: 1, background: 'currentColor', opacity: 0.7 }}></span> : null}
      <span>{children}</span>
    </div>
  );
}
