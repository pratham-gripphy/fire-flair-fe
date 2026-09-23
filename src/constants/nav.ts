import type { Tab } from "../types/store";

export interface NavItem {
  key: Tab | "__ff";
  label: string;
  mark: "home" | "network" | "bookings" | "profile" | null;
  path: string | null;
}

/** Primary tab bar. The "__ff" entry is not a tab - it's where the central
 *  FireFlair coin button sits in the mobile bottom nav, so it has no route
 *  of its own. */
export const NAV: NavItem[] = [
  { key: "home", label: "Home", mark: "home", path: "/home" },
  { key: "network", label: "Network", mark: "network", path: "/network" },
  { key: "__ff", label: "", mark: null, path: null },
  { key: "bookings", label: "Bookings", mark: "bookings", path: "/bookings" },
  { key: "profile", label: "Profile", mark: "profile", path: "/profile" },
];

export function pathForTab(tab: Tab): string {
  return NAV.find((n) => n.key === tab)?.path ?? "/home";
}
