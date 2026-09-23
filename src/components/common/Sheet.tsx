import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { Logo } from "./Logo";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/** A bottom sheet on mobile, a centred modal on wider screens - the app's
 *  one dialog primitive. */
export function Sheet({ open, onClose, title, children }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ff-scrim" onClick={onClose}>
      <div
        className="ff-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="ff-sheet-head">
          <Logo size={22} />
          <span className="ff-h2 flex-1">{title}</span>
          <button onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
