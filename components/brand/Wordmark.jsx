import React from 'react';
/** Typeset wordmark (no logo supplied). */
export function Wordmark({ size = 'm', tone = 'ink', stacked = true }) {
  const s = { s: [18, 7.5], m: [26, 9], l: [44, 12] }[size] || [26, 9];
  const color = tone === 'ivory' ? 'var(--ivory)' : 'var(--ink)';
  return (
    <div style={{ display: 'inline-flex', flexDirection: stacked ? 'column' : 'row', alignItems: 'center', gap: stacked ? s[0] * 0.18 : s[0] * 0.5, color, lineHeight: 1 }}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: s[0], letterSpacing: '0.34em', marginRight: '-0.34em' }}>MODA</span>
      {stacked ? <span style={{ width: s[0] * 1.1, height: 1, background: 'var(--bronze-300)' }}></span> : null}
      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: s[1], letterSpacing: '0.46em', marginRight: '-0.46em', opacity: 0.85 }}>MANAGEMENT</span>
    </div>
  );
}
