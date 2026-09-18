'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'interactive' | 'glow' | 'subtle';
  glowColor?: 'blue' | 'cyan' | 'purple' | 'danger';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'default',
  glowColor = 'blue',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'interactive':
        return 'glass-panel-interactive hover:border-cyber-cyan/40 hover:shadow-cyan-glow cursor-pointer';
      case 'glow':
        if (glowColor === 'cyan') return 'glass-panel border-cyber-cyan/30 shadow-cyan-glow';
        if (glowColor === 'purple') return 'glass-panel border-cyber-violet/30 shadow-glass-glow';
        if (glowColor === 'danger') return 'glass-panel border-cyber-danger/30 shadow-danger-glow';
        return 'glass-panel border-primary-bright/30 shadow-shield-glow';
      case 'subtle':
        return 'bg-surface/50 backdrop-blur-md border border-border/60 shadow-glass';
      default:
        return 'glass-panel';
    }
  };

  return (
    <motion.div
      className={cn(
        'rounded-2xl relative overflow-hidden',
        getVariantStyles(),
        className
      )}
      {...props}
    >
      {/* Top subtle highlight line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-bright/30 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};
