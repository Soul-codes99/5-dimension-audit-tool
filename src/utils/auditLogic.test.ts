import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DIMENSIONS,
  BRAND_NAME,
  BRAND_LOGO,
  calculatePlatformScore,
  calculateCumulativeAuditResult,
  getScoreInterpretation,
  generateMultiPlatformAuditReportText,
  getInitialMultiAuditState,
} from './auditLogic';
import { SAMPLE_MULTI_AUDIT_DATA } from './sampleData';

test('branding constants are SOŪL and 魂', () => {
  assert.equal(BRAND_NAME, 'SOŪL');
  assert.equal(BRAND_LOGO, '魂');
});

test('initial multi-audit state is unrated for fresh users', () => {
  const state = getInitialMultiAuditState();
  assert.equal(state.communityName, '');
  assert.deepEqual(state.selectedPlatforms, ['Discord']);
  assert.equal(state.activePlatform, 'Discord');

  const discordDim = state.platformAudits['Discord'];
  assert.ok(discordDim);
  assert.equal(discordDim.structure.score, null);
  assert.equal(discordDim.activity.score, null);
  assert.equal(discordDim.culture.score, null);
  assert.equal(discordDim.content.score, null);
  assert.equal(discordDim.governance.score, null);

  const cumulative = calculateCumulativeAuditResult(state);
  assert.equal(cumulative.cumulativeScore, null);
  assert.equal(cumulative.interpretation, null);
  assert.equal(cumulative.platformResults[0].score, null);
});

test('has exact 5 dimensions with correct 4 checklist items each', () => {
  assert.equal(DIMENSIONS.length, 5);
  const names = DIMENSIONS.map((d) => d.name);
  assert.deepEqual(names, ['STRUCTURE', 'ACTIVITY', 'CULTURE', 'CONTENT', 'GOVERNANCE']);

  for (const dim of DIMENSIONS) {
    assert.equal(dim.checklist.length, 4, `Dimension ${dim.name} should have 4 checklist items`);
  }
});

test('calculatePlatformScore correctly calculates arithmetic mean', () => {
  const sampleDiscord = SAMPLE_MULTI_AUDIT_DATA.platformAudits['Discord'];
  const result = calculatePlatformScore('Discord', sampleDiscord);
  // Discord: 4, 3, 4, 3, 4 => sum 18 / 5 = 3.60
  assert.equal(result.score, 3.6);
  assert.equal(result.scoredCount, 5);
  assert.equal(result.interpretation?.label, 'Strong');

  const sampleTelegram = SAMPLE_MULTI_AUDIT_DATA.platformAudits['Telegram'];
  const tgResult = calculatePlatformScore('Telegram', sampleTelegram);
  // Telegram: 3, 4, 3, 2, 3 => sum 15 / 5 = 3.00
  assert.equal(tgResult.score, 3.0);
  assert.equal(tgResult.scoredCount, 5);
  assert.equal(tgResult.interpretation?.label, 'Developing');
});

test('calculateCumulativeAuditResult calculates multi-platform cumulative score and identifies lowest dimension', () => {
  const cumulative = calculateCumulativeAuditResult(SAMPLE_MULTI_AUDIT_DATA);
  // (3.60 + 3.00) / 2 = 3.30
  assert.equal(cumulative.cumulativeScore, 3.3);
  assert.equal(cumulative.interpretation?.label, 'Developing');
  assert.equal(cumulative.platformResults.length, 2);

  // Content average: (3 + 2) / 2 = 2.50 (lowest)
  assert.equal(cumulative.lowestDimension?.id, 'content');
  assert.equal(cumulative.lowestDimension?.score, 2.5);

  // Next steps generated based on content
  assert.ok(
    cumulative.actionableNextSteps.some((step) =>
      step.toLowerCase().includes('knowledge base') || step.toLowerCase().includes('member-generated')
    )
  );
  // Cross-platform harmony step generated because 2 platforms
  assert.ok(
    cumulative.actionableNextSteps.some((step) =>
      step.includes('Discord and Telegram')
    )
  );
});

test('getScoreInterpretation returns accurate brackets according to specification', () => {
  // 1.00–1.99: Critical
  assert.equal(getScoreInterpretation(1.0).label, 'Critical');
  assert.equal(getScoreInterpretation(1.85).label, 'Critical');

  // 2.00–2.99: Needs Improvement
  assert.equal(getScoreInterpretation(2.0).label, 'Needs Improvement');
  assert.equal(getScoreInterpretation(2.99).label, 'Needs Improvement');

  // 3.00–3.49: Developing
  assert.equal(getScoreInterpretation(3.0).label, 'Developing');
  assert.equal(getScoreInterpretation(3.4).label, 'Developing');

  // 3.50–4.49: Strong
  assert.equal(getScoreInterpretation(3.5).label, 'Strong');
  assert.equal(getScoreInterpretation(4.2).label, 'Strong');

  // 4.50–5.00: Excellent
  assert.equal(getScoreInterpretation(4.5).label, 'Excellent');
  assert.equal(getScoreInterpretation(5.0).label, 'Excellent');
});

test('generateMultiPlatformAuditReportText includes branding, community subject, platforms, and next steps', () => {
  const report = generateMultiPlatformAuditReportText(SAMPLE_MULTI_AUDIT_DATA);
  assert.ok(report.includes('By SOŪL (魂)'));
  assert.ok(report.includes('Belonging Builders Guild'));
  assert.ok(report.includes('Discord, Telegram'));
  assert.ok(report.includes('[Platform: Discord]'));
  assert.ok(report.includes('[Platform: Telegram]'));
  assert.ok(report.includes('ACTIONABLE NEXT STEPS:'));
});
