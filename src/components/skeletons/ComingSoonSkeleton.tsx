import { SkeletonEmpty, SkeletonHeading, SkeletonPage } from "./SkeletonParts";

/** Network and Bookings - heading over a "coming soon" empty panel. */
export function ComingSoonSkeleton({ label }: { label: string }) {
  return (
    <SkeletonPage label={label}>
      <SkeletonHeading />
      <SkeletonEmpty badge />
    </SkeletonPage>
  );
}
