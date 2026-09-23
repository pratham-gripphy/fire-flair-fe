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
}

export interface AppState {
  role: Role;
  profile: Profile;
  selection: string[];
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
  | { type: 'ANSWER'; qid: string; value: string };
