'use client';

import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  ScanLine,
  FlaskConical,
  History,
  FileText,
  Settings,
  ArrowRight,
} from 'lucide-react';

export const DashboardQuickActions: React.FC = () => {
  const actions = [
    {
      title: 'AI Threat Scanner',
      desc: 'Analyze live payloads & XAI forensic signals',
      href: '/scan',
      icon: ScanLine,
      color: 'text-primary-bright',
      bg: 'bg-primary/20',
    },
    {
      title: 'Adversarial Robustness Lab',
      desc: 'Simulate perturbations & AR defense recovery',
      href: '/robustness',
      icon: FlaskConical,
      color: 'text-purple-300',
      bg: 'bg-cyber-violet/20',
    },
    {
      title: 'Scan History Archive',
      desc: 'Review past telemetry audits & flagged logs',
      href: '/history',
      icon: History,
      color: 'text-cyber-cyan',
      bg: 'bg-cyber-cyan/20',
    },
    {
      title: 'Intelligence Reports',
      desc: 'Access executive STIX & forensic dossiers',
      href: '/reports',
      icon: FileText,
      color: 'text-cyber-warning',
      bg: 'bg-cyber-warning/20',
    },
    {
      title: 'System & Security Settings',
      desc: 'Calibrate sensitivity & protection modes',
      href: '/settings',
      icon: Settings,
      color: 'text-text-muted',
      bg: 'bg-surface-3',
    },
  ];

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      <div className="pb-3 border-b border-border/70 flex items-center justify-between">
        <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
          Operations Quick Actions & Navigation
        </h3>
        <span className="text-[10px] font-mono text-text-muted">DIRECT ROUTING</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;

          return (
            <Link key={act.href} href={act.href}>
              <div className="p-4 rounded-xl bg-surface-2/70 border border-border hover:border-cyber-cyan/50 hover:bg-surface-2 transition-all h-full flex flex-col justify-between group cursor-pointer">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className={`p-2 rounded-xl ${act.bg} ${act.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-cyber-cyan group-hover:translate-x-0.5 transition-all" />
                  </div>

                  <h4 className="text-xs font-bold text-text font-mono group-hover:text-cyber-cyan transition-colors mb-1">
                    {act.title}
                  </h4>

                  <p className="text-[11px] text-text-muted leading-tight">
                    {act.desc}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </GlassCard>
  );
};
