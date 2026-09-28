import {
  Award,
  Briefcase,
  Clock,
  Hash,
  Heart,
  MapPin,
  MessageSquare,
  ShieldCheck,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react';

export type CatKind =
  | 'profession'
  | 'professions'
  | 'skills'
  | 'interests'
  | 'location'
  | 'locations'
  | 'languages'
  | 'qualification'
  | 'qualifications'
  | 'experience'
  | 'review'
  | 'reviews'
  | 'tag'
  | 'level'
  | 'employer';

const CAT_ICON: Record<CatKind, LucideIcon> = {
  profession: Briefcase,
  professions: Briefcase,
  skills: SlidersHorizontal,
  interests: Heart,
  location: MapPin,
  locations: MapPin,
  languages: MessageSquare,
  qualification: ShieldCheck,
  qualifications: ShieldCheck,
  experience: Clock,
  review: Award,
  reviews: Award,
  tag: Hash,
  level: Award,
  employer: Briefcase,
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
