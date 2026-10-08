import React from 'react';
const toPascal = (n) => n.split(/[-_ ]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
/** Lucide icon rendered at a fine 1.25 stroke. Requires lucide UMD on window. */
export function Icon({ name, size = 18, stroke = 1.25, color = 'currentColor', style }) {
  const lib = (typeof window !== 'undefined' && window.lucide && window.lucide.icons) || {};
  let node = lib[toPascal(name)] || lib[name];
  if (node && node[0] === 'svg') node = node[2];
  const kids = (node || []).map(([tag, attrs], i) => React.createElement(tag, { key: i, ...attrs }));
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, display: 'block', ...style }}>{kids}</svg>
  );
}
