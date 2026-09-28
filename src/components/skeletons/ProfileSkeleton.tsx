import { Skeleton } from "../common/Skeleton";
import { useStore } from "../../hooks/useStore";
import { CARD_W } from "../../constants/cardWidths";
import {
  SkeletonEmpty,
  SkeletonHeading,
  SkeletonPage,
  SkeletonSection,
} from "./SkeletonParts";

/** Profile: the portrait ID card, its actions, the level/tier strip, the AI
 *  nudge and the record sections below - or the empty state before an
 *  account exists. */
export function ProfileSkeleton() {
  const { profile } = useStore().state;

  if (!profile.accountCreated) {
    return (
      <SkeletonPage label="profile">
        <SkeletonEmpty />
      </SkeletonPage>
    );
  }

  return (
    <SkeletonPage label="profile">
      <SkeletonHeading />

      {/* portrait ID card + Edit / Share */}
      <div className="mx-auto w-full max-w-[340px]">
        <div
          className="flex flex-col items-center px-4 pt-7 pb-4"
          style={{ background: "linear-gradient(168deg,#1A1A1D,#0C0C0E)" }}
        >
          <Skeleton dark circle width={94} height={94} />
          <Skeleton dark width="62%" height={17} className="mt-3" />
          <Skeleton dark width="40%" height={12} className="mt-2" />
          <Skeleton dark width={70} height={8} className="mt-2.5" />
          <span className="my-2.5 h-px w-full bg-white/10" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex w-full items-center gap-[9px] py-1.5">
              <Skeleton dark width={13} height={13} />
              <Skeleton dark width={60} height={8} />
              <Skeleton dark height={10} style={{ flex: 1 }} />
            </div>
          ))}
          <Skeleton dark width="50%" height={8} className="mt-3" />
        </div>
        <div className="mt-4 flex gap-3">
          <Skeleton height={44} style={{ flex: 1 }} />
          <Skeleton height={44} style={{ flex: 1 }} />
        </div>
      </div>

      {/* level / tier / contact pills */}
      <div className="ff-frame mt-5 flex flex-wrap items-center gap-2 p-3">
        <Skeleton width={64} height={20} />
        <Skeleton width={96} height={20} />
        <Skeleton width={120} height={20} />
      </div>

      {/* AI completion nudge */}
      <div className="ff-frame my-4 flex flex-col gap-2 p-3.5">
        <div className="flex items-center gap-2.5">
          <Skeleton width={30} height={30} circle />
          <Skeleton width="45%" height={13} />
        </div>
        <Skeleton width="80%" height={10} />
      </div>

      <SkeletonSection />
      <SkeletonSection width={CARD_W.player} tiles={2} />
      <SkeletonSection portrait={false} />
    </SkeletonPage>
  );
}
