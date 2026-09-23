import { Logo } from '../common/Logo';
import type { FeedItem } from '../../constants/feed';

interface FeedCardProps {
  item: FeedItem;
  kind: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function FeedCard({ item, kind, actionLabel, onAction }: FeedCardProps) {
  return (
    <div className="ff-tile dark flex min-h-[138px] w-[clamp(230px,74vw,272px)] flex-col gap-[7px]">
      <div className="flex items-center gap-2">
        <span className="ff-label text-[7px] tracking-[0.2em]" style={{ color: '#D9BE68' }}>
          {kind}
        </span>
        <span className="ml-auto">
          <Logo size={18} />
        </span>
      </div>
      <span className="font-display text-[14px] leading-[1.25]" style={{ color: '#F2ECE0' }}>
        {item.title}
      </span>
      <span className="font-serif text-[12.5px]" style={{ color: 'rgba(242,236,224,.7)' }}>
        {item.when} · {item.where}
      </span>
      <span className="ff-body text-[11.5px] leading-[1.35]" style={{ color: 'rgba(242,236,224,.6)' }}>
        {item.note}
      </span>
      {actionLabel && (
        <button onClick={onAction} className="text-gold-lt border-gold mt-auto border px-2.5 py-2 text-[10px] tracking-[0.12em] uppercase">
          {actionLabel}
          {item.spaces ? ` · ${item.spaces} spaces` : ''}
        </button>
      )}
    </div>
  );
}
