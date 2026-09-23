import { Logo } from './Logo';
import { Wordmark } from './Wordmark';
import { metalOf } from '../../constants/metal';
import type { CardThemeDef } from '../../constants/theme';
import type { Tier } from '../../types/store';

interface CardFootProps {
  tier: Tier;
  theme: CardThemeDef;
  address: string;
  tagline?: string;
}

/** The dark footer bar every card ends on: coin, wordmark, card address. */
export function CardFoot({ tier, theme, address, tagline }: CardFootProps) {
  return (
    <div
      className="-mx-4 flex items-center gap-2 border-t px-4 py-2"
      style={{ background: theme.dark ? 'rgba(0,0,0,.5)' : 'rgba(14,14,16,.96)', borderColor: metalOf(tier).hair }}
    >
      <Logo size={20} />
      <span className="leading-[1.1]">
        <Wordmark size={12} />
        {tagline && <span className="text-gold-lt/50 mt-0.5 block text-[6.5px] tracking-[0.22em] uppercase">{tagline}</span>}
      </span>
      <span className="font-display text-gold-lt/80 ml-auto text-[9px] tracking-[0.05em] whitespace-nowrap">{address}</span>
    </div>
  );
}
