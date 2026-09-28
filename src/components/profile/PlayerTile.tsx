import { PlayerCard } from "../card/PlayerCard";
import { useStore } from "../../hooks/useStore";
import { CARD_W } from "../../constants/cardWidths";
import type { DirectoryPerson } from "../../constants/directory";

interface PlayerTileProps {
  person: DirectoryPerson;
  selected?: boolean;
  /** Defaults to surfacing who they are via a toast. */
  onClick?: () => void;
}

/** A person's portrait card sized for a horizontal row of people. */
export function PlayerTile({ person, selected, onClick }: PlayerTileProps) {
  const { dispatch } = useStore();

  return (
    <div style={{ width: CARD_W.player }}>
      <PlayerCard
        person={person}
        selected={selected}
        onClick={
          onClick ??
          (() => dispatch({ type: "TOAST", message: `${person.name} · ${person.profession}` }))
        }
      />
    </div>
  );
}
