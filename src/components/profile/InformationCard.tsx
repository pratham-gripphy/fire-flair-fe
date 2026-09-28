import { Camera, Check, ChevronRight, FileText } from "lucide-react";
import { CardFrame } from "../common/CardFrame";
import { CatBadge } from "../common/CatBadge";
import { THEMES } from "../../constants/theme";
import { CARD_W } from "../../constants/cardWidths";
import type { CardTheme, CategoryDef, InfoRecord } from "../../types/store";

interface InformationCardProps {
  record: InfoRecord;
  def: CategoryDef;
  themeKey?: CardTheme;
  onClick: () => void;
}

/** One Information Record's card - the depth behind the Profile Card's flat
 *  chip summary. Same frame family as a Question Card. */
export function InformationCard({ record, def, themeKey = "slate", onClick }: InformationCardProps) {
  const t = THEMES[themeKey] ?? THEMES.slate;
  const mediaCount = record.media.length;
  const hasDoc = !!record.document;

  return (
    <CardFrame
      as="button"
      tier="standard"
      theme={t}
      ratio="5 / 7"
      onClick={onClick}
      className="relative flex flex-col px-3 pt-[26px] pb-2.5 text-left"
      style={{ width: CARD_W.info }}
    >
      <span
        className="absolute top-[9px] left-3 z-[4] text-[6.5px] font-bold tracking-[0.2em] uppercase"
        style={{ color: t.sub }}
      >
        {def.singular}
      </span>
      {record.primary && (
        <span
          className="absolute top-2 right-[9px] z-[4] flex"
          style={{ color: t.ink }}
          title="On your Profile Card"
        >
          <Check size={13} strokeWidth={2.4} />
        </span>
      )}

      <CatBadge kind={def.icon} size={30} tone="dark" color={t.sub} />
      <div className="font-display mt-2.5 text-[14.5px] uppercase" style={{ color: t.ink }}>
        {record.name}
      </div>
      {record.proficiency && (
        <div className="font-serif text-[12px] italic" style={{ color: t.sub }}>
          {record.proficiency}
        </div>
      )}
      <div
        className="font-serif mt-1.5 flex-1 text-[12.5px] leading-[1.4]"
        style={{
          color: t.sub,
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {record.description || "No description yet."}
      </div>

      <div
        className="mt-2 flex items-center gap-2 border-t pt-[7px]"
        style={{ borderColor: t.rule }}
      >
        {mediaCount > 0 && (
          <span className="flex items-center gap-1 text-[10px]" style={{ color: t.sub }}>
            <Camera size={11} /> {mediaCount}
          </span>
        )}
        {hasDoc && (
          <span className="flex items-center gap-1 text-[10px]" style={{ color: t.sub }}>
            <FileText size={11} /> PDF
          </span>
        )}
        {!mediaCount && !hasDoc && (
          <span className="font-serif text-[10px] italic" style={{ color: t.sub }}>
            Tap to open
          </span>
        )}
        <span className="ml-auto flex" style={{ color: t.sub }}>
          <ChevronRight size={13} />
        </span>
      </div>
    </CardFrame>
  );
}
