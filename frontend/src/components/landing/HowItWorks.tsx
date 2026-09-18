'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Sparkles, Terminal, ShieldAlert, CheckCircle2, Cpu, Lock } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Signal Ingestion',
    desc: 'Receives raw text payloads, RFC 822 email headers, URLs, and attachment tokens across diverse enterprise communication channels.',
    icon: Terminal,
    color: 'text-primary-bright',
    bgColor: 'bg-primary/20',
  },
  {
    step: '02',
    title: 'AI Cyber Robot Analysis',
    desc: 'Simulated dual-model neural analyzer executes high-speed TF-IDF n-gram classification combined with contextual DistilBERT self-attention.',
    icon: Cpu,
    color: 'text-cyber-cyan',
    bgColor: 'bg-cyber-cyan/20',
  },
  {
    step: '03',
    title: 'Adversarial Hardening',
    desc: 'Normalizes Unicode NFKC confusable homoglyphs, zero-width characters, and deceptive punycode strings to resist bypass manipulation.',
    icon: Lock,
    color: 'text-purple-300',
    bgColor: 'bg-cyber-violet/20',
  },
  {
    step: '04',
    title: 'Threat Containment',
    desc: 'Delivers calibrated confidence verdicts, highlighted evidence tokens, and actionable plain-language defense protocols.',
    icon: CheckCircle2,
    color: 'text-cyber-success',
    bgColor: 'bg-cyber-success/20',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-8 border-t border-border/60 relative">
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-cyber-cyan/20 text-xs font-mono text-cyber-cyan">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CORE INTELLIGENCE WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
            How PhishGuard-AR Defends
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            From inbound message ingestion to adversarial perturbation neutralization, explore the four-stage AI defense pipeline.
          </p>
        </div>

        {/* 4 Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard className="p-6 h-full flex flex-col justify-between relative overflow-hidden group hover:border-cyber-cyan/50 transition-all">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-extrabold font-mono text-text-muted/40 group-hover:text-cyber-cyan transition-colors">
                        {item.step}
                      </span>
                      <div className={`p-3 rounded-xl ${item.bgColor} ${item.color} border border-border`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-text group-hover:text-cyber-cyan transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-text-muted">
                    <span>STAGE {item.step}</span>
                    <span className="text-cyber-cyan font-semibold">ONLINE</span>
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
