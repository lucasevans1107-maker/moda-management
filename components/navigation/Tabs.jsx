import React from 'react';
export function Tabs({ items = [], value, onChange, variant = 'underline', style }) {
  if (variant === 'segmented') {
    return (
      <div style={{ display: 'inline-flex', border: '1px solid var(--border-strong)', padding: 3, gap: 2, ...style }}>
        {items.map(it => { const on = it.id === value; return (
          <button key={it.id} onClick={() => onChange && onChange(it.id)} style={{ height: 32, padding: '0 16px', border: 'none', cursor: 'pointer',
            background: on ? 'var(--ink)' : 'transparent', color: on ? 'var(--ivory)' : 'var(--taupe)', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 10,
            letterSpacing: '0.18em', textTransform: 'uppercase', transition: 'all 200ms var(--ease-quiet)' }}>{it.label}</button>); })}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', gap: 32, borderBottom: '1px solid var(--border-hairline)', ...style }}>
      {items.map(it => { const on = it.id === value; return (
        <button key={it.id} onClick={() => onChange && onChange(it.id)} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: 0,
          background: 'none', border: 'none', cursor: 'pointer', color: on ? 'var(--ink)' : 'var(--text-tertiary)', fontFamily: 'var(--font-sans)', fontWeight: 500,
          fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', transition: 'color 200ms var(--ease-quiet)' }}>
          {it.label}
          {it.count != null ? <span style={{ fontSize: 10, letterSpacing: 0, color: on ? 'var(--bronze-700)' : 'var(--stone)' }}>{it.count}</span> : null}
          <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 1, background: on ? 'var(--ink)' : 'transparent' }}></span>
        </button>); })}
    </div>
  );
}
