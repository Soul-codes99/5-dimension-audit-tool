import React, { useState } from 'react';
import { MultiPlatformAuditState } from '../types/audit';
import {
  DIMENSIONS,
  calculateCumulativeAuditResult,
  getScoreLabel,
  generateMultiPlatformAuditReportText,
} from '../utils/auditLogic';
import {
  Copy,
  Check,
  RotateCcw,
  Download,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';

interface AuditReportSectionProps {
  state: MultiPlatformAuditState;
  onDownloadCard: () => Promise<void>;
  onRequestReset: () => void;
}

export const AuditReportSection: React.FC<AuditReportSectionProps> = ({
  state,
  onDownloadCard,
  onRequestReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [showFullRawPreview, setShowFullRawPreview] = useState(false);

  const cumulative = calculateCumulativeAuditResult(state);
  const reportText = generateMultiPlatformAuditReportText(state);
  const communitySubject = state.communityName.trim() || 'My Community';

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(reportText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = reportText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handleDownloadText = () => {
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (state.communityName || 'community')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    link.href = url;
    link.download = `${safeName}-community-audit-report-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCardDownloadClick = async () => {
    try {
      setIsGeneratingCard(true);
      await onDownloadCard();
    } catch (err) {
      console.error('Failed to generate audit card image', err);
    } finally {
      setIsGeneratingCard(false);
    }
  };

  return (
    <section
      aria-labelledby="audit-summary-heading"
      className="bg-[#12161D] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
    >
      {/* Header & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-purple-400 mb-1">
            <FileCheck2 className="w-4 h-4" aria-hidden="true" />
            <span>Audit Summary & Card Export</span>
          </div>
          <h2 id="audit-summary-heading" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Diagnostic Report & Card
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Download your branded SOŪL Audit Card (featuring <strong className="text-white">{communitySubject}</strong> as subject) or copy the full report.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* PRIMARY: Download Audit Card (.png) */}
          <button
            type="button"
            onClick={handleCardDownloadClick}
            disabled={isGeneratingCard}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#00FF87] hover:bg-[#22ff95] text-zinc-950 transition-all cursor-pointer shadow-lg disabled:opacity-50"
            title="Download graphical 1200x750 audit card for sharing"
          >
            {isGeneratingCard ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Generating Card...</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4" aria-hidden="true" />
                <span>Download Audit Card (.png)</span>
              </>
            )}
          </button>

          {/* Copy Report */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-750 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#00FF87] stroke-[3]" aria-hidden="true" />
                <span className="text-[#00FF87]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" aria-hidden="true" />
                <span>Copy Report</span>
              </>
            )}
          </button>

          {/* Export .txt */}
          <button
            type="button"
            onClick={handleDownloadText}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-950 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800 transition cursor-pointer"
            title="Download report as plain text document"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Export .txt</span>
          </button>

          {/* Reset Audit */}
          <button
            type="button"
            onClick={onRequestReset}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-950 hover:bg-zinc-850 text-zinc-400 hover:text-red-400 border border-zinc-800 transition cursor-pointer"
            title="Reset worksheet back to default state"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Styled Interactive Summary Card */}
      <div className="bg-zinc-950 rounded-2xl border border-zinc-850 p-5 sm:p-6 space-y-6">
        {/* Top Summary Metadata Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 text-xs">
          <div>
            <span className="text-zinc-500 uppercase tracking-wider block text-[10px] font-mono">Community Subject</span>
            <span className="font-bold text-white text-sm truncate block" title={communitySubject}>
              {communitySubject}
            </span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase tracking-wider block text-[10px] font-mono">Audited Platforms</span>
            <span className="font-semibold text-zinc-200 text-sm truncate block">
              {state.selectedPlatforms.join(', ')}
            </span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase tracking-wider block text-[10px] font-mono">Cumulative Score</span>
            <span className="font-extrabold text-[#00FF87] text-sm font-mono">
              {cumulative.cumulativeScore !== null ? `${cumulative.cumulativeScore.toFixed(2)} / 5` : 'Awaiting scores'}
              {cumulative.interpretation && ` (${cumulative.interpretation.label})`}
            </span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase tracking-wider block text-[10px] font-mono">Card Export Ready</span>
            <span className="font-semibold text-[#00FF87] text-sm font-mono">
              ✓ Ready
            </span>
          </div>
        </div>

        {/* Platform-by-Platform Findings */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Platform Breakdown & Observational Evidence
          </h3>

          <div className="space-y-6">
            {cumulative.platformResults.map((pr) => {
              const dimState = state.platformAudits[pr.platform];
              if (!dimState) return null;

              return (
                <div
                  key={pr.platform}
                  className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-white">
                        Platform: {pr.platform}
                      </span>
                      {pr.score !== null ? (
                        <span className="text-xs font-mono font-bold text-[#00FF87] px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                          {pr.score.toFixed(2)}/5 ({pr.interpretation?.label})
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-500 italic">Unassessed</span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">
                      {pr.scoredCount}/5 Dimensions Scored
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {DIMENSIONS.map((dim) => {
                      const d = dimState[dim.id];
                      const isAssessed = d.score !== null;
                      const label = getScoreLabel(d.score);
                      const checkedList = dim.checklist.filter((item) => !!d.checklist[item]);

                      return (
                        <div
                          key={dim.id}
                          className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-850 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">
                              {dim.number}. {dim.name}
                            </span>
                            <span
                              className={`font-mono text-[11px] ${
                                isAssessed ? 'text-[#00FF87] font-semibold' : 'text-zinc-600 italic'
                              }`}
                            >
                              {isAssessed ? `${d.score}/5 (${label})` : 'Unassessed'}
                            </span>
                          </div>

                          <div className="text-zinc-400 text-[11px]">
                            Signals verified: {checkedList.length}/{dim.checklist.length}
                          </div>

                          {d.notes && d.notes.trim() && (
                            <p className="text-zinc-300 bg-zinc-900/80 p-2 rounded border border-zinc-800/60 leading-relaxed text-[11px] italic">
                              &ldquo;{d.notes.trim()}&rdquo;
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Collapsible raw text viewer */}
        <div className="pt-2 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={() => setShowFullRawPreview(!showFullRawPreview)}
            className="flex items-center justify-between w-full p-2 text-xs text-zinc-400 hover:text-zinc-200 transition cursor-pointer font-mono"
          >
            <span>Preview Formatted Plaintext for Clipboard</span>
            {showFullRawPreview ? (
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          {showFullRawPreview && (
            <div className="mt-3 relative">
              <pre className="p-4 rounded-xl bg-black border border-zinc-800 text-[11px] text-zinc-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-80 select-all">
                {reportText}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
