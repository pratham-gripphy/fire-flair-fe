import { useNavigate } from "react-router-dom";
import { pathForTab } from "../constants/nav";
import type { Tab } from "../types/store";

/** Navigates to a tab's route - shared by the desktop header nav and the
 *  mobile bottom nav so they never diverge. */
export function useGoTab() {
  const navigate = useNavigate();
  return (tab: Tab) => navigate(pathForTab(tab));
}
