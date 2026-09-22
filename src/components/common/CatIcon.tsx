import { Briefcase, Heart, MapPin, MessageSquare, SlidersHorizontal, type LucideIcon } from 'lucide-react';

export type CatKind = 'profession' | 'skills' | 'interests' | 'location' | 'languages';

const CAT_ICON: Record<CatKind, LucideIcon> = {
  profession: Briefcase,
  skills: SlidersHorizontal,
  interests: Heart,
  location: MapPin,
  languages: MessageSquare,
};

interface CatIconProps {
  kind: CatKind;
  size?: number;
  color?: string;
}

/** The small glyph used for each category on a card (profession, skills, …). */
export function CatIcon({ kind, size = 14, color }: CatIconProps) {
  const Icon = CAT_ICON[kind] ?? Briefcase;
  return <Icon size={size} strokeWidth={1.6} color={color} style={{ flex: 'none' }} />;
}
