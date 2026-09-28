export interface DirectoryPerson {
  id: string;
  name: string;
  profession: string;
  skills: string[];
  interests: string[];
  locations: string[];
  languages: string[];
}

/** A small set of demo people, standing in for a real connections/network
 *  backend - just enough to power the Network and Reviews previews. */
export const DIRECTORY: DirectoryPerson[] = [
  {
    id: 'dir_maya',
    name: 'Maya Okafor',
    profession: 'Bartender',
    skills: ['Flair bartending', 'Mixology'],
    interests: ['Music', 'Travel'],
    locations: ['East London'],
    languages: ['English', 'French'],
  },
  {
    id: 'dir_theo',
    name: 'Theo Marsh',
    profession: 'Event Manager',
    skills: ['Team leadership', 'Event setup'],
    interests: ['Football'],
    locations: ['Central London'],
    languages: ['English'],
  },
  {
    id: 'dir_priya',
    name: 'Priya Anand',
    profession: 'Mixologist',
    skills: ['Cocktail making', 'Menu design'],
    interests: ['Wine tasting', 'Photography'],
    locations: ['Manchester'],
    languages: ['English', 'Hindi'],
  },
  {
    id: 'dir_lars',
    name: 'Lars Eriksson',
    profession: 'Bar Manager',
    skills: ['Stock management'],
    interests: ['Cooking'],
    locations: ['Central London'],
    languages: ['English', 'Swedish'],
  },
  {
    id: 'dir_ines',
    name: 'Ines Duarte',
    profession: 'Cocktail Waiter',
    skills: ['Customer service'],
    interests: ['Art', 'Fashion'],
    locations: ['South London'],
    languages: ['English', 'Portuguese'],
  },
  {
    id: 'dir_sam',
    name: 'Sam Whitfield',
    profession: 'Sommelier',
    skills: ['Wine service'],
    interests: ['Reading'],
    locations: ['West London'],
    languages: ['English'],
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
