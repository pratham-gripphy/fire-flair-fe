import { CatIcon, type CatKind } from './CatIcon';
import type { CardThemeDef } from '../../constants/theme';

interface CardMetaProps {
  kind: CatKind;
  label: string;
  value: string;
  theme: CardThemeDef;
  size?: 'sm' | 'md' | 'full';
}

/** One read-only row on a card: icon, label, value — e.g. "Skills: Mixology". */
export function CardMeta({ kind, label, value, theme, size = 'full' }: CardMetaProps) {
  const sm = size === 'sm';
  const md = size === 'md';

  return (
    <div
      className="flex min-w-0 items-center border-b"
      style={{ gap: sm ? 6 : md ? 8 : 9, padding: sm ? '3px 0' : md ? '5px 0' : '6px 0', borderColor: theme.rule }}
    >
      <CatIcon kind={kind} size={sm ? 10 : 13} color={theme.sub} />
      {!sm && (
        <span className="ff-label flex-none" style={{ color: theme.sub, width: md ? 74 : 60, fontSize: md ? 9 : 8, letterSpacing: '.16em' }}>
          {label}
        </span>
      )}
      <span
        className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
        style={{ fontFamily: 'var(--font-serif)', fontSize: sm ? 9 : md ? 14 : 13, color: theme.ink, lineHeight: 1.25 }}
      >
        {value}
      </span>
    </div>
  );
}
