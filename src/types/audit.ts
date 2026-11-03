export type DimensionId = 'structure' | 'activity' | 'culture' | 'content' | 'governance';

export const DEFAULT_PLATFORM_OPTIONS = ['Discord', 'Telegram', 'X', 'Other'] as const;
export type DefaultPlatform = typeof DEFAULT_PLATFORM_OPTIONS[number];

export interface DimensionData {
  id: DimensionId;
  number: number;
  name: string;
  description: string;
  checklist: string[];
}

export interface DimensionState {
  score: number | null; // 1 to 5, or null if unassessed
  checklist: Record<string, boolean>;
  notes: string;
}

export type PlatformDimensionsState = Record<DimensionId, DimensionState>;

export interface MultiPlatformAuditState {
  communityName: string;
  auditorName: string;
  selectedPlatforms: string[]; // e.g. ['Discord', 'Telegram']
  activePlatform: string; // the currently displayed platform tab
  customPlatformName: string; // for 'Other' entry in dialog
  platformAudits: Record<string, PlatformDimensionsState>;
}

export interface ScoreGuideItem {
  score: number;
  label: string;
  description: string;
}

export interface ScoreInterpretation {
  label: 'Critical' | 'Needs Improvement' | 'Developing' | 'Strong' | 'Excellent';
  color: string;
  badgeBg: string;
  borderColor: string;
  summary: string;
}

export interface PlatformScoreResult {
  platform: string;
  score: number | null;
  scoredCount: number;
  interpretation: ScoreInterpretation | null;
  dimensionScores: Record<DimensionId, number | null>;
}

export interface CumulativeAuditResult {
  cumulativeScore: number | null;
  interpretation: ScoreInterpretation | null;
  platformResults: PlatformScoreResult[];
  averageDimensionScores: Record<DimensionId, number | null>;
  lowestDimension: { id: DimensionId; name: string; score: number } | null;
  actionableNextSteps: string[];
}
