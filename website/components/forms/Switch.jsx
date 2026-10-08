import React from 'react';
export function Switch({ checked = false, onChange, label, disabled, style }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 12, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, ...style }}>
      <span onClick={() => !disabled && onChange && onChange(!checked)} style={{ position: 'relative', width: 36, height: 20, borderRadius: 20, flexShrink: 0,
        background: checked ? 'var(--ink)' : 'var(--sand)', transition: 'background 280ms var(--ease-quiet)' }}>
        <span style={{ position: 'absolute', top: 3, left: checked ? 19 : 3, width: 14, height: 14, borderRadius: 14, background: checked ? 'var(--bronze-200)' : 'var(--stone)',
          transition: 'left 280ms var(--ease-quiet)' }}></span>
      </span>
      {label ? <span style={{ fontSize: 14, color: 'var(--ink)' }}>{label}</span> : null}
    </label>
  );
}
