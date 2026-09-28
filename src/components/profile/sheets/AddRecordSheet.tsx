import { useState } from "react";
import { Sheet } from "../../common/Sheet";
import { Field } from "../../common/Field";
import { Button } from "../../common/Button";
import { useStore } from "../../../hooks/useStore";
import { catHas, makeRecord } from "../../../constants/categories";
import type { CategoryDef } from "../../../types/store";

interface AddRecordSheetProps {
  open: boolean;
  onClose: () => void;
  category: string | null;
  def: CategoryDef | null;
}

/** Render this keyed on `category` from the caller, so switching which
 *  category is being added to (or reopening after a cancel) always starts
 *  from a blank form - see ProfileSections. */
export function AddRecordSheet({ open, onClose, category, def }: AddRecordSheetProps) {
  const { dispatch } = useStore();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  if (!open || !category || !def) return null;

  const submit = () => {
    if (!name.trim()) return;
    const record = { ...makeRecord(category, name), description: desc.trim() };
    dispatch({ type: "REC_ADD", category, record });
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title={`Add ${def.singular.toLowerCase()}`}>
      <Field label={def.singular}>
        <input
          autoFocus
          className="ff-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={def.placeholder}
        />
      </Field>

      {catHas(def, "description") && (
        <Field label="Description">
          <textarea
            className="ff-input"
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </Field>
      )}

      <Button variant="primary wide" disabled={!name.trim()} onClick={submit}>
        Add {def.singular.toLowerCase()}
      </Button>
    </Sheet>
  );
}
