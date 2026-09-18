'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowRight, Lock } from 'lucide-react';
import { BRAND } from '@/lib/constants';
import { GlowButton } from '@/components/ui/GlowButton';

export const LandingNavbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full h-[76px] bg-background/80 backdrop-blur-xl border-b border-border/80 px-4 sm:px-8 flex items-center justify-between">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-3 group focus:outline-none">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary-dark to-surface-2 border border-primary-bright/40 shadow-glass-glow group-hover:border-cyber-cyan/60 group-hover:shadow-cyan-glow transition-all duration-300">
          <Shield className="w-5 h-5 text-white cyber-shield-glow" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyber-cyan" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-wider text-text uppercase">
              {BRAND.name}
            </span>
            <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-cyber-cyan/15 text-cyber-cyan rounded border border-cyber-cyan/30">
              SOC SUITE
            </span>
          </div>
          <span className="text-[10px] text-text-muted font-medium tracking-wide">
            {BRAND.tagline}
          </span>
        </div>
      </Link>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-text-muted">
        <a href="#how-it-works" className="hover:text-cyber-cyan transition-colors">
          How It Works
        </a>
        <a href="#features" className="hover:text-cyber-cyan transition-colors">
          AI Architecture
        </a>
        <a href="#robustness" className="hover:text-cyber-cyan transition-colors">
          Adversarial Defense
        </a>
      </nav>

      {/* Auth / Entry Actions */}
      <div className="flex items-center gap-3">
        <Link href="/login" className="hidden sm:inline-block">
          <GlowButton variant="ghost" size="sm" leftIcon={<Lock className="w-3.5 h-3.5" />}>
            Terminal Login
          </GlowButton>
        </Link>
        <Link href="/login">
          <GlowButton variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Enter PhishGuard-AR
          </GlowButton>
        </Link>
      </div>
    </header>
  );
};
