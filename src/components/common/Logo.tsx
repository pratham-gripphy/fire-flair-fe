import type { CSSProperties } from "react";

interface LogoProps {
  size?: number;
  style?: CSSProperties;
}

/** The FireFlair brand mark - the client's own artwork (public/fireflairlogo.svg),
 *  used wherever the app shows its logo. Not to be confused with Coin, which
 *  is the dynamic per-tier badge (standard/bronze/silver/gold) shown on cards. */
export function Logo({ size = 40, style }: LogoProps) {
  return (
    <img
      src="/fireflairlogo.svg"
      alt="FireFlair"
      width={size}
      height={size}
      style={{ display: "block", flex: "none", borderRadius: "50%", ...style }}
    />
  );
}
