'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { GlowButton } from '@/components/ui/GlowButton';
import { Sparkles, ScanLine, FlaskConical, Bot } from 'lucide-react';
import { RobotFallback2D } from '@/components/ai/RobotFallback2D';

// Dynamically load 3D Robot container
const RobotSceneContainer = dynamic(
  () =>
    import('@/components/ai/RobotSceneContainer').then(
      (mod) => mod.RobotSceneContainer
    ),
  {
    ssr: false,
    loading: () => <RobotFallback2D state="ANALYZING" />,
  }
);

interface SecurityInsightPanelProps {
  insightText: string;
}

export const SecurityInsightPanel: React.FC<SecurityInsightPanelProps> = ({ insightText }) => {
  return (
    <GlassCard className="p-5 sm:p-6 space-y-4 border-cyber-cyan/30 shadow-glass">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-cyan/20 text-cyber-cyan">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              AI Security Analyst Briefing
            </h3>
            <p className="text-[11px] text-text-muted">
              Continuous empirical synthesis of evasion attempts and defensive posture.
            </p>
          </div>
        </div>

        <Badge variant="cyan" size="sm">
          SIMULATED AI INSIGHT
        </Badge>
      </div>

      {/* Grid: Robot Visual + Narrative */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: 3D Robot Canvas */}
        <div className="md:col-span-4 h-[180px] rounded-xl bg-surface-2/90 border border-border overflow-hidden relative">
          <RobotSceneContainer state="ANALYZING" />
        </div>

        {/* Right: Analytical Insight Text & CTAs */}
        <div className="md:col-span-8 space-y-3">
          <div className="p-4 rounded-xl bg-surface-2/80 border border-border text-xs text-text leading-relaxed font-sans">
            <p>{insightText}</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap pt-1">
            <Link href="/scan">
              <GlowButton
                variant="primary"
                size="sm"
                leftIcon={<ScanLine className="w-3.5 h-3.5" />}
              >
                Launch Threat Scanner →
              </GlowButton>
            </Link>

            <Link href="/robustness">
              <GlowButton
                variant="secondary"
                size="sm"
                leftIcon={<FlaskConical className="w-3.5 h-3.5" />}
              >
                Open Robustness Lab →
              </GlowButton>
            </Link>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
