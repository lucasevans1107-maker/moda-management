import React from 'react';
export function Avatar({ name = '', size = 36, src, tone = 'linen', style }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase();
  const bg = { linen: 'var(--linen)', bronze: 'var(--bronze-100)', ink: 'var(--ink)' }[tone];
  return (
    <span style={{ width: size, height: size, borderRadius: size, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: src ? 'center/cover url(' + src + ')' : bg, color: tone === 'ink' ? 'var(--ivory)' : 'var(--umber)',
      fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: size * 0.4, letterSpacing: '0.04em', border: '1px solid var(--border-hairline)', ...style }}>
      {src ? null : initials}
    </span>
  );
}
