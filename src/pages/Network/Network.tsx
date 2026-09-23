import { Users } from 'lucide-react';
import { Empty } from '../../components/common/Empty';
import { Pill } from '../../components/common/Pill';

export function Network() {
  return (
    <div className="ff-page">
      <div className="ff-page-narrow">
        <div className="ff-eyebrow">FF Team</div>
        <h1 className="ff-h1 mt-1 mb-3.5">Network</h1>
        <Empty
          icon={<Users size={26} />}
          badge={<Pill tone="warn">Coming soon</Pill>}
          title="Your connections, suggested people and the people you work with will live here."
        />
      </div>
    </div>
  );
}
