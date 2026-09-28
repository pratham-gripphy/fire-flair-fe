import { Star, UserCheck, UserPlus } from "lucide-react";
import { Sheet } from "../common/Sheet";
import { Button } from "../common/Button";
import { PlayerCard } from "../card/PlayerCard";
import { useStore } from "../../hooks/useStore";
import type { DirectoryPerson } from "../../constants/directory";

interface PersonSheetProps {
  person: DirectoryPerson | null;
  onClose: () => void;
}

/** Someone else's card up close, with the one thing you can do about it
 *  here: add them to (or drop them from) your network. */
export function PersonSheet({ person, onClose }: PersonSheetProps) {
  const { state, dispatch } = useStore();
  if (!person) return null;

  const connected = state.connections.some((c) => c.id === person.id);

  return (
    <Sheet open onClose={onClose} title={person.name}>
      <div className="mx-auto w-full max-w-[260px]">
        <PlayerCard person={person} />
      </div>

      {person.reviews > 0 && (
        <p className="ff-body ff-muted mt-3 mb-0 flex items-center justify-center gap-1.5 text-xs">
          <Star size={13} className="text-gold-dk" strokeWidth={1.7} />
          {person.rating.toFixed(1)} · {person.reviews} reviews
        </p>
      )}

      <div className="mt-4">
        {connected ? (
          <Button
            variant="ghost wide"
            onClick={() => {
              dispatch({ type: "DISCONNECT", id: person.id, name: person.name });
              onClose();
            }}
          >
            <UserCheck size={15} /> Connected · Remove
          </Button>
        ) : (
          <Button
            variant="primary wide"
            onClick={() => {
              dispatch({ type: "CONNECT", id: person.id, name: person.name });
              onClose();
            }}
          >
            <UserPlus size={15} /> Connect
          </Button>
        )}
      </div>
    </Sheet>
  );
}
