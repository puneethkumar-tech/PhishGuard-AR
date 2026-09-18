'use client';

import React, { useState } from 'react';
import { ScanEvidenceToken, EvidenceCategory } from '@/types';
import { EvidenceLegend } from './EvidenceLegend';
import { Search, Copy, Check, FileText, Info, ShieldCheck } from 'lucide-react';

interface ForensicMessageViewerProps {
  tokens: ScanEvidenceToken[];
  isSafe: boolean;
  rawInput: string;
}

export const ForensicMessageViewer: React.FC<ForensicMessageViewerProps> = ({
  tokens,
  isSafe,
  rawInput,
}) => {
  const [activeCategory, setActiveCategory] = useState<EvidenceCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [hoveredToken, setHoveredToken] = useState<ScanEvidenceToken | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Search Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/70">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary-bright" />
          <h3 className="text-sm font-bold text-text">
            Analyzed Content & Forensic Token Extraction
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Token Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find evidence token..."
              className="bg-surface-2 border border-border rounded-lg pl-8 pr-3 py-1 text-xs text-text placeholder-text-muted focus:outline-none focus:border-cyber-cyan transition-colors w-40 sm:w-48 font-mono"
            />
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-2 hover:bg-surface-3 border border-border text-xs font-mono text-text-muted hover:text-text transition-colors"
            title="Copy Raw Content"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-cyber-success" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Legend Pill Switcher */}
      {!isSafe && (
        <EvidenceLegend
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      )}

      {/* Main Forensic Text View */}
      <div className="relative p-5 rounded-2xl bg-surface/90 border border-border/90 text-xs text-text leading-relaxed font-sans max-h-64 overflow-y-auto shadow-inner space-y-2">
        {isSafe ? (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-cyber-success/10 border border-cyber-success/30 text-emerald-200">
            <ShieldCheck className="w-5 h-5 text-cyber-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white mb-0.5">Clean Communication Payload</p>
              <p className="text-text-muted leading-relaxed">{rawInput}</p>
            </div>
          </div>
        ) : (
          <div className="leading-loose font-mono text-xs sm:text-[13px]">
            {tokens.map((token, idx) => {
              const matchesSearch = searchQuery.trim()
                ? token.text.toLowerCase().includes(searchQuery.toLowerCase())
                : false;

              const isCategoryMatch =
                token.isThreat &&
                (activeCategory === 'ALL' || token.category === activeCategory);

              if (!token.isThreat) {
                return (
                  <span
                    key={idx}
                    className={matchesSearch ? 'bg-cyber-cyan/30 text-white px-1 rounded' : ''}
                  >
                    {token.text}
                  </span>
                );
              }

              const categoryStyle =
                token.category === 'homoglyph'
                  ? 'bg-cyber-violet/25 text-purple-200 border-cyber-violet/60'
                  : token.category === 'url'
                  ? 'bg-cyber-cyan/25 text-cyan-200 border-cyber-cyan/60'
                  : token.category === 'payment'
                  ? 'bg-emerald-500/25 text-emerald-200 border-emerald-500/60'
                  : token.category === 'impersonation'
                  ? 'bg-primary/30 text-blue-200 border-primary-bright/60'
                  : 'bg-cyber-danger/25 text-red-200 border-cyber-danger/60';

              return (
                <span
                  key={idx}
                  onMouseEnter={() => setHoveredToken(token)}
                  onMouseLeave={() => setHoveredToken(null)}
                  className={`inline-block px-2 py-0.5 mx-0.5 rounded font-bold border transition-all cursor-help relative ${
                    isCategoryMatch
                      ? `${categoryStyle} ring-1 ring-cyber-cyan/40 scale-[1.02]`
                      : 'opacity-40 border-transparent bg-surface-2 text-text-muted'
                  } ${matchesSearch ? 'ring-2 ring-yellow-400' : ''}`}
                >
                  {token.text}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Hovered Token Tooltip Details Bar */}
      {hoveredToken && (
        <div className="p-3 rounded-xl bg-surface-2 border border-cyber-cyan/40 text-xs font-mono flex items-start gap-3 shadow-glass animate-fadeIn">
          <Info className="w-4 h-4 text-cyber-cyan flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-text-muted uppercase text-[10px]">Evidence Signal:</span>
              <span className="font-bold text-text uppercase text-[11px]">{hoveredToken.category || 'THREAT TOKEN'}</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyber-cyan/20 text-cyber-cyan">
                {hoveredToken.contributionLevel || 'HIGH'} CONTRIBUTION
              </span>
            </div>
            <p className="text-text-muted font-sans text-xs">
              {hoveredToken.explanation || 'Signal was identified by model lexical feature extractor during inference pass.'}
            </p>
          </div>
        </div>
      )}

      {/* Explanatory disclaimer */}
      <p className="text-[10px] text-text-muted/80 flex items-center gap-1.5 italic font-sans">
        <Info className="w-3 h-3 text-text-muted flex-shrink-0" />
        <span>
          Highlighted patterns are model evidence signals used for this simulation; they do not independently establish malicious intent.
        </span>
      </p>
    </div>
  );
};
