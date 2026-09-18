'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Lock, Terminal } from 'lucide-react';
import { GlowButton } from '@/components/ui/GlowButton';

export const LandingCTA: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-8 border-t border-border/60 relative overflow-hidden">
      {/* Radial Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-background pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto w-full text-center space-y-8 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-surface/90 to-surface-2/80 border border-cyber-cyan/30 backdrop-blur-2xl shadow-2xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30 text-xs font-mono font-bold shadow-cyan-glow">
            <Shield className="w-4 h-4" />
            <span>INSTANT SECOPS ACCESS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-text tracking-tight">
            Step Inside the Command Center
          </h2>

          <p className="text-sm sm:text-base text-text-muted max-w-xl mx-auto leading-relaxed">
            Experience real-time AI phishing detection, adversarial evasion robustness testing, and interactive 3D threat intelligence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/login" className="w-full sm:w-auto">
              <GlowButton
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
              >
                ENTER PHISHGUARD-AR
              </GlowButton>
            </Link>

            <Link href="/login" className="w-full sm:w-auto">
              <GlowButton
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto"
                leftIcon={<Terminal className="w-4 h-4" />}
              >
                Launch Demo Terminal
              </GlowButton>
            </Link>
          </div>

          <div className="pt-4 text-[11px] font-mono text-text-muted">
            <span>● ZERO INSTALLATION REQUIRED</span>
            <span className="mx-2">•</span>
            <span>100% FRONTEND SIMULATION</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
