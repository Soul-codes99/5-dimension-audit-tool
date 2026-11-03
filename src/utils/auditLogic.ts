import {
  DimensionData,
  DimensionId,
  DimensionState,
  MultiPlatformAuditState,
  PlatformDimensionsState,
  PlatformScoreResult,
  CumulativeAuditResult,
  ScoreGuideItem,
  ScoreInterpretation,
} from '../types/audit';

export const BRAND_NAME = 'SOŪL';
export const BRAND_LOGO = '魂';

export const DIMENSIONS: DimensionData[] = [
  {
    id: 'structure',
    number: 1,
    name: 'STRUCTURE',
    description: 'Examine how the community is organised and how easily members can navigate it.',
    checklist: [
      'Channel architecture is logical.',
      'Roles and permissions are clear.',
      'Onboarding is easy to follow.',
      'Important resources are accessible.',
    ],
  },
  {
    id: 'activity',
    number: 2,
    name: 'ACTIVITY',
    description: 'Examine how frequently members participate and the quality of their interactions.',
    checklist: [
      'Members participate regularly.',
      'Conversations have meaningful depth.',
      'Activity isn\'t dependent only on administrators.',
      'Members interact with one another.',
    ],
  },
  {
    id: 'culture',
    number: 3,
    name: 'CULTURE',
    description: 'Examine the shared identity, behaviours, norms, and sense of belonging within the community.',
    checklist: [
      'Community identity is recognisable.',
      'Members understand shared norms.',
      'New members are welcomed.',
      'Members demonstrate mutual support.',
    ],
  },
  {
    id: 'content',
    number: 4,
    name: 'CONTENT',
    description: 'Examine the quality, relevance, clarity, and distribution of information shared within the community.',
    checklist: [
      'Announcements are clear.',
      'Content is useful and relevant.',
      'Member-generated content is encouraged.',
      'Information is easy to find.',
    ],
  },
  {
    id: 'governance',
    number: 5,
    name: 'GOVERNANCE',
    description: 'Examine how rules, responsibilities, decisions, and conflicts are managed.',
    checklist: [
      'Rules are clear and accessible.',
      'Moderator responsibilities are defined.',
      'Decisions are communicated.',
      'Conflict escalation is documented.',
    ],
  },
];

export const SCORING_GUIDE: ScoreGuideItem[] = [
  {
    score: 1,
    label: 'Critical',
    description: 'Major problems, little or no effective system.',
  },
  {
    score: 2,
    label: 'Weak',
    description: 'Significant gaps that require attention.',
  },
  {
    score: 3,
    label: 'Developing',
    description: 'Some good practices, but inconsistent execution.',
  },
  {
    score: 4,
    label: 'Strong',
    description: 'Effective systems with minor improvement opportunities.',
  },
  {
    score: 5,
    label: 'Excellent',
    description: 'Consistent, well-managed, evidence-backed performance.',
  },
];

export const AUDIT_DISCLAIMER =
  'This score is a self-assessment based on your observations and evidence. It is a diagnostic guide, not an independently validated industry benchmark.';

export function createEmptyDimensionsState(): PlatformDimensionsState {
  return {
    structure: { score: null, checklist: {}, notes: '' },
    activity: { score: null, checklist: {}, notes: '' },
    culture: { score: null, checklist: {}, notes: '' },
    content: { score: null, checklist: {}, notes: '' },
    governance: { score: null, checklist: {}, notes: '' },
  };
}

export function getInitialMultiAuditState(): MultiPlatformAuditState {
  const initialPlatform = 'Discord';
  return {
    communityName: '',
    auditorName: '',
    selectedPlatforms: [initialPlatform],
    activePlatform: initialPlatform,
    customPlatformName: '',
    platformAudits: {
      [initialPlatform]: createEmptyDimensionsState(),
    },
  };
}

export function getScoreInterpretation(score: number): ScoreInterpretation {
  if (score < 2.0) {
    return {
      label: 'Critical',
      color: '#EF4444',
      badgeBg: 'bg-red-500/15 text-red-300 border-red-500/30',
      borderColor: 'border-red-500',
      summary: 'Urgent systemic friction across audited dimensions. Foundational operational redesign required.',
    };
  }
  if (score < 3.0) {
    return {
      label: 'Needs Improvement',
      color: '#F97316',
      badgeBg: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
      borderColor: 'border-orange-500',
      summary: 'Noticeable operational gaps and participation friction limiting retention and organic health.',
    };
  }
  if (score < 3.5) {
    return {
      label: 'Developing',
      color: '#EAB308',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      borderColor: 'border-amber-500',
      summary: 'Promising practices established, but execution relies heavily on ad-hoc effort rather than systems.',
    };
  }
  if (score < 4.5) {
    return {
      label: 'Strong',
      color: '#00FF87',
      badgeBg: 'bg-[#00FF87]/15 text-[#00FF87] border-[#00FF87]/30',
      borderColor: 'border-[#00FF87]',
      summary: 'Healthy, self-reinforcing dynamics with clear structure, engaged members, and steady moderation.',
    };
  }
  return {
    label: 'Excellent',
    color: '#00FF87',
    badgeBg: 'bg-[#00FF87]/20 text-[#00FF87] border-[#00FF87]/40',
    borderColor: 'border-[#00FF87]',
    summary: 'Exemplary benchmark community with autonomous peer interactions, clear governance, and deep belonging.',
  };
}

