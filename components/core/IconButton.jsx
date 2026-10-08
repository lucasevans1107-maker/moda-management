import React from 'react';
import { Icon } from './Icon.jsx';
export function IconButton({ icon, label, variant = 'ghost', size = 'm', onClick, active, style }) {
  const [hover, setHover] = React.useState(false);
  const d = { s: 32, m: 40, l: 48 }[size];
  const v = {
    ghost: { bg: hover || active ? 'var(--linen)' : 'transparent', fg: 'var(--ink)', bd: 'transparent' },
    outline: { bg: hover ? 'var(--ink)' : 'transparent', fg: hover ? 'var(--ivory)' : 'var(--ink)', bd: 'var(--border-strong)' },
    solid: { bg: hover ? 'var(--btn-primary-hover)' : 'var(--ink)', fg: 'var(--ivory)', bd: 'transparent' },
    inverse: { bg: hover ? 'rgba(247,243,236,0.12)' : 'transparent', fg: 'var(--ivory)', bd: 'var(--border-inverse)' },
  }[variant];
  return (
    <button aria-label={label} title={label} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width: d, height: d, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, background: v.bg, color: v.fg,
        border: '1px solid ' + v.bd, borderRadius: variant === 'ghost' ? 0 : 999, cursor: 'pointer', transition: 'all 280ms var(--ease-quiet)', ...style }}>
      <Icon name={icon} size={size === 's' ? 15 : 18} />
    </button>
  );
}
