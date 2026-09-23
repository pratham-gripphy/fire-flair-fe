import type { CSSProperties } from "react";
import { metalOf } from "../../constants/metal";
import { useSimpleId } from "../../hooks/useSimpleId";
import type { Tier } from "../../types/store";

interface CoinProps {
  size?: number;
  tier?: Tier;
  flat?: boolean;
  style?: CSSProperties;
}

const F_FORM = "M0 0 H24.5 V7.4 H8.6 V20.6 H20.4 V28 H8.6 V48 H0 Z";

/** The FireFlair coin/emblem - a stylised "F" struck in the tier's metal.
 *  Used everywhere a person's tier needs to show: header, cards, XP bar. */
export function Coin({
  size = 40,
  tier = "standard",
  flat = false,
  style,
}: CoinProps) {
  const m = metalOf(tier);
  const id = useSimpleId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={{ display: "block", flex: "none", ...style }}
    >
      <defs>
        <linearGradient id={`e${id}`} x1="0.12" y1="0" x2="0.88" y2="1">
          <stop offset="0%" stopColor={m.edge[0]} />
          <stop offset="24%" stopColor={m.edge[1]} />
          <stop offset="50%" stopColor={m.edge[2]} />
          <stop offset="74%" stopColor={m.edge[3]} />
          <stop offset="100%" stopColor={m.edge[4]} />
        </linearGradient>
        <radialGradient id={`f${id}`} cx="36%" cy="26%" r="82%">
          <stop offset="0%" stopColor={m.face[0]} />
          <stop offset="100%" stopColor={m.face[1]} />
        </radialGradient>
        <linearGradient id={`t${id}`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor={m.edge[0]} />
          <stop offset="42%" stopColor={m.edge[1]} />
          <stop offset="70%" stopColor={m.edge[3]} />
          <stop offset="100%" stopColor={m.edge[4]} />
        </linearGradient>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".6" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      <circle cx="50" cy="50" r="49" fill={`url(#e${id})`} />
      <circle cx="50" cy="50" r="43.5" fill={`url(#f${id})`} />
      {!flat && (
        <circle
          cx="50"
          cy="50"
          r="40.6"
          fill="none"
          stroke="#8C1526"
          strokeWidth="1.5"
          opacity=".8"
        />
      )}
      <circle
        cx="50"
        cy="50"
        r="37.4"
        fill="none"
        stroke={m.edge[1]}
        strokeWidth=".7"
        opacity=".5"
      />

      <g transform="translate(33.66 29.84) skewX(-9) scale(0.84)">
        <path d={F_FORM} fill={`url(#t${id})`} />
        <g transform="translate(22 0)">
          <path
            d={F_FORM}
            fill="none"
            stroke={m.face[1]}
            strokeWidth="3.4"
            strokeLinejoin="round"
          />
          <path d={F_FORM} fill={`url(#t${id})`} />
        </g>
      </g>

      <path
        d="M16 32 A40 40 0 0 1 58 11"
        fill="none"
        stroke={`url(#s${id})`}
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".55"
      />
    </svg>
  );
}
