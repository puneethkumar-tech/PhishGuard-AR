'use client';

import React from 'react';
import { CharacterForensicData } from '@/types';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface CharacterForensicsProps {
  characters?: CharacterForensicData[];
}

export const CharacterForensics: React.FC<CharacterForensicsProps> = ({ characters }) => {
  if (!characters || characters.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl bg-surface-2/60 border border-cyber-violet/40 space-y-4 shadow-glass">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-300" />
          <h4 className="text-xs font-mono uppercase font-bold text-text">
            Unicode Homoglyph & Character Mutation Forensics
          </h4>
        </div>

        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyber-violet/20 text-purple-300 border border-cyber-violet/40 self-start sm:self-center">
          ADVERSARIAL EVASION FLAGGED
        </span>
      </div>

      <p className="text-xs text-text-muted leading-relaxed font-sans">
        Adversaries frequently substitute visually indistinguishable glyphs from foreign alphabets (e.g. Cyrillic or Greek) to bypass ASCII keyword filters while deceiving human victims.
      </p>

      {/* Forensic Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-surface-3/80 text-text-muted uppercase text-[10px]">
            <tr>
              <th className="p-3">Inbound Glyph</th>
              <th className="p-3">Unicode Code Point</th>
              <th className="p-3">Script Family</th>
              <th className="p-3">Mapped Target</th>
              <th className="p-3">Target Code Point</th>
              <th className="p-3">Forensic Assessment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 bg-surface">
            {characters.map((item, idx) => (
              <tr key={idx} className="hover:bg-surface-2/50 transition-colors">
                <td className="p-3 font-bold text-base text-purple-300 bg-cyber-violet/10">
                  {item.character}
                </td>
                <td className="p-3 text-cyber-cyan">{item.unicode}</td>
                <td className="p-3 text-text-muted">{item.script}</td>
                <td className="p-3 font-bold text-base text-cyber-success bg-cyber-success/10">
                  {item.targetChar}
                </td>
                <td className="p-3 text-emerald-300">{item.targetUnicode}</td>
                <td className="p-3 text-text-muted font-sans text-xs">{item.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-xl bg-cyber-violet/15 border border-cyber-violet/30 text-xs font-mono text-purple-200">
        <ShieldCheck className="w-4 h-4 text-purple-300 flex-shrink-0" />
        <span>
          Defense Status: NFKC Normalizer converted all confusable glyphs into canonical ASCII representation before transformer attention pass.
        </span>
      </div>
    </div>
  );
};
