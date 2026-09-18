'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { ShieldAlert, Cpu, Globe2, FileCode, Layers, ShieldCheck, Activity, Terminal } from 'lucide-react';

const FEATURES = [
  {
    title: 'Dual-AI Model Pipeline',
    desc: 'Combines ultra-fast TF-IDF n-gram feature classification with deep contextual DistilBERT transformers to capture nuanced coercion semantics.',
    icon: Cpu,
    tag: 'ARCHITECTURE',
    color: 'text-cyber-cyan',
  },
  {
    title: 'Adversarial Robustness Lab',
    desc: 'Interactive stress-testing suite defending against homoglyph character substitutions, zero-width space splitting, and synonym perturbations.',
    icon: ShieldAlert,
    tag: 'AI HARDENING',
    color: 'text-purple-300',
  },
  {
    title: '3D Cyber World & Telemetry',
    desc: 'Real-time interactive WebGL visualization depicting active threat nodes, defense shield perimeters, and data stream telemetry vectors.',
    icon: Globe2,
    tag: '3D VISUALS',
    color: 'text-primary-bright',
  },
  {
    title: 'Transparent Explainability',
    desc: 'Highlighted token evidence signals and plain-language action recommendations empower security teams to understand model decisions.',
    icon: FileCode,
    tag: 'XAI FORENSICS',
    color: 'text-cyber-success',
  },
  {
    title: 'Real-Time Telemetry & Metrics',
    desc: 'Live activity trends, threat distributions, and model performance metrics with simulated enterprise-scale SOC telemetry.',
    icon: Activity,
    tag: 'SOC OPERATIONS',
    color: 'text-cyber-warning',
  },
  {
    title: 'Forensic Intelligence Dossiers',
    desc: 'Exportable threat dossiers and IoC signatures structured for SIEM integration and SOC incident response post-mortems.',
    icon: Terminal,
    tag: 'INTELLIGENCE',
    color: 'text-blue-400',
  },
];

export const FeatureGrid: React.FC = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-8 border-t border-border/60 bg-surface-2/30 relative">
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-primary-bright/30 text-xs font-mono text-primary-bright">
            <Layers className="w-3.5 h-3.5" />
            <span>ENTERPRISE CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
            Advanced Defense Features
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Engineered to bridge cutting-edge natural language processing with cyber threat intelligence.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <GlassCard className="p-6 h-full flex flex-col justify-between group hover:border-primary-bright/40 transition-all">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl bg-surface-2 border border-border ${feature.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-surface-3 text-text-muted border border-border">
                        {feature.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-text group-hover:text-primary-bright transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed font-sans">
                      {feature.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-border/50 flex items-center gap-2 text-[11px] font-mono text-cyber-cyan">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>VERIFIED DEFENSE CAPABILITY</span>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
