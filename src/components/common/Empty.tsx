import type { ReactNode } from "react";
import { Corners } from "./Corners";

interface EmptyProps {
  icon: ReactNode;
  title: string;
  badge?: ReactNode;
  action?: ReactNode;
}

/** A framed empty-state panel - used wherever a section has nothing to show yet. */
export function Empty({ icon, title, badge, action }: EmptyProps) {
  return (
    <div className="ff-frame p-7 text-center">
      <Corners />
      <div className="text-gold-mid mb-2.5 flex justify-center">{icon}</div>
      {badge && <div className="mb-2.5 flex justify-center">{badge}</div>}
      <p className="ff-serif mb-3.5 text-[17px] text-[#4A443A]">{title}</p>
      {action}
    </div>
  );
}
