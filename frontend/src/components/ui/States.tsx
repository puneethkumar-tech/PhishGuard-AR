import React from 'react';
import { GlassCard } from './GlassCard';
import { GlowButton } from './GlowButton';
import { Loader2, AlertTriangle, Inbox } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string; className?: string }> = ({
  message = 'Loading neural telemetry...',
  className = '',
}) => {
  return (
    <GlassCard className={`p-8 flex flex-col items-center justify-center text-center ${className}`}>
      <div className="relative mb-4">
        <Loader2 className="w-8 h-8 text-cyber-cyan animate-spin" />
        <div className="absolute inset-0 blur-md bg-cyber-cyan/30 -z-10 rounded-full" />
      </div>
      <p className="text-sm text-text-muted font-medium tracking-wide">{message}</p>
    </GlassCard>
  );
};

export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}> = ({
  title = 'No Telemetry Records Found',
  description = 'No scans or events have been recorded in this category yet.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <GlassCard className={`p-8 flex flex-col items-center justify-center text-center ${className}`}>
      <div className="p-4 rounded-2xl bg-surface-2 border border-border mb-4 text-text-muted">
        <Inbox className="w-8 h-8 text-primary-bright" />
      </div>
      <h4 className="text-base font-semibold text-text mb-1">{title}</h4>
      <p className="text-xs text-text-muted max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && (
        <GlowButton size="sm" onClick={onAction}>
          {actionLabel}
        </GlowButton>
      )}
    </GlassCard>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}> = ({
  title = 'Component Visualization Warning',
  description = 'An error occurred while loading this interface component.',
  onRetry,
  className = '',
}) => {
  return (
    <GlassCard variant="glow" glowColor="danger" className={`p-8 flex flex-col items-center justify-center text-center ${className}`}>
      <div className="p-4 rounded-2xl bg-cyber-danger/10 border border-cyber-danger/30 mb-4 text-cyber-danger">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-text mb-1">{title}</h4>
      <p className="text-xs text-text-muted max-w-sm mb-5 leading-relaxed">{description}</p>
      {onRetry && (
        <GlowButton variant="secondary" size="sm" onClick={onRetry}>
          Retry Action
        </GlowButton>
      )}
    </GlassCard>
  );
};
