import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface FieldErrorProps {
  children: ReactNode;
  className?: string;
}

/** A field-level validation error - sits directly under the input it's
 *  about, paired with the input's own red border. */
export function FieldError({ children, className = "" }: FieldErrorProps) {
  return (
    <p
      role="alert"
      className={`mt-1.5 flex items-start gap-1.5 text-xs text-bad ${className}`}
    >
      <AlertCircle size={13} className="mt-[1px] shrink-0" strokeWidth={2} />
      <span>{children}</span>
    </p>
  );
}
