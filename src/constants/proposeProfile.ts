import type { ProfileDraft } from '../types/store';

export interface ProfileProposal {
  field: keyof Omit<ProfileDraft, 'photo'>;
  label: string;
  values: string[];
}

function cap(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Whole-word/phrase match, so short entries like "art" don't fire on
 *  "bartender". */
function includesWord(haystack: string, phrase: string): boolean {
  return new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(haystack);
}

const PROFESSIONS = [
  'bartender', 'mixologist', 'barback', 'bar manager', 'cocktail waiter',
  'event bartender', 'brand ambassador', 'sommelier', 'barista', 'waiter',
  'waitress', 'chef', 'events manager',
];

const SKILLS = [
  'flair bartending', 'mixology', 'cocktail making', 'wine service',
  'coffee making', 'latte art', 'customer service', 'stock management',
  'event setup', 'menu design', 'team leadership', 'speed pouring',
];

const INTERESTS = [
  'music', 'travel', 'cooking', 'fitness', 'photography', 'reading',
  'football', 'art', 'fashion', 'gaming', 'wine tasting', 'hiking',
];

const LANGUAGES = [
  'english', 'spanish', 'french', 'german', 'italian', 'portuguese',
  'hindi', 'mandarin', 'arabic', 'polish', 'romanian', 'punjabi', 'urdu',
];

/**
 * Free text -> proposed Profile Card fields (name, professions, skills,
 * interests, work locations, languages).
 *
 * No language model is wired up here: this is a keyword/phrase matcher,
 * the same dummy-flow approach as proposeAnswersFromText() in
 * proposeAnswers.ts. A live adapter would swap this function's body for a
 * real model call and keep the same ProfileProposal[] output shape.
 * This function only ever proposes - the caller confirms before anything
 * touches the profile draft.
 */
export function proposeProfileFromText(text: string): ProfileProposal[] {
  const t = text.toLowerCase();
  const proposals: ProfileProposal[] = [];

  const nameMatch = text.match(
    /(?:my name is|i'm|i am|this is)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)/i,
  );
  if (nameMatch) {
    proposals.push({ field: 'name', label: 'Name', values: [nameMatch[1].trim()] });
  }

  const professions = PROFESSIONS.filter((p) => includesWord(t, p)).map(cap);
  if (professions.length) {
    proposals.push({ field: 'professions', label: 'Professions', values: professions });
  }

  const skills = SKILLS.filter((s) => includesWord(t, s)).map(cap);
  if (skills.length) {
    proposals.push({ field: 'skills', label: 'Skills', values: skills });
  }

  const interests = INTERESTS.filter((i) => includesWord(t, i)).map(cap);
  if (interests.length) {
    proposals.push({ field: 'interests', label: 'Interests', values: interests });
  }

  const locMatch = text.match(/based in ([a-zA-Z\s]+?)(?:[.,]|$)/i);
  if (locMatch) {
    proposals.push({ field: 'locations', label: 'Work locations', values: [cap(locMatch[1].trim())] });
  }

  const languages = LANGUAGES.filter((l) => includesWord(t, l)).map(cap);
  if (languages.length) {
    proposals.push({ field: 'languages', label: 'Languages', values: languages });
  }

  return proposals;
}

/** A static, ready-made bio for testing the flow end to end without typing
 *  one out - worded to trigger several proposals at once. */
export const SAMPLE_PROFILE_PROMPT =
  "I'm Alex Morgan, a bartender and mixologist based in Manchester. " +
  "I'm into flair bartending, cocktail making and customer service. " +
  "Outside of work I love music, travel and photography. I speak English and Spanish.";
