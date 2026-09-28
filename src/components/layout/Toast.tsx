import { useEffect } from "react";
import { useStore } from "../../hooks/useStore";

/** A small auto-dismissing banner for one-off confirmations that don't
 *  belong in the page flow (asked for a review, venue tapped, …). */
export function Toast() {
  const { state, dispatch } = useStore();
  const message = state.toast;

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => dispatch({ type: "TOAST", message: null }), 2500);
    return () => clearTimeout(t);
  }, [message, dispatch]);

  if (!message) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[86px] z-50 flex justify-center px-4 desk:bottom-6">
      <div
        className="pointer-events-auto border border-gold-dk bg-onyx px-4 py-2.5 text-center shadow-lg"
        role="status"
      >
        <p className="ff-body m-0 text-[13px] text-cream">{message}</p>
      </div>
    </div>
  );
}
