'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlowButton } from '@/components/ui/GlowButton';
import { Badge } from '@/components/ui/Badge';
import { SceneContainer } from '@/components/3d/SceneContainer';
import { ShieldCheck, ArrowRight, Play, Sparkles, Lock, Cpu } from 'lucide-react';

interface HeroSectionProps {
  onExploreScan?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreScan }) => {
  return (
    <section className="relative w-full rounded-3xl bg-gradient-to-b from-surface/80 via-surface/40 to-transparent border border-border/60 p-6 sm:p-8 lg:p-10 shadow-glass overflow-hidden">
      {/* Background ambient light effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-cyber-violet/15 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 flex flex-col space-y-5"
        >
          {/* Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="cyan" dot>
              AI-POWERED CYBER DEFENSE
            </Badge>
            <Badge variant="outline" size="sm">
              v1.0 AR-ENGINE
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text leading-[1.1]">
            A SAFER <br />
            DIGITAL{' '}
            <span className="bg-gradient-to-r from-primary-bright via-cyber-cyan to-blue-400 bg-clip-text text-transparent cyber-glow-text">
              TOMORROW
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-text-muted leading-relaxed max-w-xl">
            Detect AI-powered threats. Analyze attack patterns. Resist with robust defenses.
            Stay safe everywhere with dual-engine intelligence and adversarial robustness evaluation.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/scan">
              <GlowButton
                size="lg"
                variant="primary"
                rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
              >
                Start Scanning
              </GlowButton>
            </Link>

            <GlowButton
              size="lg"
              variant="secondary"
              leftIcon={<Play className="w-4 h-4 text-cyber-cyan fill-cyber-cyan/20" />}
              onClick={onExploreScan}
            >
              Watch Demo
            </GlowButton>
          </div>

          {/* Feature Highlights Pills */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/60">
            <div className="flex items-center gap-2 text-text-muted">
              <ShieldCheck className="w-4 h-4 text-cyber-success" />
              <span className="text-xs font-medium">Robust Defense</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <Cpu className="w-4 h-4 text-cyber-cyan" />
              <span className="text-xs font-medium">Dual AI Pipeline</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <Lock className="w-4 h-4 text-primary-bright" />
              <span className="text-xs font-medium">Zero-Trust AR</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: 3D Cyber Globe with Interactive HUD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative w-full h-[380px] sm:h-[440px] lg:h-[480px] flex items-center justify-center"
        >
          {/* 3D Scene Container with Cyber HUD & Simulation Engine */}
          <SceneContainer />
        </motion.div>
      </div>
    </section>
  );
};
