import type { CatKind } from '../components/common/CatIcon';

export type Role = 'team' | 'staff' | null;

export type Tab = 'home' | 'network' | 'bookings' | 'profile';

export type Tier = 'standard' | 'bronze' | 'silver' | 'gold';

export type CardTheme = 'onyx' | 'slate' | 'paper';

/** The fields typed directly onto the card while building it. */
export interface ProfileDraft {
  name: string;
  photo: string | null;
  professions: string[];
  skills: string[];
  interests: string[];
  locations: string[];
  languages: string[];
}

export type MediaItem =
  | { id: string; kind: 'photo'; name: string; dataUrl: string }
  | { id: string; kind: 'video'; url: string };

/** One entry in a profile category - the depth behind the Profile Card's
 *  flat chip summary. */
export interface InfoRecord {
  id: string;
  category: string;
  name: string;
  description: string;
  media: { id: string; name: string; dataUrl: string }[];
  document: { name: string; size: number; type: string; dataUrl: string | null } | null;
  proficiency: string;
  primary: boolean;
  /** Only ever true for the reviews synthesized from `AppState.reviews`. */
  readOnly?: boolean;
}

export type CategoryField = 'description' | 'media' | 'document' | 'proficiency';

/** What a category (built-in or user-added) is capable of holding. */
export interface CategoryDef {
  label: string;
  singular: string;
  icon: CatKind;
  onCard: boolean;
  cardLimit?: number;
  fields: CategoryField[];
  placeholder: string;
  system?: boolean;
  custom?: boolean;
}

export interface Connection {
  id: string;
}

export interface Review {
  id: string;
  aboutId: 'me';
  byId: string;
  byName: string;
  rating: number;
  text: string;
  at: number;
}

export interface ReviewRequest {
  id: string;
  aboutId: 'me';
  fromId: string;
  fromName: string;
  at: number;
}

export interface Profile extends ProfileDraft {
  tier: Tier;
  theme: CardTheme;
  level: number;
  live: boolean;
  xp: number;
  phone: string;
  email: string;
  /** User has clicked "Build my card" - shows the editable card instead of the CTA. */
  started: boolean;
  /** User has clicked "Save card" on a completed card - reveals the contact fields. */
  cardSaved: boolean;
  accountCreated: boolean;
  /** Answers to Question Cards, keyed by question id. Internal profile data -
   *  never shown on the public card. */
  answers: Record<string, string>;
  /** Information Records per category - the depth behind the card. */
  records: Record<string, InfoRecord[]>;
  /** User-defined categories, merged over the built-in ones at runtime. */
  categories: Record<string, CategoryDef>;
  media: MediaItem[];
  /** Theme used for the owner's own Information/Review cards. */
  cardShade: CardTheme;
}

export interface AppState {
  role: Role;
  profile: Profile;
  selection: string[];
  connections: Connection[];
  reviews: Review[];
  reviewRequests: ReviewRequest[];
  /** Shared show/hide map for every collapsible profile section, keyed by
   *  section id. A missing key means visible - nothing hidden ever deletes data. */
  categoryVisibility: Record<string, boolean>;
  toast: string | null;
}

export type AppAction =
  | { type: 'ROLE'; role: Exclude<Role, null> }
  | { type: 'SELECT'; id: string }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'PROFILE_PATCH'; patch: Partial<Profile> }
  | { type: 'START_BUILDING' }
  | { type: 'SAVE_CARD' }
  | { type: 'RESET_CARD' }
  | { type: 'CREATE_ACCOUNT'; phone: string }
  | { type: 'ANSWER'; qid: string; value: string }
  | { type: 'REC_ADD'; category: string; record: InfoRecord }
  | { type: 'REC_PATCH'; category: string; id: string; patch: Partial<InfoRecord> }
  | { type: 'REC_DELETE'; category: string; id: string }
  | { type: 'REC_PRIMARY'; category: string; id: string; primary: boolean }
  | { type: 'CATEGORY_ADD'; key: string; def: CategoryDef }
  | { type: 'TOGGLE_CATEGORY'; key: string; visible?: boolean }
  | { type: 'MEDIA_ADD'; item: MediaItem }
  | { type: 'MEDIA_DELETE'; id: string }
  | { type: 'REVIEW_REQUEST'; request: ReviewRequest }
  | { type: 'TOAST'; message: string | null };
