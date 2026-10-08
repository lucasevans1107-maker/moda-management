import React from 'react';
import { Icon } from './Icon.jsx';
/** Square, letterspaced, uppercase. One primary per view. */
export function Button({ children, variant = 'primary', size = 'm', icon, iconRight, disabled, full, onClick, type = 'button', style }) {
  const [hover, setHover] = React.useState(false);
  const h = { s: 36, m: 48, l: 58 }[size];
  const px = { s: 18, m: 28, l: 38 }[size];
  const v = {
    primary: { bg: hover ? 'var(--btn-primary-hover)' : 'var(--ink)', fg: 'var(--ivory)', bd: 'transparent' },
    accent: { bg: hover ? 'var(--bronze-600)' : 'var(--bronze-500)', fg: 'var(--white)', bd: 'transparent' },
    secondary: { bg: hover ? 'var(--ink)' : 'transparent', fg: hover ? 'var(--ivory)' : 'var(--ink)', bd: 'var(--ink)' },
    inverse: { bg: hover ? 'var(--ivory)' : 'transparent', fg: hover ? 'var(--ink)' : 'var(--ivory)', bd: 'var(--ivory)' },
    ghost: { bg: hover ? 'var(--linen)' : 'transparent', fg: 'var(--ink)', bd: 'transparent' },
    link: { bg: 'transparent', fg: hover ? 'var(--bronze-700)' : 'var(--ink)', bd: 'transparent' },
  }[variant];
  const isLink = variant === 'link';
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: full ? 'flex' : 'inline-flex', width: full ? '100%' : undefined, alignItems: 'center', justifyContent: 'center', gap: 12,
        height: isLink ? 'auto' : h, padding: isLink ? '6px 0' : '0 ' + px + 'px', background: v.bg, color: v.fg,
        border: '1px solid ' + v.bd, borderBottom: isLink ? '1px solid ' + (hover ? 'var(--bronze-500)' : 'var(--oat)') : '1px solid ' + v.bd,
        borderRadius: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: size === 's' ? 10 : 11, letterSpacing: '0.22em', textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.38 : 1, whiteSpace: 'nowrap',
        transition: 'background 280ms var(--ease-quiet), color 280ms var(--ease-quiet), border-color 280ms var(--ease-quiet)', ...style }}>
      {icon ? <Icon name={icon} size={size === 's' ? 14 : 16} /> : null}
      <span>{children}</span>
      {iconRight ? <Icon name={iconRight} size={size === 's' ? 14 : 16} style={{ transform: hover ? 'translateX(3px)' : 'none', transition: 'transform 280ms var(--ease-quiet)' }} /> : null}
    </button>
  );
}
