'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, UserCheck, Key, Mail, Sparkles } from 'lucide-react';
import { GlowButton } from '@/components/ui/GlowButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { BRAND } from '@/lib/constants';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('Alex Vance');
  const [email, setEmail] = useState('a.vance@security.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden">
      {/* Ambient background blur */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyber-cyan/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left 5 Cols: Brand Story */}
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
              CREATE SECOPS <br />
              <span className="text-primary-bright">PROFILE</span>
            </h1>
            <p className="text-xs text-text-muted leading-relaxed">
              Initialize a dedicated analyst workspace. Access real-time adversarial simulation suites, forensic reporting, and AI model telemetry.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-2/80 border border-border/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyber-success font-bold">
              <span className="w-2 h-2 rounded-full bg-cyber-success animate-pulse" />
              <span>SOC REGISTRATION GATEWAY</span>
            </div>
            <p className="text-[11px] text-text-muted">
              Role: <span className="text-text font-mono">SecOps AI Analyst</span>
            </p>
          </div>
        </motion.div>

        {/* Right 7 Cols: Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <GlassCard className="p-6 sm:p-8 relative overflow-hidden border-primary-bright/30 shadow-2xl">
            {/* Top Card Header */}
            <div className="flex items-center justify-between pb-5 border-b border-border/70">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-primary-bright font-bold">
                  ANALYST PROVISIONING
                </span>
                <h3 className="text-lg font-bold text-text mt-0.5">Create SecOps Profile</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-3 text-text-muted border border-border">
                FRONTEND DEMO
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSignup} className="mt-6 space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-primary-bright" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Alex Vance"
                  className="w-full bg-surface-2/90 border border-border/80 focus:border-primary-bright/70 rounded-xl px-4 py-2.5 text-xs text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>SecOps Email Address</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="analyst@domain.corp"
                  className="w-full bg-surface-2/90 border border-border/80 focus:border-primary-bright/70 rounded-xl px-4 py-2.5 text-xs text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                />
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-cyber-cyan" />
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-surface-2/90 border border-border/80 focus:border-primary-bright/70 rounded-xl px-4 py-2.5 text-xs text-text placeholder-text-muted focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-cyber-cyan" />
                    <span>Confirm</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-surface-2/90 border border-border/80 focus:border-primary-bright/70 rounded-xl px-4 py-2.5 text-xs text-text placeholder-text-muted focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 space-y-3">
                <GlowButton
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                >
                  INITIALIZE DEMO PROFILE
                </GlowButton>

                <div className="p-3 rounded-xl bg-surface-2/60 border border-border/70 text-[11px] text-text-muted text-center flex items-center justify-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>Frontend Demo: Session stored locally in browser storage.</span>
                </div>
              </div>
            </form>

            {/* Bottom Footer Switch */}
            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
              <span>Already have an account?</span>
              <Link href="/login" className="text-primary-bright hover:underline font-semibold font-mono">
                Log In Terminal →
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
