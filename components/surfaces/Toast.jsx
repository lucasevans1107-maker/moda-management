import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Toast({ title, message, tone = 'neutral', onClose, style }) {
  const icon = { neutral: 'bell', success: 'check', warning: 'clock', danger: 'alert-triangle' }[tone];
  const accent = { neutral: 'var(--bronze-300)', success: '#A7B79C', warning: 'var(--bronze-200)', danger: '#D59A8F' }[tone];
  return (
    <div data-theme="light" style={{ display: 'flex', gap: 14, alignItems: 'flex-start', width: 380, maxWidth: '100%', padding: '18px 18px 18px 20px', background: 'var(--night)', color: 'var(--ivory)', boxShadow: 'var(--shadow-modal)', ...style }}>
      <span style={{ color: accent, marginTop: 2 }}><Icon name={icon} size={18} /></span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 400 }}>{title}</div>
        {message ? <div style={{ fontSize: 13, color: 'var(--oat)', marginTop: 3 }}>{message}</div> : null}
      </div>
      {onClose ? <span onClick={onClose} style={{ cursor: 'pointer', color: 'var(--stone)' }}><Icon name="x" size={15} /></span> : null}
    </div>
  );
}
