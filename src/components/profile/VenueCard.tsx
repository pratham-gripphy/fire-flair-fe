import { MapPin } from "lucide-react";
import { useStore } from "../../hooks/useStore";
import { CARD_W } from "../../constants/cardWidths";
import { CARD_DOMAIN } from "../../constants/theme";
import type { Venue } from "../../constants/directory";

interface VenueCardProps {
  venue: Venue;
}

/** A browse-only venue tile - there's no venues page wired up yet, so
 *  tapping one just surfaces the details via a toast. */
export function VenueCard({ venue }: VenueCardProps) {
  const { dispatch } = useStore();

  return (
    <button
      type="button"
      className="ff-card flex items-center gap-2.5 bg-paper p-3 text-left"
      style={{ width: CARD_W.org }}
      onClick={() =>
        dispatch({ type: "TOAST", message: `${venue.name} · ${venue.kind}, ${venue.area}` })
      }
    >
      <span className="grid h-[46px] w-[46px] flex-none place-items-center border border-gold-dk bg-onyx">
        <MapPin size={18} className="text-gold-lt" strokeWidth={1.6} />
      </span>
      <span className="min-w-0">
        <span className="font-display block truncate text-[13px] uppercase">{venue.name}</span>
        <span className="ff-serif block truncate text-[12px] text-[#6B655A] italic">
          {venue.kind}
        </span>
        <span className="ff-body ff-muted mt-0.5 flex items-center gap-1 text-[10.5px]">
          <MapPin size={10} /> {venue.area}
          <span className="ml-auto">
            {CARD_DOMAIN}/{venue.tag}
          </span>
        </span>
      </span>
    </button>
  );
}
