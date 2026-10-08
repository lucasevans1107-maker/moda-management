import React from 'react';
/** Photography placeholder. Swap for real imagery; keeps ratio, tone and caption. */
export function ImageFrame({ src, alt = '', label = 'Photography', ratio = '4 / 5', tone = 'linen', height, position = 'center', children, style }) {
  const tones = {
    linen: ['#E7DFD2', '#DCD2C2', 'var(--taupe)'],
    sand: ['#D8CBB6', '#CBBCA4', 'var(--umber)'],
    umber: ['#3E3731', '#342E29', 'var(--oat)'],
    ink: ['#24211D', '#1C1A17', 'var(--stone)'],
  }[tone] || ['#E7DFD2', '#DCD2C2', 'var(--taupe)'];
  return (
    <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: height ? undefined : ratio, height,
      background: 'radial-gradient(120% 90% at 30% 20%, ' + tones[0] + ' 0%, ' + tones[1] + ' 100%)', ...style }}>
      {src ? <img src={src} alt={alt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: position, filter: 'saturate(0.86) contrast(0.97)' }} /> : <>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(0,0,0,0.025) 0 1px, transparent 1px 9px)' }}></div>
        <div style={{ position: 'absolute', left: 16, bottom: 14, fontFamily: 'var(--font-sans)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: tones[2] }}>{label}</div></>}
      {children ? <div data-theme="light" style={{ position: 'absolute', inset: 0, color: 'var(--ivory)' }}>{children}</div> : null}
    </div>
  );
}
