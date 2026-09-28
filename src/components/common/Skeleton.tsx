import type { CSSProperties } from "react";

interface SkeletonProps {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  /** Round it off - avatars/portraits. */
  circle?: boolean;
  /** For placeholders sitting on a dark (onyx/card) surface. */
  dark?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** A single shimmering placeholder block. Purely decorative - wrap a group
 *  of these in something with role="status" so screen readers hear one
 *  "Loading" rather than nothing. */
export function Skeleton({
  width = "100%",
  height = 12,
  circle,
  dark,
  className = "",
  style,
}: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={`ff-shimmer block ${dark ? "dark" : ""} ${className}`.trim()}
      style={{
        width,
        height,
        borderRadius: circle ? "50%" : 2,
        flex: "none",
        ...style,
      }}
    />
  );
}
