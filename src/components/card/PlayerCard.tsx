import { CardFrame } from "../common/CardFrame";
import { Logo } from "../common/Logo";
import { Portrait } from "../common/Portrait";
import { Level } from "../common/Level";
import { CardRule } from "../common/CardRule";
import { CardMeta } from "../common/CardMeta";
import type { CatKind } from "../common/CatIcon";
import { flagFor } from "../../constants/languages";
import { metalOf } from "../../constants/metal";
import { CARD_DOMAIN, THEMES, TIERS } from "../../constants/theme";
import type { DirectoryPerson } from "../../constants/directory";

interface PlayerCardProps {
  person: DirectoryPerson;
  selected?: boolean;
  onClick?: () => void;
}

const top3 = (values: string[]) => values.filter(Boolean).slice(0, 3);

/** Another person's card as a portrait playing card - the shape people take
 *  wherever they're browsed (Network, Profile's network preview). */
export function PlayerCard({ person, selected, onClick }: PlayerCardProps) {
  const t = THEMES[person.theme ?? "paper"] ?? THEMES.paper;
  const tier = person.tier;
  const { ink, sub } = t;

  const rows = (
    [
      ["skills", "Skills", top3(person.skills)],
      ["interests", "Interests", top3(person.interests)],
      ["location", "Where", top3(person.locations)],
    ] as [CatKind, string, string[]][]
  ).filter(([, , v]) => v.length);
  const languages = person.languages.slice(0, 3);

  return (
    <CardFrame
      as={onClick ? "button" : "div"}
      tier={tier}
      theme={t}
      ratio="5 / 7"
      selected={selected}
      onClick={onClick}
      className="flex w-full flex-col items-center text-left"
      style={{ padding: "26px 14px 12px" }}
    >
      <span className="absolute top-[9px] right-[9px] z-[4]">
        <Logo size={30} />
      </span>
      <Portrait
        src={person.photo}
        name={person.name}
        size={72}
        tier={tier}
        ink={TIERS[tier].ink}
      />
      <div
        className="font-display mt-2.5 text-center text-[15px] leading-[1.15] tracking-[0.09em] uppercase"
        style={{ color: ink }}
      >
        {person.name || "Your name"}
      </div>
      {person.profession && (
        <div
          className="mt-px text-center text-sm italic"
          style={{ fontFamily: "var(--font-serif)", color: sub, lineHeight: 1.2 }}
        >
          {person.profession}
        </div>
      )}

      <div className="mt-auto w-full">
        <CardRule color={t.rule} margin="10px 0 6px" />
        <div className="flex flex-col gap-px">
          {rows.map(([kind, label, values]) => (
            <CardMeta
              key={kind}
              kind={kind}
              label={label}
              value={values.join(" · ")}
              theme={t}
              size="md"
            />
          ))}
        </div>
        {languages.length > 0 && (
          <div className="pt-[7px] pb-1 text-center text-base tracking-[2px]">
            {languages.map((l) => (
              <span key={l} className="mr-1">
                {flagFor(l)}
              </span>
            ))}
          </div>
        )}
        <div
          className="flex items-center justify-between gap-1 border-t pt-1.5"
          style={{ borderColor: metalOf(tier).hair }}
        >
          <Level n={person.level} color={sub} size={6} />
          <span
            className="font-display text-[9.5px] tracking-[0.04em] whitespace-nowrap"
            style={{ color: sub }}
          >
            {CARD_DOMAIN}/{person.tag}
          </span>
        </div>
      </div>
    </CardFrame>
  );
}
