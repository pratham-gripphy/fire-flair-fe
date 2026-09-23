import type { ReactNode } from 'react';

interface PillProps {
  children: ReactNode;
  tone?: 'ok' | 'warn' | 'bad' | 'gold' | '';
}

export function Pill({ children, tone = '' }: PillProps) {
  return <span className={`ff-pill ${tone}`.trim()}>{children}</span>;
}
