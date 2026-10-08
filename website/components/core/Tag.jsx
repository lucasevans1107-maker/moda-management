import React from 'react';
import { Icon } from './Icon.jsx';
export function Tag({ children, selected = false, onClick, onRemove, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <span onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 32, padding: onRemove ? '0 10px 0 16px' : '0 16px', borderRadius: 999,
        border: '1px solid ' + (selected ? 'var(--ink)' : hover ? 'var(--stone)' : 'var(--border-strong)'),
        background: selected ? 'var(--ink)' : 'transparent', color: selected ? 'var(--ivory)' : 'var(--ink)',
        fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 400, cursor: onClick ? 'pointer' : 'default', transition: 'all 200ms var(--ease-quiet)', ...style }}>
      {children}
      {onRemove ? <span onClick={(e) => { e.stopPropagation(); onRemove(); }} style={{ display: 'inline-flex', cursor: 'pointer', opacity: 0.6 }}><Icon name="x" size={13} /></span> : null}
    </span>
  );
}
