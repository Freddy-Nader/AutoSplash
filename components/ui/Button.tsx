'use client';

import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const base =
    'w-full min-h-[56px] rounded-full font-semibold text-base transition-transform active:scale-[0.97] flex items-center justify-center gap-2 px-6';

  const styles =
    variant === 'primary'
      ? 'bg-accent text-white hover:bg-accent-dark'
      : 'bg-white text-primary border-2 border-primary hover:bg-gray-soft';

  const shadow =
    variant === 'primary'
      ? { boxShadow: '0 8px 24px rgba(56, 189, 248, 0.35)' }
      : { boxShadow: '0 4px 16px rgba(30, 58, 95, 0.12)' };

  return (
    <button {...rest} className={`${base} ${styles} ${className}`} style={shadow}>
      {children}
    </button>
  );
}
