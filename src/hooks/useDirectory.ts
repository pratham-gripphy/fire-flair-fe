import { useMemo } from "react";
import { useStore } from "./useStore";
import { DIRECTORY, type DirectoryPerson } from "../constants/directory";
import type { Profile } from "../types/store";

export const ME_ID = "me";

/** The signed-in user's card in the same shape as everyone else's, so it can
 *  sit in the Network alongside them. */
export function meAsPerson(profile: Profile): DirectoryPerson {
  return {
    id: ME_ID,
    name: profile.name,
    profession: profile.professions[0] ?? "",
    group: "Your profile",
    tag: profile.name.replace(/\s+/g, "").slice(0, 5).toUpperCase() || "-----",
    tier: profile.tier,
    level: profile.level,
    rating: 0,
    reviews: 0,
    photo: profile.photo,
    theme: profile.theme,
    skills: profile.skills,
    interests: profile.interests,
    locations: profile.locations,
    languages: profile.languages,
  };
}

/** Everyone with a FireFlair account - the demo directory, plus the user's
 *  own card once they've created their account. */
export function useDirectory(): DirectoryPerson[] {
  const { state } = useStore();
  const { profile } = state;
  return useMemo(
    () => (profile.accountCreated ? [meAsPerson(profile), ...DIRECTORY] : DIRECTORY),
    [profile],
  );
}
