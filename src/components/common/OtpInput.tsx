import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";

interface OtpInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  autoFocus?: boolean;
}

/** One box per digit - typing advances, backspace steps back, and pasting a
 *  full code fills every box at once. `value` is the joined digit string. */
export function OtpInput({
  length,
  value,
  onChange,
  invalid = false,
  autoFocus = false,
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const focusAt = (i: number) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, i))];
    el?.focus();
    el?.select();
  };

  const setDigit = (i: number, d: string) => {
    const next = [...digits];
    next[i] = d;
    onChange(next.join("").slice(0, length));
  };

  // Fills from box `i` onward - covers paste and SMS autofill, which drop
  // the whole code into a single box.
  const fillFrom = (i: number, raw: string) => {
    const incoming = raw.replace(/\D/g, "");
    if (!incoming) return;
    const next = [...digits];
    for (let k = 0; k < incoming.length && i + k < length; k++) {
      next[i + k] = incoming[k];
    }
    onChange(next.join(""));
    focusAt(i + incoming.length);
  };

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[i]) {
        setDigit(i, "");
      } else if (i > 0) {
        setDigit(i - 1, "");
        focusAt(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(i + 1);
    }
  };

  const onPaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    fillFrom(i, e.clipboardData.getData("text"));
  };

  return (
    <div className="flex gap-2" role="group" aria-label="Verification code">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={`ff-input min-w-0 flex-1 !px-0 text-center text-lg font-semibold ${
            invalid ? "border-bad/50" : ""
          }`}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          autoFocus={autoFocus && i === 0}
          value={d}
          onChange={(e) => {
            let v = e.target.value.replace(/\D/g, "");
            if (!v) return setDigit(i, "");
            // Typed into a filled box without the old digit selected - keep
            // just the new keystroke.
            if (v.length === 2 && d) v = v.replace(d, "");
            if (v.length > 1) return fillFrom(i, v);
            setDigit(i, v);
            focusAt(i + 1);
          }}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={(e) => onPaste(i, e)}
          onFocus={(e) => {
            // Keep the code contiguous - no skipping ahead past an empty box.
            if (i > value.length) return focusAt(value.length);
            e.target.select();
          }}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={invalid}
        />
      ))}
    </div>
  );
}
