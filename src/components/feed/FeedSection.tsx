import type { ReactNode } from 'react';
import { SectionHead } from '../common/SectionHead';
import { HScroll } from '../common/HScroll';
import { FeedCard } from './FeedCard';
import type { FeedItem } from '../../constants/feed';

interface FeedSectionProps {
  title: string;
  icon: ReactNode;
  items: FeedItem[];
  kind: string;
  actionLabel: string;
  onAction?: (item: FeedItem) => void;
}

export function FeedSection({ title, icon, items, kind, actionLabel, onAction }: FeedSectionProps) {
  if (!items.length) return null;
  return (
    <section className="mt-[22px]">
      <SectionHead icon={icon} title={title} count={items.length} />
      <HScroll label={title}>
        {items.map((item) => (
          <FeedCard key={item.id} item={item} kind={kind} actionLabel={actionLabel} onAction={() => onAction?.(item)} />
        ))}
      </HScroll>
    </section>
  );
}
