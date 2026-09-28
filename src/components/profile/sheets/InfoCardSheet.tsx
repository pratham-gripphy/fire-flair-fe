import { useRef, useState } from "react";
import { FileText, Paperclip, Plus, X } from "lucide-react";
import { Sheet } from "../../common/Sheet";
import { Field } from "../../common/Field";
import { Button } from "../../common/Button";
import { FieldError } from "../../common/FieldError";
import { Divider } from "../../common/Divider";
import { Skeleton } from "../../common/Skeleton";
import { useStore } from "../../../hooks/useStore";
import { catHas, PROFICIENCY } from "../../../constants/categories";
import { MAX_MEDIA_BYTES, prettyBytes, readFileAsDataUrl } from "../../../utils/files";
import type { CategoryDef, InfoRecord } from "../../../types/store";

interface InfoCardSheetProps {
  open: boolean;
  record: InfoRecord | null;
  def: CategoryDef | null;
  category: string | null;
  onClose: () => void;
  readOnly?: boolean;
}

const uid = (p = "media") => `${p}_${Math.random().toString(36).slice(2, 8)}`;

export function InfoCardSheet({ open, record, def, category, onClose, readOnly }: InfoCardSheetProps) {
  const { dispatch } = useStore();
  const [draft, setDraft] = useState<InfoRecord | null>(record);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [docError, setDocError] = useState<string | null>(null);
  // uploads still being read off disk - shown as shimmering placeholders
  const [readingMedia, setReadingMedia] = useState(0);
  const [readingDoc, setReadingDoc] = useState(false);
  const mediaRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);

  if (!open || !record || !def || !category || !draft) return null;

  const patch = (p: Partial<InfoRecord>) => {
    setDraft((d) => (d ? { ...d, ...p } : d));
    if (!readOnly) dispatch({ type: "REC_PATCH", category, id: record.id, patch: p });
  };

  const addMedia = async (file: File) => {
    if (file.size > MAX_MEDIA_BYTES) {
      setMediaError(`That image is ${prettyBytes(file.size)} - keep it under ${prettyBytes(MAX_MEDIA_BYTES)}.`);
      return;
    }
    setMediaError(null);
    setReadingMedia((n) => n + 1);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      patch({ media: [...draft.media, { id: uid(), name: file.name, dataUrl }] });
    } catch {
      setMediaError("Couldn't read that image - try another.");
    } finally {
      setReadingMedia((n) => n - 1);
    }
  };

  const addDocument = async (file: File) => {
    setDocError(null);
    if (file.size > MAX_MEDIA_BYTES) {
      patch({ document: { name: file.name, size: file.size, type: file.type, dataUrl: null } });
      setDocError("That file's too big to preview here - it's attached, but can't be reopened in this demo.");
      return;
    }
    setReadingDoc(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      patch({ document: { name: file.name, size: file.size, type: file.type, dataUrl } });
    } catch {
      setDocError("Couldn't read that file - try another.");
    } finally {
      setReadingDoc(false);
    }
  };

  const del = () => {
    if (readOnly) return;
    dispatch({ type: "REC_DELETE", category, id: record.id });
    onClose();
  };

  const cardLimit = def.cardLimit ?? 3;
  const supportingLabel = def.singular === "Qualification" ? "Supporting detail" : "Description";

  return (
    <Sheet open={open} onClose={onClose} title={def.label}>
      <Field label={def.singular}>
        {readOnly ? (
          <p className="font-display m-0 text-[15px] uppercase">{draft.name}</p>
        ) : (
          <input
            className="ff-input"
            value={draft.name}
            onChange={(e) => patch({ name: e.target.value })}
          />
        )}
      </Field>

      {catHas(def, "proficiency") && (
        <Field label="Proficiency">
          {readOnly ? (
            <p className="ff-body m-0">{draft.proficiency || "-"}</p>
          ) : (
            <select
              className="ff-input"
              value={draft.proficiency}
              onChange={(e) => patch({ proficiency: e.target.value })}
            >
              <option value="">Choose one</option>
              {PROFICIENCY.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          )}
        </Field>
      )}

      {catHas(def, "description") && (
        <Field label={supportingLabel}>
          {readOnly ? (
            <p className="ff-serif m-0 text-[15px] italic">{draft.description || "No description yet."}</p>
          ) : (
            <textarea
              className="ff-input"
              rows={3}
              value={draft.description}
              onChange={(e) => patch({ description: e.target.value })}
            />
          )}
        </Field>
      )}

      {catHas(def, "media") && (
        <Field label="Images">
          <div className="mb-2 flex flex-wrap gap-2">
            {draft.media.map((m) => (
              <div key={m.id} className="relative h-[84px] w-[84px] flex-none">
                <img
                  src={m.dataUrl}
                  alt={m.name}
                  className="h-full w-full border border-gold-dk/30 object-cover"
                />
                {!readOnly && (
                  <button
                    aria-label="Remove image"
                    className="absolute top-1 right-1 grid h-5 w-5 place-items-center bg-onyx/80 text-cream"
                    onClick={() => patch({ media: draft.media.filter((x) => x.id !== m.id) })}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
            {Array.from({ length: readingMedia }, (_, i) => (
              <span key={`reading-${i}`} role="status" aria-label="Loading image">
                <Skeleton width={84} height={84} />
              </span>
            ))}
          </div>
          {!readOnly && (
            <>
              <input
                ref={mediaRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) addMedia(f);
                  e.target.value = "";
                }}
              />
              <Button variant="ghost wide" onClick={() => mediaRef.current?.click()}>
                <Plus size={13} /> {draft.media.length ? "Add another image" : "Add an image"}
              </Button>
              {mediaError && <FieldError>{mediaError}</FieldError>}
            </>
          )}
        </Field>
      )}

      {catHas(def, "document") && (
        <Field label="Document">
          {readingDoc ? (
            <div
              role="status"
              aria-label="Loading document"
              className="ff-frame mb-2 flex items-center gap-2.5 p-2.5"
            >
              <Skeleton width={36} height={36} />
              <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton width="60%" height={11} />
                <Skeleton width="35%" height={9} />
              </span>
            </div>
          ) : draft.document ? (
            <div className="ff-frame mb-2 flex items-center gap-2.5 p-2.5">
              <span
                className="grid h-9 w-9 flex-none place-items-center"
                style={{ background: "#5C1220" }}
              >
                <FileText size={16} className="text-cream" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px]">{draft.document.name}</span>
                <span className="ff-body ff-muted block text-[10.5px]">
                  {prettyBytes(draft.document.size)} · awaiting verification
                </span>
              </span>
            </div>
          ) : (
            <p className="ff-body ff-muted mb-2 text-[12.5px]">No document attached.</p>
          )}
          {!readOnly && (
            <div className="grid grid-cols-2 gap-2">
              {draft.document?.dataUrl && (
                <a
                  href={draft.document.dataUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ff-btn ghost sm text-center"
                >
                  Open PDF
                </a>
              )}
              <input
                ref={docRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) addDocument(f);
                  e.target.value = "";
                }}
              />
              <Button variant="ghost sm" onClick={() => docRef.current?.click()}>
                <Paperclip size={12} /> {draft.document ? "Replace" : "Upload PDF"}
              </Button>
              {draft.document && (
                <Button variant="ghost sm" onClick={() => patch({ document: null })}>
                  Remove
                </Button>
              )}
            </div>
          )}
          {docError && <FieldError>{docError}</FieldError>}
        </Field>
      )}

      {!readOnly && (
        <>
          <Divider />
          {def.onCard && (
            <label className="mb-4 flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                className="mt-[3px]"
                checked={draft.primary}
                onChange={(e) => {
                  const primary = e.target.checked;
                  // Optimistic: reflects the tap immediately even though
                  // REC_PRIMARY enforces cardLimit and may refuse it (with
                  // a toast) - reopening the sheet shows the real state.
                  setDraft((d) => (d ? { ...d, primary } : d));
                  dispatch({ type: "REC_PRIMARY", category, id: record.id, primary });
                }}
              />
              <span>
                <span className="ff-body block text-[13px]">Show on my Profile Card</span>
                <span className="ff-body ff-muted block text-[11.5px]">
                  The card shows up to {cardLimit} {def.label.toLowerCase()}. Your profile keeps them all.
                </span>
              </span>
            </label>
          )}
          <Button variant="danger wide" onClick={del}>
            Delete this {def.singular.toLowerCase()}
          </Button>
        </>
      )}
    </Sheet>
  );
}
