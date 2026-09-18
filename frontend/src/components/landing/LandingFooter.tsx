'use client';

import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { BRAND } from '@/lib/constants';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="py-12 px-4 sm:px-8 border-t border-border/70 bg-surface/80 text-text-muted text-xs">
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20 text-primary-bright border border-primary-bright/30">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-text uppercase tracking-wider block font-mono">
              {BRAND.name}
            </span>
            <span className="text-[11px] text-text-muted">
              {BRAND.tagline}
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[11px]">
          <Link href="/login" className="hover:text-cyber-cyan transition-colors">
            SOC Terminal
          </Link>
          <Link href="/login" className="hover:text-cyber-cyan transition-colors">
            Demo Access
          </Link>
          <a href="#how-it-works" className="hover:text-cyber-cyan transition-colors">
            How It Works
          </a>
          <a href="#features" className="hover:text-cyber-cyan transition-colors">
            AI Architecture
          </a>
        </div>

        {/* Legal / Demo Notice */}
        <div className="text-center md:text-right font-mono text-[10px] space-y-0.5">
          <p className="text-text-muted">
            &copy; {new Date().getFullYear()} PhishGuard-AR. All rights reserved.
          </p>
          <p className="text-cyber-cyan/80">
            SIMULATION ENVIRONMENT • FRONTEND DEMO
          </p>
        </div>
      </div>
    </footer>
  );
};
