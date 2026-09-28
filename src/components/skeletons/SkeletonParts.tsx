import type { ReactNode } from "react";
import { Skeleton } from "../common/Skeleton";
import { CARD_W } from "../../constants/cardWidths";

/** Outer wrapper for every page skeleton - one polite "Loading" for screen
 *  readers, the same ff-page/ff-page-narrow frame the real pages use. */
export function SkeletonPage({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="ff-page" role="status" aria-live="polite">
      <span className="sr-only">Loading {label}…</span>
      <div className="ff-page-narrow">{children}</div>
    </div>
  );
}

/** The eyebrow + h1 pair most pages open with. */
export function SkeletonHeading() {
  return (
    <>
      <Skeleton width={70} height={10} />
      <Skeleton width="min(240px, 60%)" height={26} className="mt-2 mb-3.5" />
    </>
  );
}

/** A section heading (icon, title, rule) followed by a row of tiles. */
export function SkeletonSection({
  tiles = 3,
  width = CARD_W.info,
  portrait = true,
}: {
  tiles?: number;
  width?: string;
  portrait?: boolean;
}) {
  return (
    <section className="mt-[22px]">
      <div className="ff-secthead">
        <Skeleton width={15} height={15} />
        <Skeleton width={110} height={15} />
        <span className="line" />
        <Skeleton width={46} height={24} />
      </div>
      <div className="flex gap-2.5 overflow-hidden">
        {Array.from({ length: tiles }, (_, i) => (
          <div
            key={i}
            className={`ff-tile flex-none ${portrait ? "ff-portrait" : ""}`}
            style={{ width, minHeight: portrait ? undefined : 110 }}
          >
            <Skeleton width="60%" height={11} />
            <Skeleton width="85%" height={9} />
            <Skeleton width="45%" height={9} />
          </div>
        ))}
      </div>
    </section>
  );
}

/** A framed empty-state panel, shaped like common/Empty. */
export function SkeletonEmpty({ badge }: { badge?: boolean }) {
  return (
    <div className="ff-frame flex flex-col items-center gap-2.5 p-7">
      <Skeleton width={26} height={26} circle />
      {badge && <Skeleton width={96} height={20} />}
      <Skeleton width="min(360px, 85%)" height={14} className="mt-1" />
      <Skeleton width="min(260px, 60%)" height={14} />
    </div>
  );
}
