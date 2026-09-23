import { useStore } from "../../../hooks/useStore";
import { useGoTab } from "../../../hooks/useGoTab";
import { useActiveTab } from "../../../hooks/useActiveTab";
import { xpProgress } from "../../../constants/xp";
import { NAV } from "../../../constants/nav";
import type { Tab } from "../../../types/store";
import { Logo } from "../../common/Logo";
import { Wordmark } from "../../common/Wordmark";
import { AddFireFlairMark } from "../../common/AddFireFlairMark";

interface HeaderProps {
  /** Team: "Add FireFlair" for staff not yet connected. Staff: opens the
   *  "Add FireFlair" action sheet. Wired up once those sheets exist. */
  onAdd?: () => void;
  /** Team only: share your FireFlair card. */
  onShare?: () => void;
  /** Opens the XP area (coin button, and the XP progress strip). */
  onXP?: () => void;
}

export function Header({ onAdd, onShare, onXP }: HeaderProps) {
  const { state, dispatch } = useStore();
  const isTeam = state.role === "team";
  const isStaff = state.role === "staff";
  const goTab = useGoTab();
  const activeTab = useActiveTab();

  const basket = isStaff && state.selection.length > 0;
  const xpInfo =
    isTeam && state.profile.live ? xpProgress(state.profile.xp) : null;

  return (
    <header className="ff-lattice sticky top-0 z-40 border-b border-gold-dk bg-gradient-to-b from-onyx to-[#0A0A0B] text-cream">
      <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-4 py-2.5">
        <Logo size={30} />
        <div className="leading-[1.1]">
          <Wordmark size={13} />
          <div className="text-[9px] tracking-[0.2em] text-gold-lt/70 uppercase">
            {isTeam ? "Team" : isStaff ? "Staff" : "Welcome"}
          </div>
        </div>

        {state.role && (
          <nav className="hidden desk:ml-auto desk:flex desk:items-center desk:gap-0.5">
            {NAV.filter((n) => n.key !== "__ff").map((n) => (
              <button
                key={n.key}
                className={`text-[11px] tracking-[0.16em] uppercase desk:border-l desk:border-gold/22 desk:px-3.5 desk:py-2.5 ${
                  activeTab === n.key ? "text-gold-lt" : "text-cream/72"
                }`}
                onClick={() => goTab(n.key as Tab)}
              >
                {n.label}
              </button>
            ))}
            <button
              className="ml-2.5"
              onClick={onXP}
              aria-label="Your FireFlair XP"
            >
              <Logo size={30} />
            </button>
            <button
              onClick={isTeam ? onShare : onAdd}
              aria-label={
                isTeam ? "Share your FireFlair card" : "Add FireFlair"
              }
              className="ml-1.5 flex items-center gap-[7px] text-[11px] tracking-[0.14em] text-gold-lt/80 uppercase"
            >
              Add <AddFireFlairMark size={16} />
            </button>
          </nav>
        )}

        {state.role && (
          <button
            className="ml-auto border border-gold/40 px-2.5 py-[7px] text-[10px] tracking-[0.14em] text-gold-lt/80 uppercase"
            onClick={() =>
              dispatch({ type: "ROLE", role: isTeam ? "staff" : "team" })
            }
          >
            {isTeam ? "FF Staff" : "FF Team"}
          </button>
        )}
      </div>

      {/* Desktop companion row: XP + booking status - the same information
          as the mobile bottom bars, laid out for the header on wide viewports. */}
      {(xpInfo || basket) && (
        <div className="hidden desk:mx-auto desk:flex desk:max-w-[1180px] desk:items-center desk:gap-4 desk:border-t desk:border-gold/18 desk:px-4 desk:py-[9px]">
          {xpInfo && (
            <button
              onClick={onXP}
              className="flex min-w-0 flex-1 items-center gap-2.5"
              aria-label="Your FireFlair XP"
            >
              <Logo size={24} />
              <span className="min-w-0 flex-1">
                <span className="mb-[3px] flex justify-between text-[10px] tracking-[0.1em] text-gold-lt uppercase">
                  <span>{xpInfo.xp} XP</span>
                  <span className="text-cream/55">
                    {xpInfo.next ? `Next: ${xpInfo.next.label}` : "Top tier"}
                  </span>
                </span>
                <span className="ff-xptrack h-[5px]">
                  <span
                    className="ff-xpfill"
                    style={{ width: `${xpInfo.pct}%` }}
                  />
                </span>
              </span>
            </button>
          )}
          {basket && (
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] tracking-[0.1em] text-gold-lt uppercase">
                {state.selection.length} selected
              </span>
              <button
                onClick={() => dispatch({ type: "CLEAR_SELECTION" })}
                className="text-[11px] tracking-[0.08em] text-cream/60 uppercase"
              >
                Clear
              </button>
              <button
                onClick={() => goTab("home")}
                className="border border-gold px-3 py-[7px] text-[10px] tracking-[0.1em] text-gold-lt uppercase"
              >
                Build team
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
