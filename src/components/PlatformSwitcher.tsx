import React from 'react';
import { MultiPlatformAuditState } from '../types/audit';
import { calculatePlatformScore } from '../utils/auditLogic';
import { SlidersHorizontal, CheckCircle2, MessageSquare, Radio } from 'lucide-react';

interface PlatformSwitcherProps {
  state: MultiPlatformAuditState;
  onSelectPlatform: (platform: string) => void;
  onOpenDialog: () => void;
}

export const PlatformSwitcher: React.FC<PlatformSwitcherProps> = ({
  state,
  onSelectPlatform,
  onOpenDialog,
}) => {
  return (
    <div className="bg-[#12161D] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00FF87]">
              Step 1: Platforms Under Audit
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400">
              {state.selectedPlatforms.length} {state.selectedPlatforms.length === 1 ? 'Platform' : 'Platforms'} Selected
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
            Select Platform to Audit
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Switch between platforms to evaluate their dimensions one by one.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenDialog}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-[#00FF87] border border-zinc-700 hover:border-[#00FF87]/40 transition cursor-pointer self-start sm:self-center shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#00FF87]" aria-hidden="true" />
          <span>Manage Platforms</span>
        </button>
      </div>

      {/* Side-by-Side Platform Cards */}
      <div
        role="tablist"
        aria-label="Audited Platforms"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        {state.selectedPlatforms.map((platform) => {
          const isActive = state.activePlatform === platform;
          const result = calculatePlatformScore(platform, state.platformAudits[platform]);
          const isComplete = result.scoredCount === 5;
          const hasScores = result.scoredCount > 0;

          return (
            <button
              key={platform}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectPlatform(platform)}
              className={`p-4 rounded-xl text-left transition-all border cursor-pointer relative flex flex-col justify-between gap-3 ${
                isActive
                  ? 'bg-zinc-900/90 border-[#00FF87] ring-1 ring-[#00FF87]/50 shadow-lg'
                  : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40 text-zinc-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-lg transition shrink-0 ${
                      isActive
                        ? 'bg-[#00FF87]/15 text-[#00FF87]'
                        : 'bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="font-bold text-sm sm:text-base text-white block">
                      {platform}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {result.scoredCount}/5 Dimensions Scored
                    </span>
                  </div>
                </div>

                {isActive ? (
                  <span className="px-2 py-0.5 rounded-md bg-[#00FF87]/20 border border-[#00FF87]/40 text-[#00FF87] text-[10px] font-bold uppercase tracking-wider shrink-0">
                    Active
                  </span>
                ) : (
                  <span className="text-[11px] text-zinc-400 hover:text-zinc-200 transition">
                    Click to audit
                  </span>
                )}
              </div>

              {/* Score pill inside card */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Platform Score:</span>
                {hasScores && result.score !== null ? (
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="font-extrabold text-sm text-[#00FF87]">
                      {result.score.toFixed(2)}/5
                    </span>
                    {result.interpretation && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                        {result.interpretation.label}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-zinc-400 italic font-mono text-[11px]">
                    Unassessed
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Platform Banner Notice */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-300">
        <Radio className="w-4 h-4 text-[#00FF87] animate-pulse shrink-0" aria-hidden="true" />
        <div>
          Currently auditing <strong className="text-white font-bold">{state.activePlatform}</strong>.
          <span className="text-zinc-400 ml-1">
            Ratings and notes documented in the 5 dimensions below apply to this platform.
          </span>
        </div>
      </div>
    </div>
  );
};
