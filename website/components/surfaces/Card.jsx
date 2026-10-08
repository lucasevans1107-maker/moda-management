import React from 'react';
/** Flat, hairline-bordered surface. No rounded corners, no heavy shadow. */
export function Card({ children, variant = 'outlined', padding = 28, interactive = false, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const v = {
    outlined: { background: 'var(--surface-card)', border: '1px solid ' + (interactive && hover ? 'var(--oat)' : 'var(--border-hairline)'), color: 'var(--ink)' },
    plain: { background: 'transparent', border: '1px solid transparent', color: 'var(--ink)' },
    sunken: { background: 'var(--linen)', border: '1px solid transparent', color: 'var(--ink)' },
    inverse: { background: 'var(--night)', border: '1px solid var(--border-inverse)', color: 'var(--ivory)' },
  }[variant];
  return (
    <div data-theme={variant === 'inverse' ? 'light' : undefined} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...v, padding, cursor: onClick ? 'pointer' : 'default', boxShadow: interactive && hover ? 'var(--shadow-float)' : 'none',
        transition: 'box-shadow 280ms var(--ease-quiet), border-color 280ms var(--ease-quiet)', ...style }}>
      {children}
    </div>
  );
}
