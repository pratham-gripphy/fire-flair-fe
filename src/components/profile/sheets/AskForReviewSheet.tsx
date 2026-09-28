import { Sheet } from "../../common/Sheet";
import { Portrait } from "../../common/Portrait";
import { Pill } from "../../common/Pill";
import { Button } from "../../common/Button";
import { useStore } from "../../../hooks/useStore";
import { DIRECTORY, type DirectoryPerson } from "../../../constants/directory";
import type { ReviewRequest } from "../../../types/store";

interface AskForReviewSheetProps {
  open: boolean;
  onClose: () => void;
}

const uid = (p = "req") => `${p}_${Math.random().toString(36).slice(2, 8)}`;

function makeReviewRequest(person: DirectoryPerson): ReviewRequest {
  return { id: uid(), aboutId: "me", fromId: person.id, fromName: person.name, at: Date.now() };
}

export function AskForReviewSheet({ open, onClose }: AskForReviewSheetProps) {
  const { state, dispatch } = useStore();

  if (!open) return null;

  const people = state.connections
    .map((c) => DIRECTORY.find((p) => p.id === c.id))
    .filter((p): p is (typeof DIRECTORY)[number] => !!p);

  const alreadyAsked = (id: string) =>
    state.reviewRequests.some((r) => r.fromId === id && r.aboutId === "me");

  const ask = (person: DirectoryPerson) => {
    dispatch({ type: "REVIEW_REQUEST", request: makeReviewRequest(person) });
  };

  return (
    <Sheet open={open} onClose={onClose} title="Ask for a review">
      {people.length === 0 ? (
        <div className="ff-frame p-4 text-center">
          <p className="ff-body mb-2.5">
            You&apos;re not connected with anyone yet - reviews come from people
            you&apos;ve worked with.
          </p>
          <Button
            variant="ghost wide"
            onClick={() => {
              dispatch({ type: "TOAST", message: "Link copied" });
              onClose();
            }}
          >
            Share my card
          </Button>
        </div>
      ) : (
        <div className="grid gap-2">
          {people.map((p) => (
            <div
              key={p.id}
              className="ff-frame flex items-center gap-2.5 p-2.5"
            >
              <Portrait name={p.name} size={38} />
              <span className="min-w-0 flex-1">
                <span className="font-display block truncate text-[12.5px] uppercase">
                  {p.name}
                </span>
                <span className="ff-body ff-muted block truncate text-[11px]">
                  {p.profession}
                </span>
              </span>
              {alreadyAsked(p.id) ? (
                <Pill tone="gold">Asked</Pill>
              ) : (
                <Button variant="ghost sm" onClick={() => ask(p)}>
                  Ask
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </Sheet>
  );
}
