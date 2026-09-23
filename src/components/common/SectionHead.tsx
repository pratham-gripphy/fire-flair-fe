import type { ReactNode } from 'react';

interface SectionHeadProps {
  icon: ReactNode;
  title: string;
  count?: number;
  action?: ReactNode;
}

export function SectionHead({ icon, title, count, action }: SectionHeadProps) {
  return (
    <div className="ff-secthead">
      {icon}
      <span className="ff-h2">{title}</span>
      {count !== undefined && <span className="ff-pill">{count}</span>}
      <span className="line" />
      {action}
    </div>
  );
}
