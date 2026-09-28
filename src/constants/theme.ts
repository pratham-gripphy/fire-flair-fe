import type { CardTheme, Tier } from '../types/store';

export interface CardThemeDef {
  name: string;
  /** background gradient painted behind the metal border */
  bg: string;
  ink: string;
  sub: string;
  rule: string;
  dark: boolean;
  swatch: string;
}

export const THEMES: Record<CardTheme, CardThemeDef> = {
  onyx: { name: 'Onyx', bg: 'linear-gradient(168deg,#1A1A1D,#0C0C0E)', ink: '#F2F0EA', sub: '#B9B6AE', rule: 'rgba(240,238,232,.22)', dark: true, swatch: '#141416' },
  slate: { name: 'Forest', bg: 'linear-gradient(168deg,#173028,#0A1712)', ink: '#F1F4F0', sub: '#B7CDBF', rule: 'rgba(201,162,39,.28)', dark: true, swatch: '#12241D' },
  burgundy: { name: 'Burgundy', bg: 'linear-gradient(168deg,#3E1519,#1C080B)', ink: '#F5EEEA', sub: '#D6BCB6', rule: 'rgba(201,162,39,.28)', dark: true, swatch: '#3A1418' },
  paper: { name: 'Paper', bg: 'linear-gradient(168deg,#FAFAF8,#ECEBE6)', ink: '#1A1A1C', sub: '#5E5D58', rule: 'rgba(26,26,28,.18)', dark: false, swatch: '#F2F1EC' },
};

/** The colours offered when building or editing your own card, in picker order. */
export const CARD_COLOURS: CardTheme[] = ['onyx', 'burgundy', 'paper'];

export interface CardTierDef {
  name: string;
  ring: [string, string];
  face: string;
  ink: string;
}

export const TIERS: Record<Tier, CardTierDef> = {
  standard: { name: 'Standard', ring: ['#C9A227', '#7E611D'], face: '#111113', ink: '#E6CC80' },
  bronze: { name: 'Bronze', ring: ['#D89A5C', '#7A4A20'], face: '#1A0F08', ink: '#F0C08A' },
  silver: { name: 'Silver', ring: ['#E6E8EC', '#8D9298'], face: '#141416', ink: '#EFF1F4' },
  gold: { name: 'Gold', ring: ['#F0D68A', '#9A7717'], face: '#131108', ink: '#F7E4A6' },
};

export const CARD_DOMAIN = 'ffparty.uk';
