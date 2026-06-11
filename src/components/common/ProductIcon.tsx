import React from 'react';

export const catColors = {
  'Makanan': { bg: 'oklch(93% 0.08 160)', fg: 'oklch(38% 0.14 155)' },
  'Fashion': { bg: 'oklch(92% 0.09 300)', fg: 'oklch(40% 0.16 295)' },
  'Kerajinan': { bg: 'oklch(93% 0.08 55)', fg: 'oklch(40% 0.14 50)' },
  'Elektronik': { bg: 'oklch(92% 0.09 232)', fg: 'oklch(38% 0.16 232)' },
};

interface ProductIconProps {
  icon?: string;
  cat: 'Makanan' | 'Fashion' | 'Kerajinan' | 'Elektronik';
  size?: number;
  className?: string;
}

export const ProductIcon: React.FC<ProductIconProps> = ({ icon, cat, size = 64, className = '' }) => {
  const colors = catColors[cat] || { bg: 'var(--bg-2)', fg: 'var(--text-2)' };
  
  const style: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    background: colors.bg,
    color: colors.fg,
    borderRadius: size > 50 ? 'var(--r-sm)' : '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 800,
    fontSize: `${Math.round(size * 0.28)}px`,
    letterSpacing: '0.5px',
    flexShrink: 0
  };

  return (
    <div style={style} className={className}>
      {(icon || '--').toUpperCase()}
    </div>
  );
};
