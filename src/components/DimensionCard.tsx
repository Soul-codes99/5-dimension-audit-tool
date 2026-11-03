import React from 'react';
import { DimensionData, DimensionState } from '../types/audit';
import { SCORING_GUIDE } from '../utils/auditLogic';
import {
  Layers,
  Activity as ActivityIcon,
  HeartHandshake,
  FileText,
  ShieldCheck,
  Check,
  Info,
} from 'lucide-react';

interface DimensionCardProps {
  dimension: DimensionData;
  state: DimensionState;
  onScoreChange: (score: number) => void;
  onChecklistToggle: (item: string) => void;
  onNotesChange: (notes: string) => void;
}

const getDimensionIcon = (id: string) => {
  switch (id) {
    case 'structure':
      return <Layers className="w-5 h-5 text-[#00FF87]" aria-hidden="true" />;
    case 'activity':
      return <ActivityIcon className="w-5 h-5 text-[#00FF87]" aria-hidden="true" />;
    case 'culture':
      return <HeartHandshake className="w-5 h-5 text-purple-400" aria-hidden="true" />;
    case 'content':
      return <FileText className="w-5 h-5 text-[#00FF87]" aria-hidden="true" />;
    case 'governance':
      return <ShieldCheck className="w-5 h-5 text-purple-400" aria-hidden="true" />;
    default:
      return <Layers className="w-5 h-5 text-[#00FF87]" aria-hidden="true" />;
  }
};

export const DimensionCard: React.FC<DimensionCardProps> = ({
  dimension,
  state,
  onScoreChange,
  onChecklistToggle,
  onNotesChange,
}) => {
  const currentGuide = state.score !== null ? SCORING_GUIDE.find((g) => g.score === state.score) : null;
  const checkedCount = dimension.checklist.filter((item) => !!state.checklist[item]).length;

  return (
    <section
      aria-labelledby={`heading-dim-${dimension.id}`}
      className="bg-[#12161D] border border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-sm space-y-6"
    >
      {/* Header with Title, Icon & Description */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-[#00FF87] shrink-0 mt-0.5">
            {getDimensionIcon(dimension.id)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                Dimension {dimension.number} of 5
              </span>
            </div>
            <h3
              id={`heading-dim-${dimension.id}`}
              className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5"
            >
              {dimension.name}
            </h3>
            <p className="text-sm text-zinc-300 mt-1 max-w-2xl leading-relaxed">
              {dimension.description}
            </p>
          </div>
        </div>

        {/* Current Score Indicator */}
        <div className="shrink-0 self-start sm:self-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="text-xs uppercase tracking-wider text-zinc-400">Score</span>
            {state.score !== null && currentGuide ? (
              <>
                <span className="text-base font-extrabold text-[#00FF87] font-mono">{state.score}/5</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-850 text-zinc-300 font-medium">
                  {currentGuide.label}
                </span>
              </>
            ) : (
              <span className="text-xs text-zinc-500 italic">Unassessed</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Checklist of Audit Signals */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <span>Audit Signals</span>
              <span className="text-zinc-500 font-mono font-normal">
                ({checkedCount}/{dimension.checklist.length} verified)
              </span>
            </h4>
            <span className="text-[11px] text-zinc-500">Observable checks</span>
          </div>

          <div className="space-y-2 bg-zinc-950/70 p-3 rounded-xl border border-zinc-850">
            {dimension.checklist.map((signal) => {
              const isChecked = !!state.checklist[signal];
              return (
                <label
                  key={signal}
                  className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition select-none ${
                    isChecked
                      ? 'bg-zinc-900 border border-zinc-750 text-white'
                      : 'hover:bg-zinc-900/40 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onChecklistToggle(signal)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center transition shrink-0 ${
                      isChecked
                        ? 'bg-[#00FF87] text-zinc-950 font-black'
                        : 'border border-zinc-650 bg-zinc-900 hover:border-zinc-500'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs sm:text-sm leading-snug">{signal}</span>
                </label>
              );
            })}
          </div>

          <p className="text-[11px] text-zinc-400 flex items-start gap-1 leading-normal">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-zinc-400" aria-hidden="true" />
            <span>
              Checklist selections provide qualitative evidence; assign your dimension score manually below.
            </span>
          </p>
        </div>

        {/* Right Column: Scoring Control & Notes */}
        <div className="lg:col-span-7 space-y-5">
          {/* Scoring Control 1 to 5 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Dimension Score (1 to 5)
              </label>
              <span className="text-xs text-zinc-400">
                {currentGuide ? (
                  <>Selected: <span className="font-semibold text-[#00FF87]">{currentGuide.label}</span></>
                ) : (
                  <span className="text-zinc-500 italic">Select 1 to 5</span>
                )}
              </span>
            </div>

            <div
              role="radiogroup"
              aria-label={`${dimension.name} score from 1 to 5`}
              className="grid grid-cols-5 gap-1.5 sm:gap-2"
            >
              {SCORING_GUIDE.map((guide) => {
                const isSelected = state.score === guide.score;
                return (
                  <button
                    key={guide.score}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => onScoreChange(guide.score)}
                    className={`flex flex-col items-center justify-center min-h-[46px] py-2 px-1 rounded-xl transition cursor-pointer border ${
                      isSelected
                        ? 'bg-[#00FF87]/20 border-[#00FF87] text-[#00FF87]'
                        : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                    title={`${guide.score} - ${guide.label}: ${guide.description}`}
                  >
                    <span className="text-base sm:text-lg font-black font-mono leading-none">{guide.score}</span>
                    <span className="text-[9px] sm:text-xs font-medium text-center leading-tight mt-1">
                      {guide.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Current scoring guide explanation */}
            <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-850 text-xs text-zinc-300 min-h-[38px] flex items-center">
              {currentGuide ? (
                <div>
                  <span className="font-bold text-[#00FF87] mr-1.5">
                    {state.score} - {currentGuide.label}:
                  </span>
                  <span>{currentGuide.description}</span>
                </div>
              ) : (
                <span className="text-zinc-500 italic">
                  Select a score from 1 (Critical) to 5 (Excellent) based on your evaluation.
                </span>
              )}
            </div>
          </div>

          {/* Observations & Recommendations Text Area */}
          <div className="space-y-1.5">
            <label
              htmlFor={`notes-${dimension.id}`}
              className="text-xs font-bold uppercase tracking-wider text-zinc-300 block"
            >
              Observations, Evidence, Problems & Recommendations
            </label>
            <textarea
              id={`notes-${dimension.id}`}
              value={state.notes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={3}
              placeholder={`Document qualitative findings for ${dimension.name.toLowerCase()}... e.g. Specific channels or rituals that succeed, observed bottlenecks, member feedback, or prioritized changes.`}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-[#00FF87] text-white text-xs sm:text-sm placeholder-zinc-600 outline-none transition leading-relaxed resize-y"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
