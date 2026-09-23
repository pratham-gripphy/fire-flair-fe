import { Bookmark } from "lucide-react";
import { Empty } from "../../components/common/Empty";
import { Pill } from "../../components/common/Pill";

export function Bookings() {
  return (
    <div className="ff-page">
      <div className="ff-page-narrow">
        <div className="ff-eyebrow">FF Team</div>
        <h1 className="ff-h1 mt-1 mb-3.5">Bookings</h1>
        <Empty
          icon={<Bookmark size={26} />}
          badge={<Pill tone="warn">Coming soon</Pill>}
          title="Shift offers and booking status will live here - when a company requests your availability, it lands here."
        />
      </div>
    </div>
  );
}
