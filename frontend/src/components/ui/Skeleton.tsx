import React from 'react';
import { cn } from '@/lib/utils';
import { GlassCard } from './GlassCard';

export const Skeleton: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className,
  style,
}) => {
  return (
    <div
      style={style}
      className={cn(
        'relative overflow-hidden rounded-lg bg-surface-2/60 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent',
        className
      )}
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <GlassCard className={cn('p-6 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-36 h-8" />
      </div>
      <Skeleton className="w-full h-3" />
    </GlassCard>
  );
};

export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({
  rows = 4,
  className,
}) => {
  return (
    <GlassCard className={cn('p-6 space-y-4', className)}>
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <Skeleton className="w-32 h-6" />
        <Skeleton className="w-24 h-6 rounded-lg" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-48 h-4" />
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-16 h-5 rounded-full" />
            <Skeleton className="w-12 h-4" />
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export const SkeletonChart: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <GlassCard className={cn('p-6 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="w-36 h-5" />
        <Skeleton className="w-20 h-5 rounded-full" />
      </div>
      <div className="h-40 flex items-end gap-3 pt-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-md"
            style={{ height: `${20 + ((i * 17) % 70)}%` }}
          />
        ))}
      </div>
    </GlassCard>
  );
};
