import React from 'react';
import { Eye, RotateCcw, SlidersHorizontal, Sparkles } from 'lucide-react';
import { BRAND_NAME, BRAND_LOGO } from '../utils/auditLogic';

interface HeaderProps {
  communityName: string;
  auditorName: string;
  selectedPlatforms: string[];
  isPopulated: boolean;
  onCommunityNameChange: (name: string) => void;
  onAuditorNameChange: (name: string) => void;
  onOpenPlatformDialog: () => void;
  onLoadSample: () => void;
  onRequestReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  communityName,
  auditorName,
  selectedPlatforms,
  isPopulated,
  onCommunityNameChange,
  onAuditorNameChange,
  onOpenPlatformDialog,
  onLoadSample,
  onRequestReset,
}) => {
  return (
    <header className="border-b border-zinc-800/80 bg-[#0C0E12] pt-6 pb-9 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-7">
        {/* Top Navigation Bar: Brand SOŪL 魂 & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-850">
          {/* Brand Wordmark with Kanji 魂 */}
          <div className="flex items-center gap-3">
            <span
              className="text-2xl font-black text-[#00FF87] leading-none select-none"
              aria-label="SOŪL Logo 魂"
            >
              {BRAND_LOGO}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-wider text-white">
                {BRAND_NAME}
              </span>
              <span className="text-zinc-600" aria-hidden="true">/</span>
              <span className="text-xs text-zinc-400 font-medium hidden sm:inline">
                The 5-Dimension Community Audit Tool
              </span>
            </div>
          </div>

          {/* Functional Actions */}
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={onLoadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-[#00FF87] hover:border-[#00FF87]/50 transition cursor-pointer font-medium"
              title="Populate realistic sample responses across Discord and Telegram"
            >
              <Eye className="w-3.5 h-3.5 text-[#00FF87]" aria-hidden="true" />
              <span>{isPopulated ? 'Reload Sample Data' : 'Preview Sample Audit'}</span>
            </button>
            <button
              type="button"
              onClick={onRequestReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-red-400 transition cursor-pointer font-medium"
              title="Reset worksheet back to unassessed state"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Title, Quote & Instructions */}
        <div className="space-y-3.5 text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            The 5-Dimension <span className="text-[#00FF87]">Community Audit</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 font-medium max-w-3xl leading-relaxed">
            &ldquo;Understand the health of your community before deciding what needs to change.&rdquo;
          </p>
          <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
            <span className="text-[#00FF87] font-semibold mr-1.5">Instruction:</span>
            Select your platform, assess each dimension, document your findings, and calculate your community health score.
          </div>
        </div>

        {/* Audit Subject Profile: Community Name (Subject of Downloaded Card) */}
        <div className="bg-[#12161D] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Audit Profile & Subject Definition
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                The community name defined here will be the prominent subject of your downloadable Audit Card.
              </p>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              Auto-saved locally
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Community Name Input (Primary Subject) */}
            <div className="md:col-span-7 space-y-1.5">
              <label
                htmlFor="community-name-input"
                className="block text-xs font-bold uppercase tracking-wider text-white"
              >
                Community Name (Subject of Audit Card) <span className="text-[#00FF87]">*</span>
              </label>
              <input
                id="community-name-input"
                type="text"
                value={communityName}
                onChange={(e) => onCommunityNameChange(e.target.value)}
                placeholder="e.g. Belonging Guild, Developer DAO, Founder Circle..."
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-750 focus:border-[#00FF87] text-white text-sm sm:text-base font-medium outline-none transition placeholder-zinc-600"
              />
              <p className="text-[11px] text-zinc-400">
                Printed on the downloadable diagnostic card and executive summary.
              </p>
            </div>

            {/* Auditor / Evaluator (Optional) */}
            <div className="md:col-span-5 space-y-1.5">
              <label
                htmlFor="auditor-name-input"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-300"
              >
                Auditor / Lead <span className="text-zinc-400 font-normal">(Optional)</span>
              </label>
              <input
                id="auditor-name-input"
                type="text"
                value={auditorName}
                onChange={(e) => onAuditorNameChange(e.target.value)}
                placeholder="e.g. Community Architect, Lead Moderator..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-[#00FF87] text-white text-sm outline-none transition placeholder-zinc-600"
              />
              <p className="text-[11px] text-zinc-400">
                Name of person or team conducting the evaluation.
              </p>
            </div>
          </div>

          {/* Quick Platform Dialog Callout */}
          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-zinc-400">Selected platform(s) for this audit:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedPlatforms.map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-750 text-xs font-semibold text-white"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenPlatformDialog}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-700 text-xs font-semibold text-[#00FF87] transition cursor-pointer self-start sm:self-center"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Change Platform(s)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
