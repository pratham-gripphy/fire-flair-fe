import { Skeleton } from "../common/Skeleton";
import { useStore } from "../../hooks/useStore";
import { SkeletonHeading, SkeletonPage } from "./SkeletonParts";

/** Home is either the dashboard (account exists) or the card-building
 *  flow - shimmer whichever one is about to appear. */
export function HomeSkeleton() {
  const { profile } = useStore().state;

  if (!profile.accountCreated) {
    return (
      <SkeletonPage label="home">
        <div className="ff-frame flex flex-col items-center gap-3 p-8">
          <Skeleton width={56} height={56} circle />
          <Skeleton width={120} height={14} />
          <Skeleton width="min(300px, 80%)" height={26} />
          <Skeleton width="min(220px, 60%)" height={26} />
          <Skeleton width="min(380px, 90%)" height={14} className="mt-1" />
        </div>
        <Skeleton height={44} className="mt-4" />
      </SkeletonPage>
    );
  }

  return (
    <SkeletonPage label="home">
      <SkeletonHeading />

      {/* landscape card */}
      <div
        className="flex items-center gap-3 px-3 py-3.5"
        style={{ background: "linear-gradient(168deg,#1A1A1D,#0C0C0E)" }}
      >
        <Skeleton dark circle width={52} height={52} />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton dark width="55%" height={13} />
          <Skeleton dark width="75%" height={10} />
          <Skeleton dark width="40%" height={9} />
        </div>
      </div>

      {/* stat tiles */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="ff-frame px-3 py-2.5">
            <Skeleton width={26} height={22} />
            <Skeleton width="70%" height={9} className="mt-2" />
          </div>
        ))}
      </div>

      {/* "complete your card" nudge */}
      <div className="ff-frame mt-5 flex items-start gap-3 p-3.5">
        <Skeleton width={17} height={17} circle />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton width="85%" height={11} />
          <Skeleton width={110} height={9} />
        </div>
      </div>
    </SkeletonPage>
  );
}
