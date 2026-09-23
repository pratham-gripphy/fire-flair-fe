import type { Tier } from '../types/store';

interface MetalDef {
  edge: [string, string, string, string, string];
  face: [string, string];
  hair: string;
}

/** Gradient stops for each coin/card tier - shared by every place the
 *  FireFlair coin, emblem or card border is drawn, so a tier always
 *  renders in the same metal. */
export const METAL: Record<Tier, MetalDef> = {
  standard: { edge: ['#F6E7B0', '#C9A227', '#5F4712', '#B99424', '#EFDB9A'], face: ['#2B2B31', '#0B0B0D'], hair: 'rgba(201,162,39,.40)' },
  bronze: { edge: ['#F2C89A', '#C07A3C', '#5A3315', '#B0692F', '#EABF8C'], face: ['#2A1A10', '#0D0705'], hair: 'rgba(200,126,62,.42)' },
  silver: { edge: ['#FFFFFF', '#D4D8DE', '#767C85', '#C6CBD2', '#F4F6F9'], face: ['#2C2E33', '#0A0A0C'], hair: 'rgba(214,219,226,.40)' },
  gold: { edge: ['#FFF3C4', '#E8C75E', '#7A5C12', '#D8B443', '#FBEDB6'], face: ['#2E2714', '#0C0A05'], hair: 'rgba(232,199,94,.48)' },
};

export function metalOf(tier?: Tier | string): MetalDef {
  return METAL[(tier as Tier) in METAL ? (tier as Tier) : 'standard'];
}

/** The metallic border gradient used around card frames. */
export function metalEdge(tier: Tier, angle = 150): string {
  const m = metalOf(tier);
  return `linear-gradient(${angle}deg, ${m.edge[0]}, ${m.edge[1]} 24%, ${m.edge[2]} 50%, ${m.edge[3]} 74%, ${m.edge[4]})`;
}
