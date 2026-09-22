import { metalEdge } from '../../constants/metal';
import type { Tier } from '../../types/store';

interface PortraitProps {
  src?: string | null;
  name?: string;
  size?: number;
  ring?: string;
  ink?: string;
  tier?: Tier;
}

export function Portrait({ src, name = '', size = 92, ring = '#C9A227', ink = '#EAD79C', tier }: PortraitProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const band = size * 0.032 + 1.4;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flex: 'none',
        padding: band,
        background: tier ? metalEdge(tier, 145) : `linear-gradient(145deg, ${ring}, ${ring})`,
        boxShadow: `0 ${size * 0.06}px ${size * 0.18}px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,.22)`,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(8,8,10,.9)',
          background: src ? `url("${src}") center/cover` : 'radial-gradient(circle at 38% 30%,#26262B,#0A0A0C)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 2px 9px rgba(0,0,0,.6)',
        }}
      >
        {!src && (
          <span style={{ fontFamily: 'var(--font-display)', color: ink, fontSize: size * 0.3, letterSpacing: '.05em', opacity: 0.85 }}>
            {initials}
          </span>
        )}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(64% 46% at 30% 16%, rgba(255,255,255,.20), transparent 62%)',
          }}
        />
      </div>
    </div>
  );
}
