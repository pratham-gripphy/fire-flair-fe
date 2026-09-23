interface NavMarkProps {
  shape: "home" | "network" | "bookings" | "profile";
  size?: number;
  tone?: string;
}

/** Small drawn FireFlair pieces for the bottom nav - stroked glyphs, not
 *  generic app icons, in the app's restrained gold/white palette. */
export function NavMark({ shape, size = 23, tone = "#F2F0EA" }: NavMarkProps) {
  const p = {
    fill: "none",
    stroke: tone,
    strokeWidth: 1.5,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };
  const inner = {
    fill: "none",
    stroke: tone,
    strokeWidth: 1.2,
    opacity: 0.75,
    strokeLinecap: "round" as const,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {shape === "home" && (
        <>
          <path
            d="M3.4 10.6 12 3.6l8.6 7v9.2a1 1 0 0 1-1 1H4.4a1 1 0 0 1-1-1z"
            {...p}
          />
          <path d="M9.4 20.8v-6.2h5.2v6.2" {...p} />
          <path d="M12 3.6v1.2" {...inner} />
        </>
      )}
      {shape === "network" && (
        <>
          <circle cx="12" cy="8.1" r="2.5" {...p} />
          <path d="M7.4 18.8c.7-2.9 2.3-4.4 4.6-4.4s3.9 1.5 4.6 4.4" {...p} />
          <circle cx="4.6" cy="10.3" r="1.9" {...inner} />
          <path d="M1.6 18.2c.5-2.2 1.6-3.3 3-3.4" {...inner} />
          <circle cx="19.4" cy="10.3" r="1.9" {...inner} />
          <path d="M22.4 18.2c-.5-2.2-1.6-3.3-3-3.4" {...inner} />
        </>
      )}
      {shape === "bookings" && (
        <>
          <rect x="3.6" y="5.2" width="16.8" height="14.6" rx="1.4" {...p} />
          <path d="M3.6 9.4h16.8" {...p} />
          <path d="M7.8 3.4v3.4M16.2 3.4v3.4" {...p} />
          <path d="M12 12.4l1.5 1.5-1.5 1.5-1.5-1.5z" {...inner} />
        </>
      )}
      {shape === "profile" && (
        <>
          <rect x="5" y="3.2" width="14" height="17.6" rx="1.4" {...p} />
          <circle cx="12" cy="9.6" r="2.6" {...p} />
          <path d="M8.1 16.6c.7-1.9 2.1-2.9 3.9-2.9s3.2 1 3.9 2.9" {...p} />
          <path d="M6.6 5v1M17.4 19v-1" {...inner} />
        </>
      )}
    </svg>
  );
}
