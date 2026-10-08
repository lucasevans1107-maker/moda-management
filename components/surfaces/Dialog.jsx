import React from 'react';
import { IconButton } from '../core/IconButton.jsx';
export function Dialog({ open = true, onClose, eyebrow, title, children, actions, width = 520, inline = false }) {
  if (!open) return null;
  const panel = (
    <div style={{ width, maxWidth: '100%', background: 'var(--porcelain)', boxShadow: 'var(--shadow-modal)', position: 'relative' }}>
      <div style={{ padding: '32px 36px 0', display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <div>
          {eyebrow ? <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--text-accent)', marginBottom: 10 }}>{eyebrow}</div> : null}
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, lineHeight: 1.15, fontWeight: 400 }}>{title}</div>
        </div>
        {onClose ? <IconButton icon="x" label="Close" onClick={onClose} size="s" /> : null}
      </div>
      <div style={{ padding: '18px 36px 30px', fontSize: 15, color: 'var(--text-secondary)' }}>{children}</div>
      {actions ? <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '20px 36px', borderTop: '1px solid var(--border-hairline)' }}>{actions}</div> : null}
    </div>
  );
  if (inline) return panel;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--scrim)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()}>{panel}</div>
    </div>
  );
}
