import { useRef, useState } from "react";
import { Camera, ImagePlus, Plus, X } from "lucide-react";
import { HScroll } from "../common/HScroll";
import { SectionHead } from "../common/SectionHead";
import { CategoryToggle } from "../common/CategoryToggle";
import { Button } from "../common/Button";
import { FieldError } from "../common/FieldError";
import { Skeleton } from "../common/Skeleton";
import { useStore } from "../../hooks/useStore";
import { CARD_W } from "../../constants/cardWidths";
import { MAX_MEDIA_BYTES, prettyBytes, readFileAsDataUrl } from "../../utils/files";
import type { MediaItem } from "../../types/store";

const uid = (p = "media") => `${p}_${Math.random().toString(36).slice(2, 8)}`;

/** Photo/video gallery - a small, honest slice of the reference's Media
 *  section: real photo upload (capped so it never blows up localStorage),
 *  video by pasted link only, since there's no upload backend here. */
export function MediaSection() {
  const { state, dispatch } = useStore();
  const media = state.profile.media;
  const [adding, setAdding] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  // photos still being read off disk - each gets a shimmering tile
  const [reading, setReading] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const addPhoto = async (file: File) => {
    if (file.size > MAX_MEDIA_BYTES) {
      setError(`That image is ${prettyBytes(file.size)} - keep it under ${prettyBytes(MAX_MEDIA_BYTES)}.`);
      return;
    }
    setError(null);
    setReading((n) => n + 1);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const item: MediaItem = { id: uid(), kind: "photo", name: file.name, dataUrl };
      dispatch({ type: "MEDIA_ADD", item });
    } catch {
      setError("Couldn't read that image - try another.");
    } finally {
      setReading((n) => n - 1);
    }
  };

  const addVideo = () => {
    const url = videoUrl.trim();
    if (!url) return;
    dispatch({ type: "MEDIA_ADD", item: { id: uid(), kind: "video", url } });
    setVideoUrl("");
  };

  return (
    <section className="mt-[22px]">
      <SectionHead
        icon={<Camera size={15} className="text-gold-dk" strokeWidth={1.6} />}
        title="Media"
        count={media.length}
        action={
          <span className="flex items-center gap-1.5">
            <button
              type="button"
              className="ff-btn sm ghost"
              onClick={() => setAdding((a) => !a)}
            >
              {adding ? "Close" : "Add"}
            </button>
            <CategoryToggle sectionKey="media" />
          </span>
        }
      />

      {state.categoryVisibility.media !== false && (
        <>
          {adding && (
            <div className="ff-frame mb-3 p-3.5">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) addPhoto(f);
                  e.target.value = "";
                }}
              />
              <Button variant="ghost wide" onClick={() => fileRef.current?.click()}>
                <ImagePlus size={14} /> Add a photo
              </Button>
              {error && <FieldError>{error}</FieldError>}

              <div className="mt-2.5 flex gap-2">
                <input
                  className="ff-input"
                  placeholder="Paste a video link"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                <Button variant="ghost" disabled={!videoUrl.trim()} onClick={addVideo}>
                  Add
                </Button>
              </div>
            </div>
          )}

          {media.length === 0 && reading === 0 ? (
            <button
              className="ff-card ff-addtile"
              style={{ width: "100%", padding: 18 }}
              onClick={() => setAdding(true)}
            >
              <span className="text-center">
                <Plus size={18} className="text-gold-dk" />
                <span className="ff-label mt-1.5 block">Add your first photo or video</span>
              </span>
            </button>
          ) : (
            <HScroll label="Media">
              {media.map((m) => (
                <div
                  key={m.id}
                  className="ff-tile relative"
                  style={{ width: CARD_W.tile, minHeight: 110 }}
                >
                  <button
                    aria-label="Remove"
                    className="absolute top-1.5 right-1.5 z-[2] text-[#8A8375] hover:text-ink"
                    onClick={() => dispatch({ type: "MEDIA_DELETE", id: m.id })}
                  >
                    <X size={14} />
                  </button>
                  {m.kind === "photo" ? (
                    <div
                      className="-m-[11px] mb-0 flex-1"
                      style={{
                        minHeight: 96,
                        background: `url("${m.dataUrl}") center/cover`,
                      }}
                    />
                  ) : (
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-1 flex-col items-center justify-center gap-1.5 text-center"
                    >
                      <Camera size={18} className="text-gold-dk" />
                      <span className="ff-body ff-muted truncate text-[10px]">{m.url}</span>
                    </a>
                  )}
                </div>
              ))}
              {Array.from({ length: reading }, (_, i) => (
                <div
                  key={`reading-${i}`}
                  role="status"
                  aria-label="Loading photo"
                  className="ff-tile"
                  style={{ width: CARD_W.tile, minHeight: 110, padding: 0 }}
                >
                  <Skeleton height="100%" style={{ minHeight: 110 }} />
                </div>
              ))}
            </HScroll>
          )}
        </>
      )}
    </section>
  );
}
