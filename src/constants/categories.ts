import type { CategoryDef, InfoRecord, Profile } from '../types/store';

const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 8)}`;

/** Field capabilities per category. A category declares what it needs;
 *  nothing gets fields it has no use for. */
export const BASE_CATEGORIES: Record<string, CategoryDef> = {
  professions: {
    label: 'Professions',
    singular: 'Profession',
    icon: 'professions',
    onCard: true,
    cardLimit: 3,
    fields: ['description', 'media'],
    placeholder: 'Cocktail Bartender',
  },
  qualifications: {
    label: 'Qualifications',
    singular: 'Qualification',
    icon: 'qualifications',
    onCard: false,
    fields: ['description', 'document'],
    placeholder: 'Personal Licence',
  },
  skills: {
    label: 'Skills',
    singular: 'Skill',
    icon: 'skills',
    onCard: true,
    cardLimit: 3,
    fields: ['description', 'media'],
    placeholder: 'Cocktail Mixology',
  },
  interests: {
    label: 'Interests',
    singular: 'Interest',
    icon: 'interests',
    onCard: true,
    cardLimit: 3,
    fields: ['description', 'media'],
    placeholder: 'Music',
  },
  locations: {
    label: 'Work locations',
    singular: 'Location',
    icon: 'locations',
    onCard: true,
    cardLimit: 3,
    fields: ['description'],
    placeholder: 'Central London',
  },
  languages: {
    label: 'Languages',
    singular: 'Language',
    icon: 'languages',
    onCard: true,
    cardLimit: 5,
    fields: ['proficiency', 'description', 'media'],
    placeholder: 'Spanish',
  },
  reviews: {
    label: 'Reviews & References',
    singular: 'Review',
    icon: 'reviews',
    onCard: false,
    fields: ['description'],
    system: true,
    placeholder: 'Reliable, great with guests',
  },
  experience: {
    label: 'Experience',
    singular: 'Experience',
    icon: 'experience',
    onCard: false,
    fields: ['description', 'media'],
    placeholder: 'The Loft Lounge - Head Bartender',
  },
};

/** Categories shown on the Profile Card, in card order. */
export const CARD_CATEGORIES = [
  'professions',
  'skills',
  'interests',
  'locations',
  'languages',
] as const;

export const PROFICIENCY = ['Native', 'Fluent', 'Professional', 'Conversational', 'Basic'];

/** Merge built-in categories with any the user has added at runtime. */
export function allCategories(profile: Profile): Record<string, CategoryDef> {
  return { ...BASE_CATEGORIES, ...(profile.categories || {}) };
}

export function categoryDef(profile: Profile, key: string): CategoryDef {
  return (
    allCategories(profile)[key] ?? {
      label: key,
      singular: key,
      icon: 'skills',
      onCard: false,
      fields: ['description', 'media'],
      placeholder: '',
    }
  );
}

export function categoryOrder(profile: Profile): string[] {
  return Object.keys(allCategories(profile));
}

export function catHas(def: CategoryDef, field: CategoryDef['fields'][number]): boolean {
  return (def.fields || []).includes(field);
}

export function makeRecord(category: string, name: string, extra: Partial<InfoRecord> = {}): InfoRecord {
  return {
    id: uid('rec'),
    category,
    name: String(name || '').trim(),
    description: '',
    media: [],
    document: null,
    proficiency: '',
    primary: false,
    ...extra,
  };
}

export function recsOf(profile: Profile, cat: string): InfoRecord[] {
  return (profile.records && profile.records[cat]) || [];
}

/** The Profile Card reads primaries. If nothing is flagged primary we fall
 *  back to the first few, so a fresh profile still renders a usable card. */
export function primaryNames(profile: Profile, cat: string, limit: number): string[] {
  const all = recsOf(profile, cat);
  const flagged = all.filter((r) => r.primary);
  const live = all;
  return (flagged.length ? flagged : live)
    .slice(0, limit)
    .map((r) => r.name)
    .filter(Boolean);
}

export function emptyRecords(): Record<string, InfoRecord[]> {
  return Object.keys(BASE_CATEGORIES).reduce<Record<string, InfoRecord[]>>((m, k) => {
    m[k] = [];
    return m;
  }, {});
}

/** Re-derives a card-eligible category's flat chip array from its current
 *  Information Records, so toggling "Show on my Profile Card" (or deleting
 *  the record behind it) visibly changes the actual Profile Card. Only
 *  touches the one category named - other categories' flat data (including
 *  anything typed directly via the card's chip editor, which has no
 *  backing record) is left exactly as it was. */
export function syncCardFields(profile: Profile, category: string, limit: number): Profile {
  const names = primaryNames(profile, category, limit);
  switch (category) {
    case 'professions':
      return { ...profile, professions: names };
    case 'skills':
      return { ...profile, skills: names };
    case 'interests':
      return { ...profile, interests: names };
    case 'locations':
      return { ...profile, locations: names };
    case 'languages':
      return { ...profile, languages: names };
    default:
      return profile;
  }
}

/** The other direction of the bridge: whatever's typed directly onto the
 *  card (professions/skills/interests/locations/languages chips) gets a
 *  matching Information Record below it automatically, already marked
 *  "on card" since that's exactly what it is. Purely additive - never
 *  edits or removes a record that already exists, so any description,
 *  photos, etc. someone's added stick around even if they later retype
 *  the chip. Call this whenever those flat fields might have changed. */
export function reconcileCardRecords(profile: Profile): Profile {
  let records = profile.records;
  let changed = false;

  for (const cat of CARD_CATEGORIES) {
    const have = new Set((records[cat] ?? []).map((r) => r.name.trim().toLowerCase()));
    const missing = profile[cat].filter((name) => name.trim() && !have.has(name.trim().toLowerCase()));
    if (missing.length) {
      changed = true;
      records = {
        ...records,
        [cat]: [...(records[cat] ?? []), ...missing.map((name) => makeRecord(cat, name, { primary: true }))],
      };
    }
  }

  return changed ? { ...profile, records } : profile;
}
