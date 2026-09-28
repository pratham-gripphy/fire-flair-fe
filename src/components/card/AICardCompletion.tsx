import { useState } from "react";
import { Award, Check, Mic } from "lucide-react";
import { Logo } from "../common/Logo";
import { Corners } from "../common/Corners";
import { Button } from "../common/Button";
import { FieldError } from "../common/FieldError";
import { useSpeechToText } from "../../hooks/useSpeechToText";
import {
  proposeProfileFromText,
  SAMPLE_PROFILE_PROMPT,
  type ProfileProposal,
} from "../../constants/proposeProfile";
import type { ProfileDraft } from "../../types/store";

interface AICardCompletionProps {
  /** Applies the picked fields to the card draft. */
  onApply: (patch: Partial<ProfileDraft>) => void;
  /** Bails out to the blank, hand-typed card. */
  onSwitchToManual: () => void;
}

/** First-time entry point for building the card with AI instead of typing
 *  it in by hand. Text, pasted CV, or speech funnel into
 *  proposeProfileFromText() - every proposal sits unconfirmed until the
 *  person picks it, so nothing here bypasses their review. This is a
 *  dummy/keyword-matching flow, not a live model (see proposeProfile.ts). */
export function AICardCompletion({ onApply, onSwitchToManual }: AICardCompletionProps) {
  const [text, setText] = useState("");
  const [proposals, setProposals] = useState<ProfileProposal[] | null>(null);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const { listening, error: micError, toggle: toggleMic } = useSpeechToText(
    (transcript) => setText((x) => (x ? `${x} ` : "") + transcript),
  );

  const process = () => {
    const found = proposeProfileFromText(text);
    setProposals(found);
    setPicked(Object.fromEntries(found.map((p) => [p.field, true])));
  };

  const confirm = () => {
    if (!proposals) return;
    const patch: Partial<ProfileDraft> = {};
    proposals
      .filter((p) => picked[p.field])
      .forEach((p) => {
        if (p.field === "name") patch.name = p.values[0];
        else (patch as Record<string, string[]>)[p.field] = p.values;
      });
    onApply(patch);
  };

  return (
    <div className="ff-frame ff-lattice p-3.5">
      <Corners />
      <div className="mb-2.5 flex items-center gap-2.5">
        <Logo size={30} />
        <span className="min-w-0">
          <span className="font-display block text-[13px]">
            Let AI build your card
          </span>
          <span className="ff-body ff-muted text-xs">
            Type, speak, or paste a bio - we&apos;ll draft the card for you to
            confirm.
          </span>
        </span>
      </div>

      {proposals === null ? (
        <>
          <div className="relative">
            <textarea
              className="ff-input pr-11"
              rows={5}
              placeholder="Tell us who you are - your name, what you do, your skills, where you're based…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={toggleMic}
              aria-label={listening ? "Stop listening" : "Answer by voice"}
              className="absolute top-2 right-2 p-1"
              style={{
                color: listening ? "var(--color-bad)" : "var(--color-gold-dk)",
              }}
            >
              <Mic size={18} />
            </button>
          </div>
          {micError && <FieldError>{micError}</FieldError>}

          <button
            type="button"
            className="ff-label mt-2 underline underline-offset-2"
            onClick={() => setText(SAMPLE_PROFILE_PROMPT)}
          >
            Try a sample
          </button>

          <Button
            variant="primary wide"
            disabled={!text.trim()}
            onClick={process}
            className="mt-2.5"
          >
            <Award size={14} /> Build my card
          </Button>

          <button
            type="button"
            className="ff-body ff-muted mt-3 w-full text-center text-xs tracking-[0.1em] uppercase underline underline-offset-2"
            onClick={onSwitchToManual}
          >
            Enter it manually instead
          </button>
        </>
      ) : proposals.length === 0 ? (
        <div>
          <p className="ff-body mb-2.5">
            Couldn&apos;t find much in there - try adding more detail, or
            build the card by hand.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="ghost" onClick={() => setProposals(null)}>
              Try again
            </Button>
            <Button variant="primary" onClick={onSwitchToManual}>
              Build manually
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="ff-body mb-2.5">
            Found {proposals.length} thing{proposals.length === 1 ? "" : "s"}{" "}
            for your card - pick what to keep.
          </p>
          {proposals.map((p) => (
            <label
              key={p.field}
              className="ff-frame mb-2 flex cursor-pointer items-start gap-2.5 p-2.5"
            >
              <input
                type="checkbox"
                checked={!!picked[p.field]}
                className="mt-[3px]"
                onChange={(e) =>
                  setPicked((x) => ({ ...x, [p.field]: e.target.checked }))
                }
              />
              <span>
                <span className="font-serif block text-sm">{p.label}</span>
                <span className="ff-body ff-muted text-xs">
                  {p.values.join(", ")}
                </span>
              </span>
            </label>
          ))}
          <div className="mt-1 grid grid-cols-2 gap-2">
            <Button
              variant="primary"
              disabled={!Object.values(picked).some(Boolean)}
              onClick={confirm}
            >
              <Check size={13} /> Use these on my card
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setProposals(null);
                setText("");
              }}
            >
              Discard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
