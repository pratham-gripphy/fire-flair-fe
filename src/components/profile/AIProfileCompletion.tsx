import { useRef, useState } from "react";
import { Award, Check, Mic } from "lucide-react";
import { Logo } from "../common/Logo";
import { Corners } from "../common/Corners";
import { Button } from "../common/Button";
import { FieldError } from "../common/FieldError";
import { Notice } from "../common/Notice";
import { useStore } from "../../hooks/useStore";
import {
  proposeAnswersFromText,
  SAMPLE_PROMPT,
  type AnswerProposal,
} from "../../constants/proposeAnswers";
import { QUESTIONS } from "../../constants/questions";

interface SpeechRecognitionResultLike {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionResultLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Reuses the FFAI visual language, purpose-built to feed the Question
 *  Cards below. Text, pasted CV, or (where the browser supports it) speech
 *  all funnel into proposeAnswersFromText() - every proposal sits
 *  unconfirmed until the person picks it, so nothing here bypasses the
 *  ANSWER action. This is a dummy/keyword-matching flow, not a live model. */
export function AIProfileCompletion() {
  const { state, dispatch } = useStore();
  const [text, setText] = useState("");
  const [proposals, setProposals] = useState<AnswerProposal[] | null>(null);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [confirmedCount, setConfirmedCount] = useState<number | null>(null);
  const recogRef = useRef<SpeechRecognitionLike | null>(null);

  const questionFor = (qid: string) => QUESTIONS.find((q) => q.id === qid);
  const alreadyAnswered = (qid: string) => {
    const a = state.profile.answers[qid];
    return a !== undefined && a !== "";
  };

  const process = () => {
    const found = proposeAnswersFromText(text).filter(
      (p) => !alreadyAnswered(p.qid),
    );
    setProposals(found);
    setPicked(Object.fromEntries(found.map((p) => [p.qid, true])));
  };

  const confirm = () => {
    if (!proposals) return;
    const chosen = proposals.filter((p) => picked[p.qid]);
    chosen.forEach((p) =>
      dispatch({ type: "ANSWER", qid: p.qid, value: p.value }),
    );
    setConfirmedCount(chosen.length);
    setProposals(null);
    setText("");
    setPicked({});
  };

  const toggleMic = () => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setMicError("Voice input isn't available in this browser.");
      return;
    }
    setMicError(null);
    if (listening) {
      recogRef.current?.stop();
      return;
    }
    const recognition = new Ctor();
    recognition.lang = "en-GB";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText((x) => (x ? `${x} ` : "") + transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recogRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  return (
    <div className="ff-frame ff-lattice my-4 p-3.5">
      <Corners />
      <div className="mb-2.5 flex items-center gap-2.5">
        <Logo size={30} />
        <span className="min-w-0">
          <span className="font-display block text-[13px]">
            Welcome to FireFlair
          </span>
          <span className="ff-body ff-muted text-xs">
            Answer your questions with AI - type, speak, or paste your CV.
          </span>
        </span>
      </div>

      {proposals === null ? (
        <>
          {confirmedCount !== null && (
            <Notice className="mb-2.5" onDismiss={() => setConfirmedCount(null)}>
              {confirmedCount} question{confirmedCount === 1 ? "" : "s"} answered · +
              {confirmedCount} XP
            </Notice>
          )}

          <div className="relative">
            <textarea
              className="ff-input pr-11"
              rows={4}
              placeholder="Tell us about yourself - your experience, kit, availability, where you're based…"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setConfirmedCount(null);
              }}
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
            onClick={() => setText(SAMPLE_PROMPT)}
          >
            Try a sample
          </button>

          <Button
            variant="primary wide"
            disabled={!text.trim()}
            onClick={process}
            className="mt-2.5"
          >
            <Award size={14} /> Find my answers
          </Button>
          <p className="ff-body ff-muted mt-2 mb-0 text-[11px]">
            This can use the info to fill in your Question Cards below - you
            confirm before anything is saved.
          </p>
        </>
      ) : proposals.length === 0 ? (
        <div>
          <p className="ff-body mb-2.5">
            Nothing new in there - try adding a bit more detail, or answer the
            cards directly below.
          </p>
          <Button variant="ghost wide" onClick={() => setProposals(null)}>
            Try again
          </Button>
        </div>
      ) : (
        <div>
          <p className="ff-body mb-2.5">
            Found {proposals.length} answer{proposals.length === 1 ? "" : "s"} -
            pick which to confirm.
          </p>
          {proposals.map((p) => {
            const q = questionFor(p.qid);
            if (!q) return null;
            return (
              <label
                key={p.qid}
                className="ff-frame mb-2 flex cursor-pointer items-start gap-2.5 p-2.5"
              >
                <input
                  type="checkbox"
                  checked={!!picked[p.qid]}
                  className="mt-[3px]"
                  onChange={(e) =>
                    setPicked((x) => ({ ...x, [p.qid]: e.target.checked }))
                  }
                />
                <span>
                  <span className="font-serif block text-sm">{q.text}</span>
                  <span className="ff-body ff-muted text-xs">
                    Proposed: <b>{p.value}</b>
                  </span>
                </span>
              </label>
            );
          })}
          <div className="mt-1 grid grid-cols-2 gap-2">
            <Button
              variant="primary"
              disabled={!Object.values(picked).some(Boolean)}
              onClick={confirm}
            >
              <Check size={13} /> Confirm selected
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
