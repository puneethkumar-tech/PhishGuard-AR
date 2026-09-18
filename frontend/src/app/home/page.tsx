'use client';

import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { MetricCard } from '@/components/ui/MetricCard';
import { ScanPreview } from '@/components/home/ScanPreview';
import { AIModelPipeline } from '@/components/home/AIModelPipeline';
import { LiveThreatMap } from '@/components/home/LiveThreatMap';
import { ThreatActivityChart } from '@/components/home/ThreatActivityChart';
import { DEMO_METRICS } from '@/lib/demo-data';

export default function CommandCenterPage() {
  const scrollToScan = () => {
    const el = document.getElementById('scan-preview-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Hero Section with 3D Cyber Globe & Shield */}
      <HeroSection onExploreScan={scrollToScan} />

      {/* 2. Key Demo Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEMO_METRICS.map((metric) => (
          <MetricCard key={metric.id} data={metric} />
        ))}
      </section>

      {/* 3. Main Operational Center: Scan Preview & Telemetry Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Scan Tool & Model Architecture */}
        <div className="lg:col-span-7 space-y-6">
          <ScanPreview id="scan-preview-section" />
          <AIModelPipeline />
        </div>

        {/* Right 5 Columns: Live Telemetry Map & Activity Trends */}
        <div className="lg:col-span-5 space-y-6">
          <LiveThreatMap />
          <ThreatActivityChart />
        </div>
      </section>
    </div>
  );
}