export function getScoreLabel(score: number | null): string {
  if (score === null || score === undefined) return 'Unassessed';
  const item = SCORING_GUIDE.find((g) => g.score === score);
  return item ? item.label : `Score ${score}`;
}

export function calculatePlatformScore(
  platformName: string,
  dimensions: PlatformDimensionsState | undefined
): PlatformScoreResult {
  const dimState = dimensions || createEmptyDimensionsState();
  const dimensionScores: Record<DimensionId, number | null> = {
    structure: dimState.structure.score,
    activity: dimState.activity.score,
    culture: dimState.culture.score,
    content: dimState.content.score,
    governance: dimState.governance.score,
  };

  const validScores = Object.values(dimensionScores).filter((s): s is number => typeof s === 'number');
  const scoredCount = validScores.length;

  if (scoredCount === 0) {
    return {
      platform: platformName,
      score: null,
      scoredCount: 0,
      interpretation: null,
      dimensionScores,
    };
  }

  const sum = validScores.reduce((acc, curr) => acc + curr, 0);
  const score = Number((sum / scoredCount).toFixed(2));

  return {
    platform: platformName,
    score,
    scoredCount,
    interpretation: getScoreInterpretation(score),
    dimensionScores,
  };
}

export function calculateCumulativeAuditResult(state: MultiPlatformAuditState): CumulativeAuditResult {
  const platformResults = state.selectedPlatforms.map((platform) =>
    calculatePlatformScore(platform, state.platformAudits[platform])
  );

  const scoredPlatforms = platformResults.filter((p) => p.score !== null);

  // Compute average per dimension across all platforms
  const dimTotals: Record<DimensionId, { sum: number; count: number }> = {
    structure: { sum: 0, count: 0 },
    activity: { sum: 0, count: 0 },
    culture: { sum: 0, count: 0 },
    content: { sum: 0, count: 0 },
    governance: { sum: 0, count: 0 },
  };

  for (const pr of platformResults) {
    for (const dim of DIMENSIONS) {
      const val = pr.dimensionScores[dim.id];
      if (typeof val === 'number') {
        dimTotals[dim.id].sum += val;
        dimTotals[dim.id].count += 1;
      }
    }
  }

  const averageDimensionScores: Record<DimensionId, number | null> = {
    structure: dimTotals.structure.count > 0 ? Number((dimTotals.structure.sum / dimTotals.structure.count).toFixed(2)) : null,
    activity: dimTotals.activity.count > 0 ? Number((dimTotals.activity.sum / dimTotals.activity.count).toFixed(2)) : null,
    culture: dimTotals.culture.count > 0 ? Number((dimTotals.culture.sum / dimTotals.culture.count).toFixed(2)) : null,
    content: dimTotals.content.count > 0 ? Number((dimTotals.content.sum / dimTotals.content.count).toFixed(2)) : null,
    governance: dimTotals.governance.count > 0 ? Number((dimTotals.governance.sum / dimTotals.governance.count).toFixed(2)) : null,
  };

  // Cumulative score is the arithmetic average of platform scores
  let cumulativeScore: number | null = null;
  if (scoredPlatforms.length > 0) {
    const sum = scoredPlatforms.reduce((acc, curr) => acc + (curr.score || 0), 0);
    cumulativeScore = Number((sum / scoredPlatforms.length).toFixed(2));
  }

  // Find lowest dimension
  let lowestDimension: { id: DimensionId; name: string; score: number } | null = null;
  for (const dim of DIMENSIONS) {
    const avg = averageDimensionScores[dim.id];
    if (typeof avg === 'number') {
      if (!lowestDimension || avg < lowestDimension.score) {
        lowestDimension = { id: dim.id, name: dim.name, score: avg };
      }
    }
  }

  // Generate actionable next steps
  const actionableNextSteps: string[] = [];

  if (lowestDimension) {
    switch (lowestDimension.id) {
      case 'structure':
        actionableNextSteps.push(
          'Re-architect channel tree into <= 5 focused categories with an unmissable #start-here onboarding directory.'
        );
        actionableNextSteps.push(
          'Audit role hierarchies so newcomers can immediately identify moderators, stewards, and subject leads.'
        );
        break;
      case 'activity':
        actionableNextSteps.push(
          'Deploy recurring member-led rituals (AMAs, weekly showcases) to reduce admin dependency.'
        );
        actionableNextSteps.push(
          'Create peer-to-peer discussion hooks that prompt members to exchange advice directly with one another.'
        );
        break;
      case 'culture':
        actionableNextSteps.push(
          'Formalize newcomer onboarding buddies to ensure every new member is welcomed by an established peer.'
        );
        actionableNextSteps.push(
          'Document shared community lexicon and norms in a public manifesto to cultivate belonging.'
        );
        break;
      case 'content':
        actionableNextSteps.push(
          'Institute a central searchable knowledge base or Notion hub to stop recurring questions.'
        );
        actionableNextSteps.push(
          'Incentivize member-generated tutorials, case studies, and templates with community recognition.'
        );
        break;
      case 'governance':
        actionableNextSteps.push(
          'Publish a 3-tier conflict escalation ladder so moderation actions are objective and predictable.'
        );
        actionableNextSteps.push(
          'Hold regular public or town-hall governance recaps explaining major platform changes.'
        );
        break;
    }
  }

  // Add cross-platform harmony step if multiple platforms audited
  if (state.selectedPlatforms.length > 1) {
    actionableNextSteps.push(
      `Align cross-platform governance between ${state.selectedPlatforms.join(' and ')} to avoid fragmented announcements.`
    );
  } else {
    actionableNextSteps.push(
      'Schedule a 30-day reassessment to measure signal improvements against this baseline.'
    );
  }

  return {
    cumulativeScore,
    interpretation: cumulativeScore !== null ? getScoreInterpretation(cumulativeScore) : null,
    platformResults,
    averageDimensionScores,
    lowestDimension,
    actionableNextSteps,
  };
}

