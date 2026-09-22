import type { CSSProperties, ElementType, MouseEventHandler, ReactNode } from 'react';
import { metalEdge, metalOf } from '../../constants/metal';
import { THEMES, type CardThemeDef } from '../../constants/theme';
import type { Tier } from '../../types/store';
import { Corners } from './Corners';

interface CardFrameProps {
  tier?: Tier;
  theme?: CardThemeDef;
  ratio?: string;
  selected?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  style?: CSSProperties;
  className?: string;
  hair?: boolean;
  corners?: boolean;
  as?: ElementType;
  children?: ReactNode;
}

/** The FireFlair card shell: metallic border, sheen/grain texture, optional
 *  bracket corners. Every card variant (ID card, event card, shift card…)
 *  is built on top of this. */
export function CardFrame({
  tier = 'standard',
  theme,
  ratio,
  selected,
  onClick,
  style,
  className = '',
  hair = true,
  corners = false,
  as: Tag = 'div',
  children,
}: CardFrameProps) {
  const t = theme ?? THEMES.onyx;
  const m = metalOf(tier);

  const frameStyle: CSSProperties & Record<string, string | number | undefined> = {
    backgroundImage: `${t.bg}, ${metalEdge(tier)}`,
    aspectRatio: ratio,
    cursor: onClick ? 'pointer' : undefined,
    border: '1px solid transparent',
    '--deck-hair': m.hair,
    ...style,
  };

  return (
    <Tag
      className={`ff-deck ${t.dark ? '' : 'lite'} ${selected ? 'ff-sel' : ''} ${className}`.trim()}
      onClick={onClick}
      style={frameStyle}
    >
      <span className="fx sheen" />
      <span className="fx grain" />
      {hair && <span className="fx hair" />}
      {corners && <Corners />}
      {children}
    </Tag>
  );
}
