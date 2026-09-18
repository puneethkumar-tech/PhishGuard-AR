'use client';

import React, { Suspense } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { AIIntelligenceWorkspace } from '@/components/ai/AIIntelligenceWorkspace';
import { Loader2 } from 'lucide-react';

export default function AIIntelligencePage() {
  return (
    <PageContainer>
      <Suspense
        fallback={
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex items-center gap-3 font-mono text-xs text-cyan-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>INITIALIZING AI INTELLIGENCE CORE...</span>
            </div>
          </div>
        }
      >
        <AIIntelligenceWorkspace />
      </Suspense>
    </PageContainer>
  );
}
