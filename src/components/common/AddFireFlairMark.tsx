interface AddFireFlairMarkProps {
  size?: number;
  tone?: string;
}

/** "Add FireFlair" mark — a gold chat-bubble carrying "FF". Deliberately
 *  distinct from the circular Coin/emblem, used only for the add action. */
export function AddFireFlairMark({ size = 22, tone = 'var(--color-gold)' }: AddFireFlairMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block' }}>
      <path
        d="M12 3.4c5 0 9 3.4 9 7.6 0 4.2-4 7.6-9 7.6-1 0-2-.13-2.9-.4L4.8 20l1-3.5C4.7 15 3 13.1 3 11c0-4.2 4-7.6 9-7.6z"
        fill="none"
        stroke={tone}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <text x="12" y="13.6" textAnchor="middle" fontFamily="var(--font-display)" fontSize="8" fontWeight={600} fill={tone} letterSpacing=".01em">
        FF
      </text>
      <path d="M9 8.6h6M9 15.6h3.4" stroke={tone} strokeWidth="1" opacity=".5" strokeLinecap="round" />
    </svg>
  );
}
