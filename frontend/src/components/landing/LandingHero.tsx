'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Sparkles, ArrowRight, Lock, Terminal, Activity, Scan } from 'lucide-react';
import { GlowButton } from '@/components/ui/GlowButton';
import { SceneContainer } from '@/components/3d/SceneContainer';

export const LandingHero: React.FC = () => {
  return (
    <section className="relative min-h-[calc(100vh-76px)] flex items-center justify-center py-16 px-4 sm:px-8 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 via-cyber-cyan/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left 7 Cols: Headline, Tagline, CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-6 text-center lg:text-left"
        >
          {/* Status Indicator Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2/90 border border-cyber-cyan/30 text-xs font-mono shadow-cyan-glow">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-cyan"></span>
            </span>
            <span className="text-cyber-cyan font-bold tracking-wider uppercase">PHISHGUARD-AR</span>
            <span className="text-text-muted">•</span>
            <span className="text-text-muted">FRONTEND DEMONSTRATION</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text leading-[1.1]">
            ADVERSARIALLY ROBUST <br />
            <span className="bg-gradient-to-r from-primary-bright via-cyber-cyan to-white bg-clip-text text-transparent">
              AI PHISHING DEFENSE
            </span>
          </h1>

          {/* Subtitle / Value Proposition */}
          <p className="text-base sm:text-lg text-text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
            Detect threats. Understand attacks. Resist adversarial manipulation. 
            PhishGuard-AR demonstrates dual-transformer conceptual NLP with perturbation hardening to protect communication surfaces against evasion tactics.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link href="/home" className="w-full sm:w-auto">
              <GlowButton
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
              >
                ENTER SECURITY CENTER
              </GlowButton>
            </Link>

            <Link href="/scan" className="w-full sm:w-auto">
              <GlowButton
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto"
                leftIcon={<Scan className="w-4 h-4" />}
              >
                Try Demo Scan
              </GlowButton>
            </Link>
          </div>

          {/* Feature Highlights Ticker */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/60 max-w-lg mx-auto lg:mx-0">
            <div>
              <span className="block text-2xl font-bold font-mono text-cyber-cyan">99.2%</span>
              <span className="text-xs text-text-muted">Simulated Accuracy</span>
            </div>
            <div>
              <span className="block text-2xl font-bold font-mono text-purple-400">~1.3s</span>
              <span className="text-xs text-text-muted">Pipeline Latency</span>
            </div>
            <div>
              <span className="block text-2xl font-bold font-mono text-cyber-success">Dual-AI</span>
              <span className="text-xs text-text-muted">Ensemble Pipeline</span>
            </div>
          </div>
        </motion.div>

        {/* Right 5 Cols: Interactive 3D Cyber Globe & Shield Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative rounded-3xl overflow-hidden border border-primary-bright/30 bg-gradient-to-b from-surface/90 to-surface-2/80 backdrop-blur-2xl shadow-2xl p-2 aspect-[4/3] sm:aspect-square flex items-center justify-center group">
            {/* 3D Scene */}
            <div className="w-full h-full rounded-2xl overflow-hidden relative">
              <SceneContainer />
            </div>

            {/* Floating Cyber Badge */}
            <div className="absolute bottom-5 left-5 right-5 p-3.5 rounded-2xl bg-surface/90 border border-cyber-cyan/30 backdrop-blur-xl shadow-glass flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/20 text-cyber-cyan border border-cyber-cyan/30">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text">3D Global Sensor Grid</h4>
                  <p className="text-[10px] text-text-muted font-mono">Simulated Threat Visualizer</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyber-success/15 text-cyber-success border border-cyber-success/30">
                SIMULATED
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
