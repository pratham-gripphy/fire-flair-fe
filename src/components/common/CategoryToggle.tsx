import { useStore } from "../../hooks/useStore";

interface CategoryToggleProps {
  sectionKey: string;
}

/** Collapses a section's body without ever deleting the data behind it -
 *  a missing key in categoryVisibility means visible. */
export function CategoryToggle({ sectionKey }: CategoryToggleProps) {
  const { state, dispatch } = useStore();
  const visible = state.categoryVisibility[sectionKey] !== false;

  return (
    <button
      type="button"
      aria-label={visible ? "Collapse section" : "Expand section"}
      aria-expanded={visible}
      onClick={() =>
        dispatch({ type: "TOGGLE_CATEGORY", key: sectionKey, visible: !visible })
      }
      className="grid h-[26px] w-[26px] flex-none place-items-center border"
      style={{
        borderColor: "var(--color-gold-dk)",
        background: visible ? "rgba(201,162,39,.08)" : "transparent",
      }}
    >
      <svg
        width="10"
        height="9"
        viewBox="0 0 10 9"
        style={{ transform: visible ? undefined : "rotate(-90deg)" }}
      >
        <path d="M0 2 L10 2 L5 9 Z" fill="var(--color-gold-dk)" />
      </svg>
    </button>
  );
}
