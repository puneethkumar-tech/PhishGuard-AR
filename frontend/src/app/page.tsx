'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingHero } from '@/components/landing/LandingHero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { LandingCTA } from '@/components/landing/LandingCTA';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function PublicLandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* 1. Public Navigation Bar */}
      <LandingNavbar />

      {/* 2. Main Hero Presentation */}
      <main className="flex-1">
        <LandingHero />
        <HowItWorks />
        <FeatureGrid />
        <LandingCTA />
      </main>

      {/* 3. Public Footer */}
      <LandingFooter />
    </div>
  );
}
