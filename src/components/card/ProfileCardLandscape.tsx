import { CardFrame } from "../common/CardFrame";
import { Logo } from "../common/Logo";
import { Portrait } from "../common/Portrait";
import { CatIcon, type CatKind } from "../common/CatIcon";
import { flagFor } from "../../constants/languages";
import { CARD_DOMAIN, THEMES, TIERS } from "../../constants/theme";
import type { Profile } from "../../types/store";

interface ProfileCardLandscapeProps {
  profile: Profile;
  tag?: string;
  onClick?: () => void;
}

const top3 = (values: string[]) => values.filter(Boolean).slice(0, 3);
const ICON_ROW: CatKind[] = ["profession", "skills", "interests", "location"];

/** A compact, landscape summary of the card - used on the Home dashboard as
 *  a shortcut into the full card on the Profile tab. */
export function ProfileCardLandscape({
  profile,
  tag = "-----",
  onClick,
}: ProfileCardLandscapeProps) {
  const t = THEMES[profile.theme] ?? THEMES.onyx;
  const tr = TIERS[profile.tier] ?? TIERS.standard;
  const professions = top3(profile.professions);
  const languages = profile.languages.slice(0, 3);
  const address = `${CARD_DOMAIN}/${tag}`;

  return (
    <CardFrame
      tier={profile.tier}
      theme={t}
      onClick={onClick}
      className="relative flex items-center gap-3 px-3 py-3.5"
    >
      <span className="absolute top-[7px] right-[7px] z-[4]">
        <Logo size={22} />
      </span>
      <Portrait
        src={profile.photo}
        name={profile.name}
        size={52}
        tier={profile.tier}
        ink={tr.ink}
      />
      <div className="min-w-0 flex-1 pr-5">
        <div
          className="font-display truncate text-sm tracking-[0.11em]"
          style={{ color: t.ink }}
        >
          {profile.name || "Your name"}
        </div>
        {professions.length > 0 && (
          <div
            className="font-serif truncate text-[12.5px] italic"
            style={{ color: t.sub, lineHeight: 1.3 }}
          >
            {professions.join("  ·  ")}
          </div>
        )}
        <div className="mt-1.5 flex items-center gap-2">
          <span className="inline-flex items-center gap-2 opacity-90">
            {ICON_ROW.map((k) => (
              <CatIcon key={k} kind={k} size={13} color={t.sub} />
            ))}
          </span>
          <span className="h-[11px] w-px" style={{ background: t.rule }} />
          <span className="text-xs">
            {languages.map((l) => (
              <span key={l} className="mr-[3px]">
                {flagFor(l)}
              </span>
            ))}
          </span>
          <span
            className="font-display ml-auto text-[7.5px] tracking-[0.06em] opacity-85 whitespace-nowrap"
            style={{ color: t.sub }}
          >
            {address}
          </span>
        </div>
      </div>
    </CardFrame>
  );
}
