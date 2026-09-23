import { CatIcon, type CatKind } from "./CatIcon";

interface CatBadgeProps {
  kind: CatKind;
  size?: number;
  tone?: "dark" | "light";
  color?: string;
}

/** A category glyph inside a restrained circular container - the icon
 *  carries the meaning, never text in a circle. */
export function CatBadge({
  kind,
  size = 28,
  tone = "dark",
  color,
}: CatBadgeProps) {
  const ink = color ?? (tone === "dark" ? "#EAD79C" : "var(--color-gold-dk)");
  return (
    <span
      className="grid flex-none place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background:
          tone === "dark" ? "rgba(255,255,255,.06)" : "rgba(20,20,22,.05)",
        border: `1px solid ${tone === "dark" ? "rgba(234,215,156,.35)" : "rgba(26,26,28,.18)"}`,
      }}
    >
      <CatIcon kind={kind} size={Math.round(size * 0.52)} color={ink} />
    </span>
  );
}
