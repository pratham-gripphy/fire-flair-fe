import { Children, type ReactNode } from 'react';

interface HScrollProps {
  children: ReactNode;
  label: string;
  snap?: boolean;
}

/** A horizontally-scrolling row of cards, hidden scrollbar, edge-to-edge on mobile. */
export function HScroll({ children, label, snap }: HScrollProps) {
  const items = Children.toArray(children);
  return (
    <div className={`ff-hscroll${snap ? ' snapmand' : ''}`} aria-label={label}>
      {items.map((child, i) => (
        <div className="ff-hitem" key={i}>
          {child}
        </div>
      ))}
    </div>
  );
}
