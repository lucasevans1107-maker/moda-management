import React from 'react';
export function Tooltip({ label, children, side = 'top', forceOpen = false }) {
  const [open, setOpen] = React.useState(false);
  const show = open || forceOpen;
  const pos = side === 'top' ? { bottom: '100%', marginBottom: 8 } : { top: '100%', marginTop: 8 };
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
      <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%) translateY(' + (show ? 0 : 4) + 'px)', ...pos, opacity: show ? 1 : 0, pointerEvents: 'none',
        background: 'var(--ink)', color: 'var(--ivory)', padding: '7px 11px', fontSize: 12, whiteSpace: 'nowrap', letterSpacing: '0.02em',
        transition: 'all 200ms var(--ease-quiet)', zIndex: 50 }}>{label}</span>
    </span>
  );
}
