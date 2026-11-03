import React from 'react';
import { MultiPlatformAuditState } from '../types/audit';
import {
  DIMENSIONS,
  calculateCumulativeAuditResult,
  getScoreLabel,
  AUDIT_DISCLAIMER,
} from '../utils/auditLogic';
import {
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  ArrowRight,
  Sparkles,
  Layers,
} from 'lucide-react';

interface ScoreOverviewProps {
  state: MultiPlatformAuditState;
  onSelectPlatform: (platform: string) => void;
  onLoadSample: () => void;
}

export const ScoreOverview: React.FC<ScoreOverviewProps> = ({
  state,
  onSelectPlatform,
  onLoadSample,
}) => {
  const cumulative = calculateCumulativeAuditResult(state);
  const totalPlatforms = state.selectedPlatforms.length;
  const scoredPlatforms = cumulative.platformResults.filter((p) => p.score !== null);
  const hasAnyScores = scoredPlatforms.length > 0;
  const interpretation = cumulative.interpretation;
  const scorePercentage = cumulative.cumulativeScore !== null ? (cumulative.cumulativeScore / 5) * 100 : 0;

  return (
    <section
      aria-labelledby="community-health-score-heading"
      className="bg-[#12161D] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8"
    >
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#00FF87] mb-1">
            <BarChart3 className="w-4 h-4" aria-hidden="true" />
            <span>Audit Diagnostic Results</span>
          </div>
          <h2
            id="community-health-score-heading"
            className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
          >
            Community Health Score
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Individual scores per platform with an unweighted cumulative community health score.
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {hasAnyScores && interpretation ? (
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-bold tracking-wide ${interpretation.badgeBg}`}
            >
              {cumulative.cumulativeScore! >= 3.5 ? (
                <CheckCircle className="w-4 h-4" aria-hidden="true" />
              ) : (
                <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              )}
              <span>{interpretation.label}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-zinc-400 font-mono">
              <span>{scoredPlatforms.length} of {totalPlatforms} Platforms Scored</span>
            </div>
          )}
        </div>
      </div>

      {!hasAnyScores ? (
        /* Empty / New User State */
        <div className="p-8 sm:p-10 rounded-2xl bg-zinc-950/80 border border-zinc-850 text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400">
            <BarChart3 className="w-6 h-6 text-[#00FF87]" aria-hidden="true" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white">
              Awaiting Dimension Scoring
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Assign scores (1–5) to dimensions for your platform(s) above to generate your individual platform scores, cumulative health score, and actionable next steps.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={onLoadSample}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-750 text-xs sm:text-sm font-semibold text-[#00FF87] hover:border-[#00FF87]/60 transition cursor-pointer"
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
              <span>Preview Sample Audit to See Results</span>
            </button>
          </div>
        </div>
      ) : (
        /* Scored Results Display */
        <div className="space-y-8">
          {/* Main Hero Grid: Cumulative Score + Cross-Platform Dimension Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Cumulative Health Score Display */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-850 text-center relative space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Cumulative Community Health Score
              </span>
              <div className="flex items-baseline justify-center gap-1 font-mono">
                <span className="text-5xl sm:text-6xl font-black text-[#00FF87] tracking-tight">
                  {cumulative.cumulativeScore !== null ? cumulative.cumulativeScore.toFixed(2) : '--'}
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-zinc-500">/ 5.00</span>
              </div>

              {interpretation && (
                <>
                  <p className="text-base font-bold text-white">
                    &ldquo;{interpretation.label}&rdquo;
                  </p>
                  <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                    {interpretation.summary}
                  </p>
                </>
              )}

              {/* Gauge Bar */}
              <div className="w-full pt-2">
                <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.max(8, scorePercentage))}%`,
                      backgroundColor: interpretation ? interpretation.color : '#00FF87',
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400 mt-1.5 font-mono">
                  <span>1.0 Critical</span>
                  <span>2.0 Weak</span>
                  <span>3.0 Dev</span>
                  <span>3.5 Strong</span>
                  <span>4.5 Exec</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-zinc-400 font-mono">
                Average across {scoredPlatforms.length} scored {scoredPlatforms.length === 1 ? 'platform' : 'platforms'}
              </div>
            </div>

            {/* Right: Cross-Platform Dimension Averages */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-zinc-800/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Cross-Platform Dimension Averages
                </h3>
                <span className="text-xs text-zinc-400 font-mono">
                  5 Dimensions Evaluated
                </span>
              </div>

              <div className="space-y-3.5">
                {DIMENSIONS.map((dim) => {
                  const val = cumulative.averageDimensionScores[dim.id];
                  const isAssessed = val !== null;
                  const barPercent = isAssessed ? (val / 5) * 100 : 0;
                  const isLowest = cumulative.lowestDimension?.id === dim.id && isAssessed;
                  const isStrong = isAssessed && val >= 3.5;

                  return (
                    <div key={dim.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            {dim.number}. {dim.name}
                          </span>
                          {isLowest && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-medium">
                              Weakest Dimension
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-zinc-400 text-[11px]">
                            {getScoreLabel(val !== null ? Math.round(val) : null)}
                          </span>
                          <span
                            className={`font-bold ${
                              !isAssessed
                                ? 'text-zinc-600'
                                : isStrong
                                ? 'text-[#00FF87]'
                                : isLowest
                                ? 'text-amber-400'
                                : 'text-zinc-200'
                            }`}
                          >
                            {isAssessed ? `${val.toFixed(2)} / 5` : '—'}
                          </span>
                        </div>
                      </div>

                      {/* Visual horizontal bar */}
                      <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-850">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            !isAssessed
                              ? 'bg-zinc-800'
                              : isStrong
                              ? 'bg-[#00FF87]'
                              : isLowest
                              ? 'bg-amber-400'
                              : 'bg-zinc-400'
                          }`}
                          style={{ width: `${barPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Scale Guide reference */}
              <div className="pt-2 text-[11px] text-zinc-400 grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-center">
                <div className="p-1 rounded bg-zinc-950 border border-zinc-900">
                  <span className="font-semibold text-red-400">1.00–1.99</span>
                  <p className="text-[10px] text-zinc-400">Critical</p>
                </div>
                <div className="p-1 rounded bg-zinc-950 border border-zinc-900">
                  <span className="font-semibold text-orange-400">2.00–2.99</span>
                  <p className="text-[10px] text-zinc-400">Needs Impr.</p>
                </div>
                <div className="p-1 rounded bg-zinc-950 border border-zinc-900">
                  <span className="font-semibold text-amber-400">3.00–3.49</span>
                  <p className="text-[10px] text-zinc-400">Developing</p>
                </div>
                <div className="p-1 rounded bg-zinc-950 border border-zinc-900">
                  <span className="font-semibold text-[#00FF87]">3.50–4.49</span>
                  <p className="text-[10px] text-zinc-400">Strong</p>
                </div>
                <div className="p-1 rounded bg-zinc-950 border border-zinc-900 col-span-2 sm:col-span-1">
                  <span className="font-semibold text-[#00FF87]">4.50–5.00</span>
                  <p className="text-[10px] text-zinc-400">Excellent</p>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Platform Scorecards (Side-by-Side Cards) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Individual Platform Scorecards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cumulative.platformResults.map((pr) => {
                const isActive = state.activePlatform === pr.platform;
                const isScored = pr.score !== null;

                return (
                  <div
                    key={pr.platform}
                    className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                      isActive
                        ? 'bg-[#12161E] border-[#00FF87]/50 shadow-md'
                        : 'bg-zinc-950/80 border-zinc-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-base text-white">{pr.platform}</span>
                        {pr.interpretation && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${pr.interpretation.badgeBg}`}>
                            {pr.interpretation.label}
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-1 font-mono">
                        <span className="text-2xl font-black text-[#00FF87]">
                          {isScored ? pr.score?.toFixed(2) : '--'}
                        </span>
                        <span className="text-xs text-zinc-400 font-bold">/ 5.00</span>
                      </div>

                      <div className="mt-2 text-xs text-zinc-400 space-y-1 font-mono text-[11px]">
                        <div>Scored: {pr.scoredCount}/5 Dimensions</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectPlatform(pr.platform)}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        isActive
                          ? 'bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30'
                          : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800'
                      }`}
                    >
                      <span>{isActive ? 'Currently Editing' : `Switch to ${pr.platform}`}</span>
                      {!isActive && <ArrowRight className="w-3 h-3" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actionable Next Steps (Direct requirement) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#00FF87]">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Actionable Next Steps</span>
            </div>
            <p className="text-xs text-zinc-400">
              Prescriptive interventions tailored to your lowest dimension ({cumulative.lowestDimension?.name || 'community health'}) and cross-platform setup:
            </p>

            <div className="space-y-2.5 pt-1">
              {cumulative.actionableNextSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs sm:text-sm text-zinc-200"
                >
                  <span className="font-mono font-extrabold text-[#00FF87] shrink-0 mt-0.5">
                    0{idx + 1}.
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Exact Disclaimer */}
      <div className="pt-4 border-t border-zinc-800/80">
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 text-xs text-zinc-400 leading-relaxed">
          <Info className="w-4 h-4 shrink-0 text-zinc-400 mt-0.5" aria-hidden="true" />
          <p>
            <strong className="text-zinc-300">Disclaimer:</strong> {AUDIT_DISCLAIMER}
          </p>
        </div>
      </div>
    </section>
  );
};
