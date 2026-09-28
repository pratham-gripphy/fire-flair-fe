import { SkeletonHeading, SkeletonPage, SkeletonSection } from "./SkeletonParts";
import { CARD_W } from "../../constants/cardWidths";

/** Network - heading over rows of people's portrait cards. */
export function NetworkSkeleton() {
  return (
    <SkeletonPage label="network">
      <SkeletonHeading />
      <SkeletonSection tiles={2} width={CARD_W.player} />
      <SkeletonSection tiles={2} width={CARD_W.player} />
    </SkeletonPage>
  );
}
