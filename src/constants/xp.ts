import type { Tier } from '../types/store';

interface XPLevel {
  tier: Tier;
  xp: number | null;
  label: string;
}

/** Bronze and Silver are fixed thresholds; Gold is not a number — it's
 *  awarded to the quarter's top performers, so it never comes from xp alone. */
export const XP_LEVELS: XPLevel[] = [
  { tier: 'bronze', xp: 100, label: 'Bronze' },
  { tier: 'silver', xp: 500, label: 'Silver' },
  { tier: 'gold', xp: null, label: 'Gold' },
];

export const XP_NUMERIC_LEVELS = XP_LEVELS.filter(
  (l): l is XPLevel & { xp: number } => typeof l.xp === 'number',
);

export interface XPProgress {
  xp: number;
  next: (XPLevel & { xp: number }) | null;
  pct: number;
  currentTier: Tier;
}

export function xpProgress(xp: number): XPProgress {
  const cur = xp || 0;
  const next = XP_NUMERIC_LEVELS.find((l) => cur < l.xp) ?? null;
  const idx = next ? XP_NUMERIC_LEVELS.indexOf(next) : XP_NUMERIC_LEVELS.length;
  const prevXp = idx > 0 ? XP_NUMERIC_LEVELS[idx - 1].xp : 0;

  const reached = XP_NUMERIC_LEVELS.filter((l) => cur >= l.xp);
  const currentTier: Tier = reached.length ? reached[reached.length - 1].tier : 'standard';

  if (!next) return { xp: cur, next: null, pct: 100, currentTier };

  const span = next.xp - prevXp;
  const pct = span > 0 ? Math.min(100, Math.max(0, ((cur - prevXp) / span) * 100)) : 0;
  return { xp: cur, next, pct, currentTier };
}
