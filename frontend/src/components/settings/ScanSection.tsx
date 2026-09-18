'use client';

import React from 'react';
import { Scan, FileText, Mail, Globe, HardDrive, Sparkles } from 'lucide-react';
import { PlatformSettings } from '@/types';

interface ScanSectionProps {
  scan: PlatformSettings['scan'];
  onChange: (scan: PlatformSettings['scan']) => void;
}

export const ScanSection: React.FC<ScanSectionProps> = ({
  scan,
  onChange,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Scan className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-100">Scan Preferences</h3>
          <p className="text-xs text-slate-400">
            Default input channels, demo scenario preloads, and pipeline display options.
          </p>
        </div>
      </div>

      {/* Default Input Type */}
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-2">Default Input Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'TEXT', label: 'Raw Text', icon: <FileText className="w-4 h-4" /> },
            { id: 'EMAIL', label: 'Email RFC-822', icon: <Mail className="w-4 h-4" /> },
            { id: 'URL', label: 'Web URL', icon: <Globe className="w-4 h-4" /> },
            { id: 'FILE', label: 'Attachment', icon: <HardDrive className="w-4 h-4" /> },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => onChange({ ...scan, defaultInputType: type.id as any })}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-mono border transition-all ${
                scan.defaultInputType === type.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-md'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {type.icon}
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Selector */}
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-2">Default Demo Scenario</label>
        <select
          value={scan.defaultScenarioId}
          onChange={(e) => onChange({ ...scan, defaultScenarioId: e.target.value })}
          className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
        >
          <option value="scenario-cred">Credential Harvester (Microsoft 365 Spoof)</option>
          <option value="scenario-homo">Homoglyph Typosquatting Attack (pаypаl-login.com)</option>
          <option value="scenario-urgent">Executive Wire Transfer BEC Urgent Scam</option>
          <option value="scenario-legit">Verified Safe Corporate Notification</option>
          <option value="scenario-zero-width">Zero-Width Hidden Character Evasion</option>
        </select>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div
          onClick={() => onChange({ ...scan, autoSaveScanHistory: !scan.autoSaveScanHistory })}
          className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
        >
          <div>
            <span className="text-xs font-semibold text-slate-200 block">Auto-save Scan History</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Persist scan analyses automatically to Threat History.
            </span>
          </div>
          <input
            type="checkbox"
            checked={scan.autoSaveScanHistory}
            onChange={() => {}}
            className="w-4 h-4 accent-cyan-400 rounded pointer-events-none"
          />
        </div>

        <div
          onClick={() => onChange({ ...scan, showScanPipeline: !scan.showScanPipeline })}
          className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
        >
          <div>
            <span className="text-xs font-semibold text-slate-200 block">Show Pipeline Stepper</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Animate the 4-stage neural pipeline during execution.
            </span>
          </div>
          <input
            type="checkbox"
            checked={scan.showScanPipeline}
            onChange={() => {}}
            className="w-4 h-4 accent-cyan-400 rounded pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};
