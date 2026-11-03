/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  DimensionId,
  MultiPlatformAuditState,
} from './types/audit';
import {
  DIMENSIONS,
  getInitialMultiAuditState,
  createEmptyDimensionsState,
} from './utils/auditLogic';
import { SAMPLE_MULTI_AUDIT_DATA } from './utils/sampleData';
import { downloadAuditCard } from './utils/cardGenerator';
import { Header } from './components/Header';
import { PlatformSwitcher } from './components/PlatformSwitcher';
import { PlatformSelectionDialog } from './components/PlatformSelectionDialog';
import { DimensionCard } from './components/DimensionCard';
import { ScoreOverview } from './components/ScoreOverview';
import { AuditReportSection } from './components/AuditReportSection';
import { PersonalCTA } from './components/PersonalCTA';
import { ConfirmModal } from './components/ConfirmModal';

const STORAGE_KEY = 'soul_community_audit_state_v3';

export default function App() {
  const [auditState, setAuditState] = useState<MultiPlatformAuditState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const initial = getInitialMultiAuditState();
        return {
          ...initial,
          ...parsed,
          platformAudits: {
            ...initial.platformAudits,
            ...(parsed.platformAudits || {}),
          },
        };
      }
    } catch (e) {
      console.warn('Failed to load saved audit state from localStorage:', e);
    }
    return getInitialMultiAuditState();
  });

  const [isPlatformDialogOpen, setIsPlatformDialogOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auditState));
    } catch (e) {
      console.warn('Failed to save audit state to localStorage:', e);
    }
  }, [auditState]);

  const handleCommunityNameChange = (communityName: string) => {
    setAuditState((prev) => ({
      ...prev,
      communityName,
    }));
  };

  const handleAuditorNameChange = (auditorName: string) => {
    setAuditState((prev) => ({
      ...prev,
      auditorName,
    }));
  };

  const handleSavePlatforms = (platforms: string[], customName: string) => {
    setAuditState((prev) => {
      const updatedAudits = { ...prev.platformAudits };
      platforms.forEach((p) => {
        if (!updatedAudits[p]) {
          updatedAudits[p] = createEmptyDimensionsState();
        }
      });

      const nextActive = platforms.includes(prev.activePlatform)
        ? prev.activePlatform
        : platforms[0];

      return {
        ...prev,
        selectedPlatforms: platforms,
        activePlatform: nextActive,
        customPlatformName: customName,
        platformAudits: updatedAudits,
      };
    });
  };

  const handleSelectPlatform = (platform: string) => {
    setAuditState((prev) => ({
      ...prev,
      activePlatform: platform,
    }));
  };

  // Dimensions editing for activePlatform
  const activeDimensions =
    auditState.platformAudits[auditState.activePlatform] || createEmptyDimensionsState();

  const handleScoreChange = (dimId: DimensionId, score: number) => {
    setAuditState((prev) => {
      const currentPlatformAudits = prev.platformAudits[prev.activePlatform] || createEmptyDimensionsState();
      return {
        ...prev,
        platformAudits: {
          ...prev.platformAudits,
          [prev.activePlatform]: {
            ...currentPlatformAudits,
            [dimId]: {
              ...currentPlatformAudits[dimId],
              score,
            },
          },
        },
      };
    });
  };

  const handleChecklistToggle = (dimId: DimensionId, item: string) => {
    setAuditState((prev) => {
      const currentPlatformAudits = prev.platformAudits[prev.activePlatform] || createEmptyDimensionsState();
      const currentList = currentPlatformAudits[dimId].checklist || {};
      const newStatus = !currentList[item];

      return {
        ...prev,
        platformAudits: {
          ...prev.platformAudits,
          [prev.activePlatform]: {
            ...currentPlatformAudits,
            [dimId]: {
              ...currentPlatformAudits[dimId],
              checklist: {
                ...currentList,
                [item]: newStatus,
              },
            },
          },
        },
      };
    });
  };

  const handleNotesChange = (dimId: DimensionId, notes: string) => {
    setAuditState((prev) => {
      const currentPlatformAudits = prev.platformAudits[prev.activePlatform] || createEmptyDimensionsState();
      return {
        ...prev,
        platformAudits: {
          ...prev.platformAudits,
          [prev.activePlatform]: {
            ...currentPlatformAudits,
            [dimId]: {
              ...currentPlatformAudits[dimId],
              notes,
            },
          },
        },
      };
    });
  };

  const handleLoadSample = () => {
    setAuditState({ ...SAMPLE_MULTI_AUDIT_DATA });
  };

  const handleConfirmReset = () => {
    const fresh = getInitialMultiAuditState();
    setAuditState(fresh);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    setIsResetModalOpen(false);
  };

  const handleDownloadCard = async () => {
    await downloadAuditCard(auditState);
  };

  // Check if anything has been populated
  const isPopulated = Object.values(auditState.platformAudits).some((platformState) =>
    Object.values(platformState).some((d) => d.score !== null)
  );

  return (
    <div className="min-h-screen bg-[#0C0E12] text-zinc-100 flex flex-col font-sans selection:bg-[#00FF87]/20 selection:text-[#00FF87]">
      {/* Header with SOŪL 魂 branding, Community Name Input, & Platform Summary */}
      <Header
        communityName={auditState.communityName}
        auditorName={auditState.auditorName}
        selectedPlatforms={auditState.selectedPlatforms}
        isPopulated={isPopulated}
        onCommunityNameChange={handleCommunityNameChange}
        onAuditorNameChange={handleAuditorNameChange}
        onOpenPlatformDialog={() => setIsPlatformDialogOpen(true)}
        onLoadSample={handleLoadSample}
        onRequestReset={() => setIsResetModalOpen(true)}
      />

      {/* Main Diagnostic Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">
        {/* Step 1: Side-by-Side Platform Switcher */}
        <section aria-labelledby="platform-switcher-heading">
          <PlatformSwitcher
            state={auditState}
            onSelectPlatform={handleSelectPlatform}
            onOpenDialog={() => setIsPlatformDialogOpen(true)}
          />
        </section>

        {/* Step 2: The Five Audit Dimensions for the Active Platform */}
        <section aria-labelledby="step-2-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                  Step 2: Dimension Scoring
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs font-bold text-[#00FF87]">
                  Active: {auditState.activePlatform}
                </span>
              </div>
              <h2 id="step-2-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                The Five Audit Dimensions
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                Observe the signals, assign your score (1–5), and record your qualitative findings for {auditState.activePlatform}.
              </p>
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              5 Dimensions · Qualitative & Quantitative
            </div>
          </div>

          <div className="space-y-6">
            {DIMENSIONS.map((dimension) => (
              <DimensionCard
                key={`${auditState.activePlatform}-${dimension.id}`}
                dimension={dimension}
                state={activeDimensions[dimension.id]}
                onScoreChange={(score) => handleScoreChange(dimension.id, score)}
                onChecklistToggle={(item) => handleChecklistToggle(dimension.id, item)}
                onNotesChange={(notes) => handleNotesChange(dimension.id, notes)}
              />
            ))}
          </div>
        </section>

        {/* Step 3: Diagnostic Scoring & Cumulative Health Score */}
        <section aria-labelledby="step-3-heading">
          <h2 id="step-3-heading" className="sr-only">Step 3: Diagnostic Scoring</h2>
          <ScoreOverview
            state={auditState}
            onSelectPlatform={handleSelectPlatform}
            onLoadSample={handleLoadSample}
          />
        </section>

        {/* Step 4: Audit Report & Downloadable Card */}
        <section aria-labelledby="step-4-heading">
          <h2 id="step-4-heading" className="sr-only">Step 4: Audit Report and Card Download</h2>
          <AuditReportSection
            state={auditState}
            onDownloadCard={handleDownloadCard}
            onRequestReset={() => setIsResetModalOpen(true)}
          />
        </section>
      </main>

      {/* Section 5: Personal CTA & Footer */}
      <PersonalCTA />

      {/* Platform Selection Dialog: "What platform(s) are you auditing?" */}
      <PlatformSelectionDialog
        isOpen={isPlatformDialogOpen}
        selectedPlatforms={auditState.selectedPlatforms}
        customPlatformName={auditState.customPlatformName}
        onClose={() => setIsPlatformDialogOpen(false)}
        onSave={handleSavePlatforms}
      />

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset Community Audit?"
        message="Are you sure you want to clear this audit? All entered scores, checklist observations, and qualitative recommendations across all platforms will be restored to their unassessed defaults."
        confirmLabel="Yes, Reset Worksheet"
        cancelLabel="Keep Working"
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
}
