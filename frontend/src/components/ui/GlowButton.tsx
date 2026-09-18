'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface GlowButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3.5 py-1.5 text-xs font-medium rounded-lg gap-1.5';
      case 'lg':
        return 'px-6 py-3.5 text-base font-semibold rounded-xl gap-2.5';
      default:
        return 'px-5 py-2.5 text-sm font-semibold rounded-xl gap-2';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-primary to-primary-bright text-white shadow-glass-glow hover:shadow-cyan-glow border border-primary-bright/40 hover:border-cyber-cyan/60';
      case 'secondary':
        return 'bg-surface-2 text-text border border-border hover:border-primary-bright/50 hover:bg-surface-3 shadow-glass';
      case 'outline':
        return 'bg-transparent text-text border border-primary-bright/30 hover:border-cyber-cyan hover:text-cyber-cyan hover:bg-primary/10';
      case 'danger':
        return 'bg-gradient-to-r from-cyber-danger to-red-600 text-white shadow-danger-glow border border-red-400/40';
      case 'ghost':
        return 'bg-transparent text-text-muted hover:text-text hover:bg-surface-2/60';
      default:
        return '';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      transition={{ duration: 0.15 }}
      disabled={disabled || isLoading}
      className={cn(
        'relative inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-bright/50 disabled:opacity-50 disabled:cursor-not-allowed select-none overflow-hidden',
        getSizeStyles(),
        getVariantStyles(),
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : (
        leftIcon && <span className="flex items-center">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </motion.button>
  );
};
