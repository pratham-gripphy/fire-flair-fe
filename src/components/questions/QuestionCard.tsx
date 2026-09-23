import { Check, ChevronRight } from "lucide-react";
import { CardFrame } from "../common/CardFrame";
import { CatBadge } from "../common/CatBadge";
import { Pill } from "../common/Pill";
import {
  QUESTION_GROUPS,
  questionGroupColor,
  type Question,
} from "../../constants/questions";

interface QuestionCardProps {
  q: Question;
  answer?: string;
  onClick: () => void;
}

/** One Question Card - same frame family as everything else, but these stay
 *  off the public Profile Card; they exist so FireFlair understands the
 *  professional. */
export function QuestionCard({ q, answer, onClick }: QuestionCardProps) {
  const c = questionGroupColor(q.group);
  const groupLabel =
    QUESTION_GROUPS.find((g) => g.key === q.group)?.label ?? q.group;
  const answered = answer !== undefined && answer !== "";

  return (
    <CardFrame
      as="button"
      tier="standard"
      theme={{
        name: q.group,
        bg: c.bg,
        ink: c.ink,
        sub: c.sub,
        rule: c.rule,
        dark: true,
        swatch: c.sub,
      }}
      ratio="5 / 7"
      onClick={onClick}
      className="relative flex w-[clamp(150px,44vw,176px)] flex-col px-3 pt-[26px] pb-2.5 text-left"
    >
      <span
        className="absolute top-[9px] left-3 z-[4] text-[6.5px] font-bold tracking-[0.2em] uppercase"
        style={{ color: c.sub }}
      >
        {groupLabel}
      </span>
      {answered ? (
        <span
          className="absolute top-2 right-[9px] z-[4] flex"
          style={{ color: c.ink }}
        >
          <Check size={13} strokeWidth={2.4} />
        </span>
      ) : (
        <span className="absolute top-[7px] right-2 z-[4]">
          <Pill tone="warn">+1 XP</Pill>
        </span>
      )}

      <CatBadge kind="skills" size={30} tone="dark" color={c.sub} />
      <div
        className="font-serif mt-2.5 flex-1 text-[14.5px] leading-[1.35]"
        style={{ color: c.ink }}
      >
        {q.text}
      </div>
      <div
        className="flex items-center gap-1.5 border-t pt-[7px]"
        style={{ borderColor: c.rule }}
      >
        <span
          className="font-serif min-w-0 overflow-hidden text-[10px] text-ellipsis whitespace-nowrap italic"
          style={{ color: c.sub }}
        >
          {answered ? answer : "Tap to answer"}
        </span>
        <span className="ml-auto flex" style={{ color: c.sub }}>
          <ChevronRight size={13} />
        </span>
      </div>
    </CardFrame>
  );
}
