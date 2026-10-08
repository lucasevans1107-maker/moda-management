import React from 'react';
export function Stat({ label, value, unit, caption, delta, deltaTone = 'neutral', style }) {
  const dc = { up: 'var(--sage)', down: 'var(--oxblood)', neutral: 'var(--text-tertiary)' }[deltaTone];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, ...style }}>
      <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 46, lineHeight: 1, fontWeight: 400, fontVariantNumeric: 'lining-nums' }}>{value}</span>
        {unit ? <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{unit}</span> : null}
      </div>
      {caption || delta ? <div style={{ fontSize: 12, color: 'var(--text-tertiary)', display: 'flex', gap: 8 }}>
        {delta ? <span style={{ color: dc, fontWeight: 500 }}>{delta}</span> : null}{caption}</div> : null}
    </div>
  );
}
