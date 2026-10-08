import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Radio({ checked = false, onChange, label, description, disabled, name, style }) {
  const box = <span style={{ width: 18, height: 18, flexShrink: 0, marginTop: 2, borderRadius: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid ' + (checked ? 'var(--ink)' : 'var(--oat)'), background: 'var(--porcelain)', transition: 'all 200ms var(--ease-quiet)' }}>
      {checked ? <span style={{ width: 8, height: 8, borderRadius: 8, background: 'var(--bronze-500)' }}></span> : null}</span>;
  return (
    <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, ...style }}>
      <input type="radio" name={name} checked={checked} disabled={disabled} onChange={(e) => onChange && onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      {box}
      {label || description ? <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {label ? <span style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 400 }}>{label}</span> : null}
        {description ? <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{description}</span> : null}
      </span> : null}
    </label>
  );
}
