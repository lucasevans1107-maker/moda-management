import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Select({ label, options = [], value, defaultValue, onChange, variant = 'box', style }) {
  const line = variant === 'line';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {label ? <label style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{label}</label> : null}
      <div style={{ position: 'relative' }}>
        <select value={value} defaultValue={defaultValue} onChange={onChange}
          style={{ appearance: 'none', WebkitAppearance: 'none', width: '100%', height: line ? 42 : 46, padding: line ? '0 28px 0 0' : '0 40px 0 14px', background: line ? 'transparent' : 'var(--porcelain)',
            border: line ? 'none' : '1px solid var(--border-strong)', borderBottom: '1px solid var(--border-strong)', borderRadius: line ? 0 : 2, outline: 'none',
            fontFamily: line ? 'var(--font-display)' : 'var(--font-sans)', fontSize: line ? 22 : 14, fontWeight: line ? 400 : 300, color: 'var(--ink)', cursor: 'pointer' }}>
          {options.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span style={{ position: 'absolute', right: line ? 0 : 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--taupe)' }}><Icon name="chevron-down" size={16} /></span>
      </div>
    </div>
  );
}
