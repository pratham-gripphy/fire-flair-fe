import { useStore } from './useStore';
import type { Tab } from '../types/store';

/** Switches the active tab, respecting each role's home route - shared by
 *  the desktop header nav and the mobile bottom nav so they never diverge. */
export function useGoTab() {
  const { state, dispatch } = useStore();

  return (tab: Tab) => {
    if (!state.role) {
      dispatch({ type: 'TAB', tab });
      return;
    }
    const isTeam = state.role === 'team';
    if (isTeam) dispatch({ type: 'TAB', tab, route: state.profile.live ? 'home' : state.route });
    else dispatch({ type: 'TAB', tab, route: tab === 'home' ? 'staffHome' : state.route });
  };
}
