import { useState } from "react";
import { Sheet } from "../../common/Sheet";
import { Field } from "../../common/Field";
import { Button } from "../../common/Button";
import { useStore } from "../../../hooks/useStore";
import type { CategoryDef, CategoryField } from "../../../types/store";

interface AddCategorySheetProps {
  open: boolean;
  onClose: () => void;
}

const slugify = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
const singularize = (s: string) => s.trim().replace(/s$/i, "") || "Item";

/** Render this keyed on `open` from the caller, so reopening after a
 *  cancel always starts from a blank form - see ProfileSections. */
export function AddCategorySheet({ open, onClose }: AddCategorySheetProps) {
  const { dispatch } = useStore();
  const [label, setLabel] = useState("");
  const [needsDoc, setNeedsDoc] = useState(false);

  if (!open) return null;

  const key = slugify(label);
  const singular = singularize(label);

  const submit = () => {
    if (!label.trim() || !key) return;
    const fields: CategoryField[] = needsDoc ? ["description", "media", "document"] : ["description", "media"];
    const def: CategoryDef = {
      label: label.trim(),
      singular,
      icon: "skills",
      onCard: false,
      custom: true,
      fields,
      placeholder: singular,
    };
    dispatch({ type: "CATEGORY_ADD", key, def });
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Add a category">
      <Field label="Category name" hint="e.g. Awards, Certifications, Past employers">
        <input
          autoFocus
          className="ff-input"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Awards"
        />
      </Field>

      <label className="mb-4 flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          className="mt-[3px]"
          checked={needsDoc}
          onChange={(e) => setNeedsDoc(e.target.checked)}
        />
        <span className="ff-body text-[13px]">
          Items in this category can carry a document
        </span>
      </label>

      <Button variant="primary wide" disabled={!label.trim()} onClick={submit}>
        Create category
      </Button>
    </Sheet>
  );
}
