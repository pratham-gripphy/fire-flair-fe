import type { Tab } from '../types/store';

export interface NavItem {
  key: Tab | '__ff';
  label: string;
  mark: 'home' | 'network' | 'bookings' | 'profile' | null;
}

/** Primary tab bar. The "__ff" entry is not a tab — it's where the central
 *  FireFlair coin button sits in the mobile bottom nav. */
export const NAV: NavItem[] = [
  { key: 'home', label: 'Home', mark: 'home' },
  { key: 'network', label: 'Network', mark: 'network' },
  { key: '__ff', label: '', mark: null },
  { key: 'bookings', label: 'Bookings', mark: 'bookings' },
  { key: 'profile', label: 'Profile', mark: 'profile' },
];
