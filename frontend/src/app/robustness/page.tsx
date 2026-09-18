'use client';

import React, { Suspense } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { RobustnessWorkspace } from '@/components/robustness/RobustnessWorkspace';
import { Loader2 } from 'lucide-react';

export default function RobustnessPage() {
  return (
    <PageContainer>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3 text-cyber-cyan font-mono text-xs">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>INITIALIZING ADVERSARIAL ROBUSTNESS LAB...</span>
            </div>
          </div>
        }
      >
        <RobustnessWorkspace />
      </Suspense>
    </PageContainer>
  );
}
