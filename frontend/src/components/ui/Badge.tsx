import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'cyan' | 'violet' | 'success' | 'warning' | 'danger' | 'demo' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  dot = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'cyan':
        return 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30';
      case 'violet':
        return 'bg-cyber-violet/15 text-purple-300 border-cyber-violet/30';
      case 'success':
        return 'bg-cyber-success/15 text-cyber-success border-cyber-success/30';
      case 'warning':
        return 'bg-cyber-warning/15 text-cyber-warning border-cyber-warning/30';
      case 'danger':
        return 'bg-cyber-danger/15 text-cyber-danger border-cyber-danger/30';
      case 'demo':
        return 'bg-primary/20 text-primary-bright border-primary-bright/40 font-mono tracking-wider';
      case 'outline':
        return 'bg-transparent text-text-muted border-border';
      default:
        return 'bg-primary/15 text-primary-bright border-primary/30';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-[10px]';
      default:
        return 'px-2.5 py-1 text-xs';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border backdrop-blur-sm select-none',
        getSizeStyles(),
        getVariantStyles(),
        className
      )}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full animate-pulse', {
            'bg-cyber-cyan': variant === 'cyan',
            'bg-cyber-success': variant === 'success',
            'bg-cyber-danger': variant === 'danger',
            'bg-cyber-warning': variant === 'warning',
            'bg-primary-bright': variant === 'primary' || variant === 'demo',
            'bg-purple-400': variant === 'violet',
            'bg-text-muted': variant === 'outline',
          })}
        />
      )}
      {children}
    </span>
  );
};
