import { useEffect, useReducer, type ReactNode } from "react";
import type { AppAction, AppState, Profile } from "../types/store";
import { AppContext } from "./app-context";
import {
  CARD_CATEGORIES,
  allCategories,
  categoryDef,
  emptyRecords,
  reconcileCardRecords,
  recsOf,
  syncCardFields,
} from "../constants/categories";
import { DIRECTORY } from "../constants/directory";

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
  phone: "",
  email: "",
  started: false,
  cardSaved: false,
  accountCreated: false,
  answers: {},
  records: emptyRecords(),
  categories: {},
  media: [],
  cardShade: "slate",
};

/** The Profile Card and account fields - the only part of the profile that
 *  survives a reload. */
function persistableProfile(profile: Profile) {
  const {
    name, photo, professions, skills, interests, locations, languages,
    tier, theme, level, live, phone, email, started, cardSaved,
    accountCreated, answers,
  } = profile;
  return {
    name, photo, professions, skills, interests, locations, languages,
    tier, theme, level, live, phone, email, started, cardSaved,
    accountCreated, answers,
  };
}

function loadStoredProfile(): Profile {
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return defaultProfile;
    const stored = JSON.parse(raw) as Partial<ReturnType<typeof persistableProfile>>;
    // Everything below the Profile Card (records/categories/media/cardShade)
    // is session-only, like connections/reviews - never read back either,
    // even if an older build once wrote some into this same key. Records
    // for whatever's already on the card are regenerated fresh below.
    return reconcileCardRecords({ ...defaultProfile, ...stored });
  } catch {
    return defaultProfile;
  }
}

function initState(): AppState {
  return {
    role: "team",
    profile: loadStoredProfile(),
    selection: [],
    // Seeded demo connections/reviews so the Network and Reviews & References
    // previews aren't empty on a fresh profile - this app has no real
    // backend to source them from, matching the reference prototype's own
    // hardcoded directory.
    connections: [DIRECTORY[0], DIRECTORY[1], DIRECTORY[2]].map((p) => ({ id: p.id })),
    reviews: [
      {
        id: "rev_seed_1",
        aboutId: "me",
        byId: DIRECTORY[0].id,
        byName: DIRECTORY[0].name,
        rating: 5,
        text: "Reliable, great with guests, and always on time.",
        at: Date.now() - 1000 * 60 * 60 * 24 * 6,
      },
    ],
    reviewRequests: [],
    categoryVisibility: {},
    toast: null,
  };
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ROLE":
      return { ...state, role: action.role };
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
      return {
        ...state,
        profile: reconcileCardRecords({ ...state.profile, ...action.patch }),
      };
    case "START_BUILDING":
      return { ...state, profile: { ...state.profile, started: true } };
    case "SAVE_CARD":
      return {
        ...state,
        profile: { ...state.profile, cardSaved: true },
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
          accountCreated: true,
          live: true,
        },
      };
    case "ANSWER": {
      return {
        ...state,
        profile: {
          ...state.profile,
          answers: { ...state.profile.answers, [action.qid]: action.value },
        },
      };
    }

    case "REC_ADD":
      return {
        ...state,
        profile: {
          ...state.profile,
          records: {
            ...state.profile.records,
            [action.category]: [...recsOf(state.profile, action.category), action.record],
          },
        },
      };

    case "REC_PATCH":
      return {
        ...state,
        profile: {
          ...state.profile,
          records: {
            ...state.profile.records,
            [action.category]: recsOf(state.profile, action.category).map((r) =>
              r.id === action.id ? { ...r, ...action.patch } : r,
            ),
          },
        },
      };

    case "REC_DELETE": {
      let profile: Profile = {
        ...state.profile,
        records: {
          ...state.profile.records,
          [action.category]: recsOf(state.profile, action.category).filter(
            (r) => r.id !== action.id,
          ),
        },
      };
      if ((CARD_CATEGORIES as readonly string[]).includes(action.category)) {
        const limit = categoryDef(state.profile, action.category).cardLimit ?? 3;
        profile = syncCardFields(profile, action.category, limit);
      }
      return { ...state, profile };
    }

    case "REC_PRIMARY": {
      const def = categoryDef(state.profile, action.category);
      const limit = def.cardLimit ?? 3;
      const current = recsOf(state.profile, action.category).filter((r) => r.primary).length;
      if (action.primary && current >= limit) {
        return {
          ...state,
          toast: `Your card shows ${limit} ${def.label.toLowerCase()} at a time. Unpick one first.`,
        };
      }
      let profile: Profile = {
        ...state.profile,
        records: {
          ...state.profile.records,
          [action.category]: recsOf(state.profile, action.category).map((r) =>
            r.id === action.id ? { ...r, primary: action.primary } : r,
          ),
        },
      };
      if ((CARD_CATEGORIES as readonly string[]).includes(action.category)) {
        profile = syncCardFields(profile, action.category, limit);
      }
      return { ...state, profile };
    }

    case "CATEGORY_ADD": {
      if (allCategories(state.profile)[action.key]) {
        return { ...state, toast: "That category already exists." };
      }
      return {
        ...state,
        profile: {
          ...state.profile,
          categories: { ...state.profile.categories, [action.key]: action.def },
          records: { ...state.profile.records, [action.key]: [] },
        },
        toast: `${action.def.label} added as a category`,
      };
    }

    case "TOGGLE_CATEGORY": {
      const current = state.categoryVisibility[action.key] !== false;
      return {
        ...state,
        categoryVisibility: {
          ...state.categoryVisibility,
          [action.key]: action.visible ?? !current,
        },
      };
    }

    case "MEDIA_ADD":
      return {
        ...state,
        profile: { ...state.profile, media: [...state.profile.media, action.item] },
      };
    case "MEDIA_DELETE":
      return {
        ...state,
        profile: {
          ...state.profile,
          media: state.profile.media.filter((m) => m.id !== action.id),
        },
      };

    case "REVIEW_REQUEST":
      return {
        ...state,
        reviewRequests: [...state.reviewRequests, action.request],
        toast: `Asked ${action.request.fromName.split(" ")[0]} for a review`,
      };

    case "CONNECT":
      if (state.connections.some((c) => c.id === action.id)) return state;
      return {
        ...state,
        connections: [...state.connections, { id: action.id }],
        toast: `Connected with ${action.name.split(" ")[0]}`,
      };
    case "DISCONNECT":
      return {
        ...state,
        connections: state.connections.filter((c) => c.id !== action.id),
        toast: `Removed ${action.name.split(" ")[0]} from your network`,
      };

    case "TOAST":
      return { ...state, toast: action.message };

    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  // Keep the in-progress (or finished) card in localStorage so a reload never
  // loses what someone has typed - only the Profile Card/account fields
  // persist. Everything below the card (records, categories, media,
  // connections, reviews, toast) is session-only by design.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(persistableProfile(state.profile)),
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
