import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, hint, children }: FieldProps) {
  return (
    <label className="mb-4 block">
      <span className="ff-label mb-1.5 block">{label}</span>
      {children}
      {hint && <span className="ff-body ff-muted mt-1 block text-xs">{hint}</span>}
    </label>
  );
}
