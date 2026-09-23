interface CardRuleProps {
  color: string;
  margin?: string;
  tight?: boolean;
}

/** A thin double-fade rule with a diamond centre - used to divide a card's
 *  header from its body. */
export function CardRule({
  color,
  margin = "9px 0 7px",
  tight,
}: CardRuleProps) {
  return (
    <div
      className="flex items-center gap-[7px]"
      style={{ margin, opacity: tight ? 0.7 : 1 }}
    >
      <i
        className="h-px flex-1"
        style={{ background: `linear-gradient(90deg, transparent, ${color})` }}
      />
      <i
        className="h-1 w-1 flex-none rotate-45"
        style={{ background: color }}
      />
      <i
        className="h-px flex-1"
        style={{ background: `linear-gradient(270deg, transparent, ${color})` }}
      />
    </div>
  );
}
