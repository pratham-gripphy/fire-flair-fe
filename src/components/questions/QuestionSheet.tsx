import { useState } from "react";
import { Sheet } from "../common/Sheet";
import { Field } from "../common/Field";
import { Button } from "../common/Button";
import { useStore } from "../../hooks/useStore";
import type { Question } from "../../constants/questions";

interface QuestionSheetProps {
  open: boolean;
  question: Question | null;
  onClose: () => void;
}

interface TextAnswerFieldProps {
  question: Question;
  existing?: string;
  onSave: (value: string) => void;
}

/** Keyed by question id in the parent, so switching questions mounts a
 *  fresh instance with its own draft state - no effect needed to resync it. */
function TextAnswerField({ question, existing, onSave }: TextAnswerFieldProps) {
  const [value, setValue] = useState(existing ?? "");
  const isNew = existing === undefined || existing === "";

  return (
    <>
      <Field label="Your answer">
        <textarea
          className="ff-input"
          rows={3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={question.placeholder ?? ""}
        />
      </Field>
      <Button
        variant="primary wide"
        disabled={!value.trim()}
        onClick={() => onSave(value.trim())}
      >
        {isNew ? "Save · +1 XP" : "Save answer"}
      </Button>
    </>
  );
}

export function QuestionSheet({ open, question, onClose }: QuestionSheetProps) {
  const { state, dispatch } = useStore();

  if (!open || !question) return null;

  const existing = state.profile.answers[question.id];
  const isNew = existing === undefined || existing === "";

  const save = (v: string) => {
    dispatch({ type: "ANSWER", qid: question.id, value: v });
    dispatch({
      type: "TOAST",
      toast: isNew ? "Answered · +1 XP" : "Answer updated",
    });
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Question">
      <p className="font-serif mt-0 text-lg leading-[1.35]">{question.text}</p>

      {question.type === "yesno" && (
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={existing === "Yes" ? "primary" : ""}
            onClick={() => save("Yes")}
          >
            Yes
          </Button>
          <Button
            variant={existing === "No" ? "primary" : ""}
            onClick={() => save("No")}
          >
            No
          </Button>
        </div>
      )}

      {question.type === "choice" && (
        <div className="grid gap-2">
          {question.options?.map((o) => (
            <Button
              key={o}
              variant={existing === o ? "primary" : ""}
              onClick={() => save(o)}
            >
              {o}
            </Button>
          ))}
        </div>
      )}

      {question.type === "text" && (
        <TextAnswerField
          key={question.id}
          question={question}
          existing={existing}
          onSave={save}
        />
      )}

      <p className="ff-body ff-muted mt-3.5 mb-0 text-[11.5px]">
        Answers help FireFlair understand your work and match you to
        opportunities. They don&apos;t appear on your public card.
      </p>
    </Sheet>
  );
}
