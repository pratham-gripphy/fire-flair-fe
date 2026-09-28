import { Portrait } from "../common/Portrait";
import { useStore } from "../../hooks/useStore";
import { CARD_W } from "../../constants/cardWidths";
import type { DirectoryPerson } from "../../constants/directory";

interface PlayerTileProps {
  person: DirectoryPerson;
}

/** A connection's portrait tile in the Network preview - no person-profile
 *  page exists yet, so tapping just surfaces who they are via a toast. */
export function PlayerTile({ person }: PlayerTileProps) {
  const { dispatch } = useStore();

  return (
    <button
      type="button"
      className="ff-card ff-portrait flex flex-col items-center justify-center gap-2 bg-paper p-3 text-center"
      style={{ width: CARD_W.player }}
      onClick={() =>
        dispatch({ type: "TOAST", message: `${person.name} · ${person.profession}` })
      }
    >
      <Portrait name={person.name} size={64} />
      <span className="font-display block text-[13px] uppercase">{person.name}</span>
      <span className="ff-body ff-muted text-[11px]">{person.profession}</span>
    </button>
  );
}
