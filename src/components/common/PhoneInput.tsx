import { useEffect, useMemo, useRef, useState, type SVGProps } from "react";
import { ChevronDown, Search } from "lucide-react";
import * as FlagIcons from "country-flag-icons/react/3x2";
import { COUNTRIES, type Country } from "../../constants/countries";

interface PhoneInputProps {
  country: Country;
  onCountryChange: (country: Country) => void;
  number: string;
  onNumberChange: (value: string) => void;
  placeholder?: string;
  invalid?: boolean;
}

type FlagComponent = (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
const FLAGS = FlagIcons as unknown as Record<string, FlagComponent>;

/** An actual SVG flag rather than the flag emoji - Windows Chromium (and
 *  some headless setups) render the emoji as bare ISO-code text instead
 *  of a flag, so this is the only reliable cross-platform option. */
function Flag({ code, className }: { code: string; className?: string }) {
  const Icon = FLAGS[code];
  if (!Icon) return <span className={`${className} bg-gold/10`} />;
  return <Icon className={className} aria-hidden="true" />;
}

function matchesQuery(c: Country, query: string): boolean {
  if (!query) return true;
  if (c.name.toLowerCase().includes(query)) return true;
  if (c.code.toLowerCase().includes(query)) return true;
  const needleDigits = query.replace(/\D/g, "");
  return needleDigits.length > 0 && c.dial.replace("+", "").includes(needleDigits);
}

/** A phone field with a dial-code prefix - tap the flag to pick a different
 *  country from a searchable list, the digits themselves live in a plain
 *  text input beside it. */
export function PhoneInput({
  country,
  onCountryChange,
  number,
  onNumberChange,
  placeholder = "7700 900000",
  invalid = false,
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COUNTRIES.filter((c) => matchesQuery(c, q));
  }, [query]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (c: Country) => {
    onCountryChange(c);
    setOpen(false);
  };

  return (
    <div className="flex items-stretch gap-2">
      <div className="relative shrink-0" ref={rootRef}>
        <button
          type="button"
          onClick={() => {
            setOpen((o) => !o);
            setQuery("");
          }}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Choose country code"
          className={`hover:bg-gold/8 flex h-full cursor-pointer items-center gap-1.5 border bg-white px-2.5 py-[13px] text-[15px] text-ink ${
            invalid ? "border-bad/50" : "border-gold-dk/30"
          }`}
        >
          <Flag code={country.code} className="aspect-[3/2] w-5 shrink-0 rounded-[1px]" />
          <span>{country.dial}</span>
          <ChevronDown
            size={13}
            className={`text-gold-dk transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="ff-frame absolute top-[calc(100%+6px)] left-0 z-20 flex w-72 flex-col overflow-hidden">
            <div className="border-gold-dk/20 relative border-b p-2">
              <Search
                size={13}
                className="pointer-events-none absolute top-1/2 left-4.5 -translate-y-1/2 text-[#A9A296]"
              />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && filtered.length > 0) {
                    choose(filtered[0]);
                  }
                }}
                placeholder="Search country or code"
                className="border-gold-dk/25 focus:border-gold w-full border bg-white py-2 pr-2.5 pl-7 text-[13px] text-ink outline-none placeholder:text-[#A9A296]"
              />
            </div>

            <ul
              role="listbox"
              aria-label="Country code"
              className="max-h-56 overflow-y-auto p-1"
            >
              {filtered.length === 0 && (
                <li className="px-2.5 py-4 text-center text-[12px] text-[#8A8375]">
                  No countries match &ldquo;{query}&rdquo;.
                </li>
              )}
              {filtered.map((c) => (
                <li key={c.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={c.code === country.code}
                    onClick={() => choose(c)}
                    className={`hover:bg-gold/10 flex w-full cursor-pointer items-center gap-2 px-2.5 py-2 text-left text-[13px] ${
                      c.code === country.code ? "bg-gold/15" : ""
                    }`}
                  >
                    <Flag code={c.code} className="aspect-[3/2] w-5 shrink-0 rounded-[1px]" />
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="text-gold-dk shrink-0">{c.dial}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <input
        className={`ff-input ${invalid ? "border-bad/50" : ""}`}
        type="tel"
        inputMode="numeric"
        placeholder={placeholder}
        value={number}
        onChange={(e) => onNumberChange(e.target.value.replace(/\D/g, ""))}
        aria-invalid={invalid}
      />
    </div>
  );
}
