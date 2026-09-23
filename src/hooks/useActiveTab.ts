import { useLocation } from "react-router-dom";
import { NAV } from "../constants/nav";
import type { Tab } from "../types/store";

/** The tab whose route matches the current URL - the single source of
 *  truth for nav highlighting, so Header and BottomNav never disagree. */
export function useActiveTab(): Tab {
  const { pathname } = useLocation();
  const match = NAV.find((n) => n.path && pathname.startsWith(n.path));
  return (match?.key as Tab) ?? "home";
}
