import { NAV } from "../../../constants/nav";
import { useStore } from "../../../hooks/useStore";
import { useGoTab } from "../../../hooks/useGoTab";
import { Logo } from "../../common/Logo";
import { NavMark } from "../../common/NavMark";
import type { Tab } from "../../../types/store";

/** Mobile tab bar - hidden at the `desk` breakpoint, where the header's own
 *  nav takes over. Mirrors the same tabs Header exposes on desktop. */
export function BottomNav() {
  const { state } = useStore();
  const goTab = useGoTab();

  return (
    <nav className="ff-lattice fixed inset-x-0 bottom-0 z-50 border-t border-gold bg-gradient-to-b from-[#2A2A2F] to-[#121214] pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-6px_22px_rgba(0,0,0,.45)] desk:hidden">
      <div className="mx-auto grid max-w-[560px] grid-cols-5 items-end">
        {NAV.map((n) =>
          n.key === "__ff" ? (
            <div key="ff" className="flex justify-center">
              <button
                className="text-gold-lt flex -translate-y-4 flex-col items-center gap-[3px] text-[8px] tracking-[0.14em] uppercase"
                onClick={() =>
                  goTab(state.profile.accountCreated ? "profile" : "home")
                }
                aria-label="Your FireFlair card"
              >
                <Logo size={56} />
              </button>
            </div>
          ) : (
            <button
              key={n.key}
              className="relative flex items-center justify-center px-0.5 py-4 text-[#D8D6D0]"
              onClick={() => goTab(n.key as Tab)}
              aria-label={n.label}
              title={n.label}
            >
              <NavMark
                shape={n.mark!}
                size={23}
                tone={state.tab === n.key ? "#EAD79C" : "#D8D6D0"}
              />
              {state.tab === n.key && (
                <span className="bg-gold absolute top-0 left-1/2 h-0.5 w-6 -translate-x-1/2" />
              )}
            </button>
          ),
        )}
      </div>
    </nav>
  );
}