export function generateMultiPlatformAuditReportText(state: MultiPlatformAuditState): string {
  const cumulative = calculateCumulativeAuditResult(state);
  const communityTitle = state.communityName.trim() || 'Community Audit';
  const auditorTitle = state.auditorName.trim() ? `\nAuditor: ${state.auditorName.trim()}` : '';

  let report = `========================================================
THE 5-DIMENSION COMMUNITY AUDIT REPORT
By ${BRAND_NAME} (${BRAND_LOGO})
========================================================
Community: ${communityTitle}${auditorTitle}
Audited Platforms: ${state.selectedPlatforms.join(', ')}
Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}

CUMULATIVE COMMUNITY HEALTH SCORE: ${
    cumulative.cumulativeScore !== null
      ? `${cumulative.cumulativeScore.toFixed(2)}/5 (${cumulative.interpretation?.label || ''})`
      : 'Awaiting scoring'
  }
${cumulative.interpretation ? `Summary: ${cumulative.interpretation.summary}` : ''}

--------------------------------------------------------
PLATFORM BREAKDOWN:
--------------------------------------------------------`;

  for (const pr of cumulative.platformResults) {
    const scoreStr = pr.score !== null ? `${pr.score.toFixed(2)}/5 (${pr.interpretation?.label})` : 'Unassessed';
    report += `\n\n[Platform: ${pr.platform}] - Score: ${scoreStr} (${pr.scoredCount}/5 dimensions scored)`;

    const dimState = state.platformAudits[pr.platform] || createEmptyDimensionsState();
    for (const dim of DIMENSIONS) {
      const d = dimState[dim.id];
      const s = d.score !== null ? `${d.score}/5 (${getScoreLabel(d.score)})` : 'Unassessed';
      const checked = dim.checklist.filter((item) => !!d.checklist[item]);
      report += `\n  - ${dim.name}: ${s}`;
      report += ` (Signals: ${checked.length}/${dim.checklist.length} verified)`;
      if (d.notes && d.notes.trim()) {
        report += `\n    Notes: ${d.notes.trim().replace(/\n/g, ' ')}`;
      }
    }
  }

  report += `\n\n--------------------------------------------------------
ACTIONABLE NEXT STEPS:
--------------------------------------------------------`;
  cumulative.actionableNextSteps.forEach((step, idx) => {
    report += `\n${idx + 1}. ${step}`;
  });

  report += `\n\n--------------------------------------------------------
DISCLAIMER:
${AUDIT_DISCLAIMER}
========================================================`;

  return report;
}
