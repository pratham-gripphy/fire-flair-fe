import { useState } from "react";
import {
  Award,
  Camera,
  Check,
  ChefHat,
  Martini,
  Mic,
  Music,
  Plus,
  Send,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { SectionHead } from "../../components/common/SectionHead";
import { HScroll } from "../../components/common/HScroll";
import { CategoryToggle } from "../../components/common/CategoryToggle";
import { Divider } from "../../components/common/Divider";
import { PlayerTile } from "../../components/profile/PlayerTile";
import { PersonSheet } from "../../components/network/PersonSheet";
import { useStore } from "../../hooks/useStore";
import { useGoTab } from "../../hooks/useGoTab";
import { ME_ID, useDirectory } from "../../hooks/useDirectory";
import {
  DIRECTORY,
  PEOPLE_GROUPS,
  type DirectoryPerson,
  type PeopleGroup,
} from "../../constants/directory";
import { CARD_W } from "../../constants/cardWidths";

const GROUP_ICON: Record<PeopleGroup, LucideIcon> = {
  Bartenders: Martini,
  Waiters: Users,
  "DJs & music": Music,
  Hosts: Mic,
  Chefs: ChefHat,
  Photographers: Camera,
  "Your profile": UserRound,
};

const INVITE_TOAST = "Invitations go out by WhatsApp with a link to create a card.";

/* Ranking categories - a config array, not one component per ranking, so a
   new category is a data entry. Each sorts the same directory. */
const RANKINGS: { key: string; label: string; sort: (a: DirectoryPerson, b: DirectoryPerson) => number }[] = [
  {
    key: "top",
    label: "Top Performers This Week",
    sort: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  },
  { key: "reviewed", label: "Most Reviewed", sort: (a, b) => b.reviews - a.reviews },
  { key: "level", label: "Rising Star", sort: (a, b) => b.level - a.level },
];

const sectionIcon = (Icon: LucideIcon) => (
  <Icon size={15} className="text-gold-dk" strokeWidth={1.6} />
);

export function Network() {
  const { state, dispatch } = useStore();
  const goTab = useGoTab();
  const people = useDirectory();
  const [viewing, setViewing] = useState<DirectoryPerson | null>(null);

  const invite = () => dispatch({ type: "TOAST", message: INVITE_TOAST });
  // Your own card opens your profile; anyone else's opens their card.
  const pick = (p: DirectoryPerson) => (p.id === ME_ID ? goTab("profile") : setViewing(p));

  const connected = state.connections
    .map((c) => DIRECTORY.find((p) => p.id === c.id))
    .filter((p): p is DirectoryPerson => !!p);

  const groups = PEOPLE_GROUPS.map((g) => ({
    group: g,
    members: people.filter((p) => p.group === g),
  })).filter((g) => g.members.length > 0);

  return (
    <div className="ff-page">
      <div className="ff-eyebrow">FF Team</div>
      <div className="mt-1 flex items-end gap-2.5">
        <h1 className="ff-h1 flex-1">Network</h1>
        <Button variant="sm" onClick={invite}>
          <Send size={12} /> Invite
        </Button>
      </div>
      <p className="ff-body ff-muted mt-1.5 mb-0 text-xs">
        {people.length} {people.length === 1 ? "person" : "people"} on FireFlair
        {!state.profile.accountCreated && " - create your account to add your own card"}
      </p>

      {connected.length > 0 && (
        <section className="mt-5">
          <SectionHead icon={sectionIcon(Check)} title="Connected" count={connected.length} />
          <HScroll label="Connected">
            {connected.map((p) => (
              <PlayerTile key={p.id} person={p} onClick={() => pick(p)} />
            ))}
          </HScroll>
        </section>
      )}

      {groups.map(({ group, members }) => {
        const key = `network_${group}`;
        return (
          <section key={group} className="mt-5">
            <SectionHead
              icon={sectionIcon(GROUP_ICON[group])}
              title={group}
              count={members.length}
              action={<CategoryToggle sectionKey={key} />}
            />
            {state.categoryVisibility[key] !== false && (
              <HScroll label={group} snap>
                {members.map((p) => (
                  <PlayerTile key={p.id} person={p} onClick={() => pick(p)} />
                ))}
                {group !== "Your profile" && (
                  <button
                    className="ff-card ff-portrait ff-addtile"
                    style={{ width: CARD_W.player }}
                    onClick={invite}
                  >
                    <span className="text-center">
                      <Plus size={20} className="text-gold-dk" />
                      <span className="ff-label mt-1.5 block">Invite</span>
                    </span>
                  </button>
                )}
              </HScroll>
            )}
          </section>
        );
      })}

      <Divider />

      {RANKINGS.map((r) => {
        // Rankings are earned from reviews, so only people with a track record.
        const ranked = [...DIRECTORY].sort(r.sort).slice(0, 8);
        const key = `rank_${r.key}`;
        return (
          <section key={r.key} className="mt-[22px]">
            <SectionHead
              icon={sectionIcon(Award)}
              title={r.label}
              count={ranked.length}
              action={<CategoryToggle sectionKey={key} />}
            />
            {state.categoryVisibility[key] !== false && (
              <HScroll label={r.label} snap>
                {ranked.map((p) => (
                  <PlayerTile key={p.id} person={p} onClick={() => pick(p)} />
                ))}
              </HScroll>
            )}
          </section>
        );
      })}
      <p className="ff-body ff-muted mt-1 text-[11.5px]">
        More rankings - Largest Network, Most Booked, Most Active - arrive as
        that activity data builds up.
      </p>

      <PersonSheet person={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
