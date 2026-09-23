import { useEffect, useReducer, type ReactNode } from "react";
import type { AppAction, AppState, Profile } from "../types/store";
import { AppContext } from "./app-context";
import { QUESTION_XP } from "../constants/questions";

const PROFILE_STORAGE_KEY = "fireflair.profile";

const defaultProfile: Profile = {
  name: "",
  photo: null,
  professions: [],
  skills: [],
  interests: [],
  locations: [],
  languages: ["English"],
  tier: "standard",
  theme: "onyx",
  level: 3,
  live: false,
  xp: 0,
  phone: "",
  email: "",
  started: false,
  cardSaved: false,
  accountCreated: false,
  answers: {},
};

function loadStoredProfile(): Profile {
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return defaultProfile;
    return { ...defaultProfile, ...(JSON.parse(raw) as Partial<Profile>) };
  } catch {
    return defaultProfile;
  }
}

function initState(): AppState {
  return {
    role: "team",
    tab: "home",
    route: "entry",
    profile: loadStoredProfile(),
    selection: [],
    toast: null,
  };
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ROLE":
      return { ...state, role: action.role, tab: "home" };
    case "TAB":
      return { ...state, tab: action.tab, route: action.route ?? state.route };
    case "GO":
      return { ...state, route: action.route };
    case "TOAST":
      return { ...state, toast: action.toast };
    case "SELECT": {
      const on = state.selection.includes(action.id);
      return {
        ...state,
        selection: on
          ? state.selection.filter((x) => x !== action.id)
          : [...state.selection, action.id],
      };
    }
    case "CLEAR_SELECTION":
      return { ...state, selection: [] };
    case "PROFILE_PATCH":
      return { ...state, profile: { ...state.profile, ...action.patch } };
    case "START_BUILDING":
      return { ...state, profile: { ...state.profile, started: true } };
    case "SAVE_CARD":
      return {
        ...state,
        profile: { ...state.profile, cardSaved: true },
        toast: "Card saved - add a phone or email to finish.",
      };
    case "RESET_CARD":
      return {
        ...state,
        profile: {
          ...state.profile,
          name: "",
          photo: null,
          professions: [],
          skills: [],
          interests: [],
          locations: [],
          languages: ["English"],
          started: false,
          cardSaved: false,
        },
      };
    case "CREATE_ACCOUNT":
      return {
        ...state,
        profile: {
          ...state.profile,
          phone: action.phone,
          email: action.email,
          accountCreated: true,
          live: true,
        },
        toast: "Your FireFlair card is live.",
      };
    case "ANSWER": {
      const existing = state.profile.answers[action.qid];
      const isNew = existing === undefined || existing === "";
      return {
        ...state,
        profile: {
          ...state.profile,
          answers: { ...state.profile.answers, [action.qid]: action.value },
          xp: isNew ? state.profile.xp + QUESTION_XP : state.profile.xp,
        },
      };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  // Keep the in-progress (or finished) card in localStorage so a reload never
  // loses what someone has typed - only the profile draft persists, not the
  // ephemeral UI state (role/tab/selection/toast).
  useEffect(() => {
    try {
      window.localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(state.profile),
      );
    } catch {
      // localStorage can throw in private-browsing/quota-exceeded cases - the
      // app still works, it just won't survive a reload.
    }
  }, [state.profile]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
