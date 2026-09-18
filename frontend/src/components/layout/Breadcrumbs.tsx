'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Shield } from 'lucide-react';
import { BRAND } from '@/lib/constants';

interface BreadcrumbsProps {
  customCrumbs?: { label: string; href?: string }[];
  className?: string;
}

const ROUTE_NAME_MAP: Record<string, { section: string; title: string }> = {
  '/home': { section: 'COMMAND CENTER', title: 'Command Center' },
  '/scan': { section: 'COMMAND CENTER', title: 'AI Threat Scanner' },
  '/robustness': { section: 'AI SECURITY', title: 'Adversarial Robustness Lab' },
  '/dashboard': { section: 'AI SECURITY', title: 'SOC Telemetry Dashboard' },
  '/history': { section: 'INTELLIGENCE', title: 'Scan Audit History' },
  '/reports': { section: 'INTELLIGENCE', title: 'Forensic Reports' },
  '/settings': { section: 'SYSTEM', title: 'Platform Configuration' },
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customCrumbs, className = '' }) => {
  const pathname = usePathname();
  
  if (pathname === '/' || pathname === '/login' || pathname === '/signup') return null;

  const routeMeta = ROUTE_NAME_MAP[pathname] || {
    section: 'SECURITY',
    title: pathname.replace('/', '').toUpperCase(),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-[11px] font-mono text-text-muted mb-3 select-none ${className}`}
    >
      <Link
        href="/home"
        className="flex items-center gap-1 hover:text-cyber-cyan transition-colors text-text-muted"
      >
        <Shield className="w-3 h-3 text-primary-bright" />
        <span>{BRAND.name}</span>
      </Link>

      <ChevronRight className="w-3 h-3 text-text-muted/50" />
      <span className="text-text-muted/80">{routeMeta.section}</span>

      <ChevronRight className="w-3 h-3 text-text-muted/50" />
      <span className="text-cyber-cyan font-semibold">{routeMeta.title}</span>
    </nav>
  );
};
