import { MultiPlatformAuditState } from '../types/audit';
import {
  BRAND_NAME,
  BRAND_LOGO,
  DIMENSIONS,
  calculateCumulativeAuditResult,
} from './auditLogic';

export async function generateAuditCardImage(state: MultiPlatformAuditState): Promise<string> {
  const cumulative = calculateCumulativeAuditResult(state);
  const communityName = state.communityName.trim() || 'My Community';

  const width = 1200;
  const height = 750;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  // 1. Background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0D1016');
  gradient.addColorStop(1, '#07090C');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Subtle grid / border lines
  ctx.strokeStyle = '#1E2530';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 32, width - 64, height - 64);

  // 2. Top Header: SOŪL & Logo 魂
  ctx.fillStyle = '#00FF87';
  ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(BRAND_LOGO, 64, 84);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(BRAND_NAME, 102, 82);

  ctx.fillStyle = '#64748B';
  ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('/ The 5-Dimension Community Audit Tool', 182, 81);

  // Date on top right
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 14px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(dateStr, width - 64, 82);
  ctx.textAlign = 'left';

  // 3. Subject: Community Name
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText('AUDIT SUBJECT / COMMUNITY', 64, 134);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 36px "Plus Jakarta Sans", sans-serif';
  const displayTitle = communityName.length > 36 ? communityName.slice(0, 33) + '...' : communityName;
  ctx.fillText(displayTitle, 64, 178);

  // Platforms audited badges
  ctx.fillStyle = '#A855F7';
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Audited on: ${state.selectedPlatforms.join(' · ')}`, 64, 206);

  // Divider
  ctx.strokeStyle = '#1E2530';
  ctx.beginPath();
  ctx.moveTo(64, 226);
  ctx.lineTo(width - 64, 226);
  ctx.stroke();

  // 4. Hero Score Box (Left side: 64 to 450)
  ctx.fillStyle = '#12161E';
  ctx.strokeStyle = '#222B38';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(64, 250, 360, 240, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.fillText('CUMULATIVE HEALTH SCORE', 88, 282);

  const scoreStr = cumulative.cumulativeScore !== null ? cumulative.cumulativeScore.toFixed(2) : '--';
  ctx.fillStyle = '#00FF87';
  ctx.font = '800 68px "JetBrains Mono", monospace';
  ctx.fillText(scoreStr, 88, 356);

  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('/ 5.00', 256, 350);

  const statusLabel = cumulative.interpretation?.label || 'Awaiting Scoring';
  ctx.fillStyle = cumulative.interpretation ? cumulative.interpretation.color : '#94A3B8';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Status: ${statusLabel}`, 88, 396);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '400 12px "Plus Jakarta Sans", sans-serif';
  const summaryLine = cumulative.interpretation ? cumulative.interpretation.summary : 'Complete all dimension ratings.';
  ctx.fillText(summaryLine.slice(0, 48) + '...', 88, 424);

  // Platforms mini scores inside left column
  let platY = 452;
  ctx.font = '600 12px "JetBrains Mono", monospace';
  cumulative.platformResults.forEach((pr) => {
    ctx.fillStyle = '#CBD5E1';
    const pScore = pr.score !== null ? `${pr.score.toFixed(2)}/5` : 'Pending';
    ctx.fillText(`${pr.platform}: ${pScore}`, 88, platY);
    platY += 20;
  });

  // 5. Dimension Breakdown (Right side: 456 to width - 64)
  ctx.fillStyle = '#12161E';
  ctx.strokeStyle = '#222B38';
  ctx.beginPath();
  ctx.roundRect(456, 250, width - 64 - 456, 240, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.fillText('CROSS-PLATFORM DIMENSION RATINGS', 480, 282);

  let dimY = 312;
  DIMENSIONS.forEach((dim) => {
    const val = cumulative.averageDimensionScores[dim.id];
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${dim.number}. ${dim.name}`, 480, dimY);

    const valStr = val !== null ? `${val.toFixed(1)}/5` : '—';
    ctx.fillStyle = val !== null && val >= 3.5 ? '#00FF87' : val !== null && val < 2.5 ? '#EF4444' : '#EAB308';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(valStr, width - 88, dimY);
    ctx.textAlign = 'left';

    // Progress track
    ctx.fillStyle = '#1A202C';
    ctx.fillRect(480, dimY + 8, width - 88 - 480, 6);

    if (val !== null) {
      const barW = ((val / 5) * (width - 88 - 480));
      ctx.fillStyle = val >= 3.5 ? '#00FF87' : val < 2.5 ? '#EF4444' : '#EAB308';
      ctx.fillRect(480, dimY + 8, barW, 6);
    }

    dimY += 34;
  });

  // 6. Actionable Next Steps (Bottom Banner)
  ctx.fillStyle = '#12161E';
  ctx.strokeStyle = '#222B38';
  ctx.beginPath();
  ctx.roundRect(64, 514, width - 128, 154, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#00FF87';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText('DIAGNOSTIC ACTIONABLE NEXT STEPS', 88, 542);

  let stepY = 572;
  const stepsToShow = cumulative.actionableNextSteps.slice(0, 3);
  stepsToShow.forEach((step, idx) => {
    ctx.fillStyle = '#00FF87';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText(`0${idx + 1}.`, 88, stepY);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(step.length > 95 ? step.slice(0, 92) + '...' : step, 120, stepY);
    stepY += 26;
  });

  // 7. Footer
  ctx.fillStyle = '#64748B';
  ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    `The 5-Dimension Community Audit Tool | By ${BRAND_NAME} (${BRAND_LOGO})`,
    64,
    704
  );

  ctx.textAlign = 'right';
  ctx.fillText('Diagnostic guide based on observations and signals', width - 64, 704);

  return canvas.toDataURL('image/png');
}

export async function downloadAuditCard(state: MultiPlatformAuditState): Promise<void> {
  const dataUrl = await generateAuditCardImage(state);
  const link = document.createElement('a');
  const safeName = (state.communityName || 'community')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
  link.download = `${safeName}-community-audit-card.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
