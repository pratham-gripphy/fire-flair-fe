import type { ReactNode } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

interface NoticeProps {
  tone?: "ok" | "bad";
  children: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

/** An inline, in-page confirmation or error - shown in the flow of the
 *  screen it's about instead of a floating toast popup. */
export function Notice({ tone = "ok", children, onDismiss, className = "" }: NoticeProps) {
  const isBad = tone === "bad";
  const Icon = isBad ? AlertCircle : CheckCircle2;
  const toneColor = isBad ? "text-bad" : "text-ok";

  return (
    <div
      className={`flex items-start gap-2.5 border bg-white p-3 ${isBad ? "border-bad/40" : "border-ok/40"} ${className}`}
      role={isBad ? "alert" : "status"}
    >
      <Icon size={16} className={`mt-0.5 shrink-0 ${toneColor}`} />
      <p className={`ff-body m-0 flex-1 text-[13px] ${toneColor}`}>{children}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 text-[#8A8375] hover:text-ink"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
