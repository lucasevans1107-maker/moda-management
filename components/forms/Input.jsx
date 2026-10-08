import React from 'react';
import { Icon } from '../core/Icon.jsx';
/** variant "line" = website (underline only); "box" = app (hairline box). */
export function Input({ label, hint, error, value, defaultValue, onChange, placeholder, icon, type = 'text', variant = 'box', multiline = false, rows = 4, disabled, style }) {
  const [focus, setFocus] = React.useState(false);
  const bd = error ? 'var(--oxblood)' : focus ? 'var(--ink)' : 'var(--border-strong)';
  const Tag = multiline ? 'textarea' : 'input';
  const line = variant === 'line';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {label ? <label style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{label}</label> : null}
      <div style={{ display: 'flex', alignItems: multiline ? 'flex-start' : 'center', gap: 10, background: line ? 'transparent' : 'var(--porcelain)',
        border: line ? 'none' : '1px solid ' + bd, borderBottom: '1px solid ' + bd, padding: line ? '0 0 2px' : '0 14px', borderRadius: line ? 0 : 2,
        transition: 'border-color 200ms var(--ease-quiet)', opacity: disabled ? 0.5 : 1 }}>
        {icon ? <span style={{ color: 'var(--text-tertiary)', paddingTop: multiline ? 12 : 0 }}><Icon name={icon} size={16} /></span> : null}
        <Tag type={type} rows={multiline ? rows : undefined} value={value} defaultValue={defaultValue} onChange={onChange} placeholder={placeholder} disabled={disabled}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ flex: 1, minWidth: 0, height: multiline ? 'auto' : (line ? 40 : 44), padding: multiline ? '12px 0' : 0, border: 'none', outline: 'none', background: 'transparent', resize: 'vertical',
            fontFamily: line ? 'var(--font-display)' : 'var(--font-sans)', fontSize: line ? 22 : 14, fontWeight: line ? 400 : 300, color: 'var(--ink)' }} />
      </div>
      {error || hint ? <div style={{ fontSize: 12, color: error ? 'var(--oxblood)' : 'var(--text-tertiary)' }}>{error || hint}</div> : null}
    </div>
  );
}
