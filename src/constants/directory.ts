import type { CardTheme, Tier } from '../types/store';

/** The Network groups people by, in display order. "Your profile" is where
 *  the signed-in user's own card sits once their account exists. */
export const PEOPLE_GROUPS = [
  'Bartenders',
  'Waiters',
  'DJs & music',
  'Hosts',
  'Chefs',
  'Photographers',
  'Your profile',
] as const;

export type PeopleGroup = (typeof PEOPLE_GROUPS)[number];

export interface DirectoryPerson {
  id: string;
  name: string;
  profession: string;
  group: PeopleGroup;
  /** The short handle on the card address, e.g. ffparty.uk/MAYA1. */
  tag: string;
  tier: Tier;
  level: number;
  rating: number;
  reviews: number;
  photo?: string | null;
  theme?: CardTheme;
  skills: string[];
  interests: string[];
  locations: string[];
  languages: string[];
}

/** A small set of demo people who already have FireFlair accounts, standing
 *  in for a real directory backend - enough to power the Network screen and
 *  the Profile/Reviews previews. */
export const DIRECTORY: DirectoryPerson[] = [
  {
    id: 'dir_maya',
    name: 'Maya Okafor',
    profession: 'Bartender',
    group: 'Bartenders',
    tag: 'MAYA1',
    tier: 'gold',
    level: 5,
    rating: 4.9,
    reviews: 42,
    skills: ['Flair bartending', 'Mixology'],
    interests: ['Music', 'Travel'],
    locations: ['East London'],
    languages: ['English', 'French'],
  },
  {
    id: 'dir_theo',
    name: 'Theo Marsh',
    profession: 'Event Manager',
    group: 'Hosts',
    tag: 'THEOM',
    tier: 'silver',
    level: 4,
    rating: 4.7,
    reviews: 25,
    skills: ['Team leadership', 'Event setup'],
    interests: ['Football'],
    locations: ['Central London'],
    languages: ['English'],
  },
  {
    id: 'dir_priya',
    name: 'Priya Anand',
    profession: 'Mixologist',
    group: 'Bartenders',
    tag: 'PRIYA',
    tier: 'silver',
    level: 4,
    rating: 4.8,
    reviews: 31,
    skills: ['Cocktail making', 'Menu design'],
    interests: ['Wine tasting', 'Photography'],
    locations: ['Manchester'],
    languages: ['English', 'Hindi'],
  },
  {
    id: 'dir_lars',
    name: 'Lars Eriksson',
    profession: 'Bar Manager',
    group: 'Bartenders',
    tag: 'LARS2',
    tier: 'bronze',
    level: 3,
    rating: 4.5,
    reviews: 14,
    skills: ['Stock management'],
    interests: ['Cooking'],
    locations: ['Central London'],
    languages: ['English', 'Swedish'],
  },
  {
    id: 'dir_ines',
    name: 'Ines Duarte',
    profession: 'Cocktail Waiter',
    group: 'Waiters',
    tag: 'INES7',
    tier: 'gold',
    level: 5,
    rating: 4.9,
    reviews: 38,
    skills: ['Customer service'],
    interests: ['Art', 'Fashion'],
    locations: ['South London'],
    languages: ['English', 'Portuguese'],
  },
  {
    id: 'dir_sam',
    name: 'Sam Whitfield',
    profession: 'Sommelier',
    group: 'Waiters',
    tag: 'SAMW3',
    tier: 'standard',
    level: 2,
    rating: 4.4,
    reviews: 9,
    skills: ['Wine service'],
    interests: ['Reading'],
    locations: ['West London'],
    languages: ['English'],
  },
  {
    id: 'dir_kofi',
    name: 'Kofi Mensah',
    profession: 'Wedding DJ',
    group: 'DJs & music',
    tag: 'KOFIM',
    tier: 'silver',
    level: 4,
    rating: 4.8,
    reviews: 27,
    skills: ['Open format', 'MC'],
    interests: ['Afrobeats', 'Vinyl'],
    locations: ['North London'],
    languages: ['English'],
  },
  {
    id: 'dir_elena',
    name: 'Elena Rossi',
    profession: 'Private Chef',
    group: 'Chefs',
    tag: 'ELENA',
    tier: 'gold',
    level: 5,
    rating: 5,
    reviews: 19,
    skills: ['Italian', 'Canapés'],
    interests: ['Foraging'],
    locations: ['West London'],
    languages: ['English', 'Italian'],
  },
  {
    id: 'dir_jin',
    name: 'Jin Park',
    profession: 'Event Photographer',
    group: 'Photographers',
    tag: 'JINPK',
    tier: 'bronze',
    level: 3,
    rating: 4.6,
    reviews: 12,
    skills: ['Candid', 'Editing'],
    interests: ['Film cameras'],
    locations: ['Central London'],
    languages: ['English', 'Korean'],
  },
];

export interface Venue {
  id: string;
  name: string;
  kind: string;
  area: string;
  tag: string;
  tier: 'standard' | 'bronze' | 'silver' | 'gold';
}

export const VENUES: Venue[] = [
  { id: 'ven_loft', name: 'The Loft Lounge', kind: 'Cocktail bar', area: 'Enfield', tag: 'LOFTL', tier: 'gold' },
  { id: 'ven_ember', name: 'Ember & Oak', kind: 'Restaurant bar', area: 'Shoreditch', tag: 'EMBER', tier: 'silver' },
  { id: 'ven_velvet', name: 'Velvet Room', kind: 'Members club', area: 'Mayfair', tag: 'VELVT', tier: 'gold' },
  { id: 'ven_dock', name: 'Dockside Social', kind: 'Rooftop bar', area: 'Canary Wharf', tag: 'DOCKS', tier: 'bronze' },
  { id: 'ven_pearl', name: 'The Pearl', kind: 'Hotel bar', area: 'Marylebone', tag: 'PEARL', tier: 'standard' },
];
