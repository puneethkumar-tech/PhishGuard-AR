'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Lock, ArrowRight, UserCheck, Key, Eye, EyeOff, Sparkles, Terminal } from 'lucide-react';
import { GlowButton } from '@/components/ui/GlowButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { BRAND } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('secops.analyst@phishguard.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      localStorage.setItem('phishguard-demo-auth', 'true');
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsLoading(false);
      router.push('/home');
    }, 600);
  };

  const handleDemoAccess = () => {
    setIsLoading(true);
    try {
      localStorage.setItem('phishguard-demo-auth', 'true');
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsLoading(false);
      router.push('/home');
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden">
      {/* Ambient background blur */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyber-cyan/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left 5 Cols: Brand Story / Security Visual */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 space-y-6 hidden lg:block"
        >
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary-dark border border-primary-bright/40 shadow-glass-glow">
              <Shield className="w-8 h-8 text-white cyber-shield-glow" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-mono tracking-wider text-text uppercase">
                {BRAND.name}
              </h2>
              <p className="text-xs text-text-muted">{BRAND.tagline}</p>
            </div>
          </Link>

          <div className="space-y-3">
            <h1 className="text-2xl font-extrabold text-text leading-tight">
              SECURE ACCESS <br />
              <span className="text-cyber-cyan">TERMINAL</span>
            </h1>
            <p className="text-xs text-text-muted leading-relaxed">
              Enter the PhishGuard-AR Security Operations Center environment. Access real-time threat intelligence, AI neural scanning, and adversarial robustness testing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-2/80 border border-border/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyber-cyan font-bold">
              <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
              <span>● SECURITY GRID ONLINE</span>
            </div>
            <p className="text-[11px] text-text-muted">
              Active Environment: <span className="text-text font-mono">SIMULATION MODE</span>
            </p>
          </div>
        </motion.div>

        {/* Right 7 Cols: Authentication Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <GlassCard className="p-6 sm:p-8 relative overflow-hidden border-cyber-cyan/30 shadow-2xl">
            {/* Top Card Header */}
            <div className="flex items-center justify-between pb-5 border-b border-border/70">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyber-cyan font-bold">
                  SECOPS AUTHENTICATION
                </span>
                <h3 className="text-lg font-bold text-text mt-0.5">Terminal Sign-In</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-3 text-text-muted border border-border">
                FRONTEND DEMO
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleAuthenticate} className="mt-6 space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-primary-bright" />
                  <span>SecOps Email Address</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="analyst@domain.corp"
                  className="w-full bg-surface-2/90 border border-border/80 focus:border-cyber-cyan/70 rounded-xl px-4 py-2.5 text-xs text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20 transition-all font-mono"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-text-muted flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-cyber-cyan" />
                    <span>Access Key / Password</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-cyber-cyan hover:underline flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-surface-2/90 border border-border/80 focus:border-cyber-cyan/70 rounded-xl px-4 py-2.5 text-xs text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20 transition-all font-mono"
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-text-muted hover:text-text">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-border bg-surface-2 text-primary focus:ring-0"
                  />
                  <span>Remember session token</span>
                </label>

                <span className="text-[11px] font-mono text-text-muted">
                  OAuth / SSO Ready
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-3">
                <GlowButton
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                >
                  AUTHENTICATE
                </GlowButton>

                <GlowButton
                  type="button"
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={handleDemoAccess}
                  leftIcon={<Sparkles className="w-4 h-4 text-cyber-cyan" />}
                >
                  CONTINUE AS DEMO
                </GlowButton>
              </div>
            </form>

            {/* Bottom Footer Switch */}
            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
              <span>Need a new terminal profile?</span>
              <Link href="/signup" className="text-cyber-cyan hover:underline font-semibold font-mono">
                Create Account →
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
