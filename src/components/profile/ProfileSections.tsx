import { useState } from "react";
import { Award, Clock, MapPin, Plus, Users } from "lucide-react";
import { SectionHead } from "../common/SectionHead";
import { HScroll } from "../common/HScroll";
import { CategoryToggle } from "../common/CategoryToggle";
import { CatIcon } from "../common/CatIcon";
import { Button } from "../common/Button";
import { QuestionCardsCollection } from "../questions/QuestionCardsCollection";
import { InformationCard } from "./InformationCard";
import { PlayerTile } from "./PlayerTile";
import { VenueCard } from "./VenueCard";
import { MediaSection } from "./MediaSection";
import { AddRecordSheet } from "./sheets/AddRecordSheet";
import { AddCategorySheet } from "./sheets/AddCategorySheet";
import { AskForReviewSheet } from "./sheets/AskForReviewSheet";
import { InfoCardSheet } from "./sheets/InfoCardSheet";
import { useStore } from "../../hooks/useStore";
import { useGoTab } from "../../hooks/useGoTab";
import {
  allCategories,
  categoryOrder,
  makeRecord,
  recsOf,
} from "../../constants/categories";
import { DIRECTORY, VENUES } from "../../constants/directory";
import { CARD_W } from "../../constants/cardWidths";
import type { CategoryDef, InfoRecord } from "../../types/store";

interface OpenRecord {
  record: InfoRecord;
  def: CategoryDef;
  category: string;
}

/** Synthesizes reviews received about "me" into the same InfoRecord shape
 *  as everything else, so they render through the same InformationCard /
 *  InfoCardSheet as the rest of the profile. */
function reviewRecords(reviews: { id: string; byName: string; rating: number; text: string; at: number }[]): InfoRecord[] {
  return [...reviews]
    .sort((a, b) => b.at - a.at)
    .map((r) => ({
      ...makeRecord("reviews", `${r.rating}★ from ${r.byName}`),
      id: r.id,
      description: r.text,
      primary: true,
      readOnly: true,
    }));
}

/** Everything below the Profile Card - the depth behind its flat chip
 *  summary. Always the owner's own view; there's no "viewing someone
 *  else's profile" route in this app. */
export function ProfileSections() {
  const { state } = useStore();
  const goTab = useGoTab();
  const profile = state.profile;

  const [openRec, setOpenRec] = useState<OpenRecord | null>(null);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [addingCat, setAddingCat] = useState(false);
  const [asking, setAsking] = useState(false);

  const cats = allCategories(profile);
  const order = categoryOrder(profile).filter((k) => !cats[k].system);

  const reviewList = reviewRecords(state.reviews.filter((r) => r.aboutId === "me"));
  const pendingRequests = state.reviewRequests.filter(
    (r) => r.aboutId === "me" && !state.reviews.some((rv) => rv.aboutId === "me" && rv.byId === r.fromId),
  );

  const network = state.connections
    .map((c) => DIRECTORY.find((p) => p.id === c.id))
    .filter((p): p is (typeof DIRECTORY)[number] => !!p);

  const venues = VENUES.slice(0, 5);

  const renderCategorySection = (catKey: string) => {
    const def = cats[catKey];
    if (!def) return null;
    const list = recsOf(profile, catKey);
    const onCardCount = list.filter((r) => r.primary).length;

    return (
      <section key={catKey} className="mt-[22px]">
        <SectionHead
          icon={<CatIcon kind={def.icon} size={15} color="var(--color-gold-dk)" />}
          title={def.label}
          count={list.length}
          action={
            !def.system ? (
              <button className="ff-btn sm ghost" onClick={() => setAddingTo(catKey)}>
                Add
              </button>
            ) : null
          }
        />
        {def.onCard && (
          <p className="ff-body ff-muted -mt-1 mb-2" style={{ fontSize: 11.5 }}>
            {onCardCount} of {def.cardLimit} showing on your card · {list.length} on your profile
          </p>
        )}
        {list.length ? (
          <HScroll label={def.label}>
            {list.map((r) => (
              <InformationCard
                key={r.id}
                record={r}
                def={def}
                themeKey={profile.cardShade}
                onClick={() => setOpenRec({ record: r, def, category: catKey })}
              />
            ))}
            {!def.system && (
              <button
                className="ff-card ff-portrait ff-addtile"
                style={{ width: CARD_W.info }}
                onClick={() => setAddingTo(catKey)}
              >
                <span className="text-center">
                  <Plus size={20} className="text-gold-dk" />
                  <span className="ff-label mt-1.5 block">
                    Add {def.singular.toLowerCase()}
                  </span>
                </span>
              </button>
            )}
          </HScroll>
        ) : (
          <button
            className="ff-card ff-addtile"
            style={{ width: "100%", padding: 18 }}
            onClick={() => setAddingTo(catKey)}
          >
            <span className="text-center">
              <Plus size={18} className="text-gold-dk" />
              <span className="ff-label mt-1.5 block">
                Add your first {def.singular.toLowerCase()}
              </span>
            </span>
          </button>
        )}
      </section>
    );
  };

  return (
    <>
      <section className="mt-1">
        <SectionHead
          icon={<Award size={15} className="text-gold-dk" strokeWidth={1.6} />}
          title="Questions"
          action={<CategoryToggle sectionKey="questions" />}
        />
        {state.categoryVisibility.questions !== false && <QuestionCardsCollection />}
      </section>

      {order.map(renderCategorySection)}

      <section className="mt-[26px]">
        <SectionHead
          icon={<Users size={15} className="text-gold-dk" strokeWidth={1.6} />}
          title="Network"
          count={network.length}
          action={
            <span className="flex items-center gap-1.5">
              <button className="ff-btn sm ghost" onClick={() => goTab("network")}>
                All
              </button>
              <CategoryToggle sectionKey="profile_network" />
            </span>
          }
        />
        {state.categoryVisibility.profile_network !== false && (
          <HScroll label="Network" snap>
            {network.map((p) => (
              <PlayerTile key={p.id} person={p} />
            ))}
            <button
              className="ff-card ff-portrait ff-addtile"
              style={{ width: CARD_W.player }}
              onClick={() => goTab("network")}
            >
              <span className="text-center">
                <Plus size={20} className="text-gold-dk" />
                <span className="ff-label mt-1.5 block">Add people</span>
              </span>
            </button>
          </HScroll>
        )}
      </section>

      <MediaSection />

      <section className="mt-[22px]">
        <SectionHead
          icon={<CatIcon kind="reviews" size={15} color="var(--color-gold-dk)" />}
          title="Reviews & References"
          count={reviewList.length}
          action={
            <span className="flex items-center gap-1.5">
              <button className="ff-btn sm ghost" onClick={() => setAsking(true)}>
                Ask
              </button>
              <CategoryToggle sectionKey="reviews" />
            </span>
          }
        />
        {state.categoryVisibility.reviews !== false &&
          (reviewList.length || pendingRequests.length ? (
            <HScroll label="Reviews & References">
              {reviewList.map((r) => (
                <InformationCard
                  key={r.id}
                  record={r}
                  def={cats.reviews}
                  themeKey={profile.cardShade}
                  onClick={() =>
                    setOpenRec({ record: r, def: cats.reviews, category: "reviews" })
                  }
                />
              ))}
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="ff-tile items-center justify-center gap-1.5 text-center"
                  style={{ width: CARD_W.info, minHeight: 140 }}
                >
                  <Clock size={18} className="text-gold-dk" strokeWidth={1.5} />
                  <span className="ff-serif text-[13px] italic">
                    Waiting on {req.fromName}
                  </span>
                </div>
              ))}
              <button
                className="ff-card ff-addtile"
                style={{ width: CARD_W.info, minHeight: 140 }}
                onClick={() => setAsking(true)}
              >
                <span className="text-center">
                  <Plus size={20} className="text-gold-dk" />
                  <span className="ff-label mt-1.5 block">Ask for a review</span>
                </span>
              </button>
            </HScroll>
          ) : (
            <button
              className="ff-card ff-addtile"
              style={{ width: "100%", padding: 18 }}
              onClick={() => setAsking(true)}
            >
              <span className="text-center">
                <Plus size={18} className="text-gold-dk" />
                <span className="ff-label mt-1.5 block">
                  Ask someone you&apos;ve worked with for a review
                </span>
              </span>
            </button>
          ))}
      </section>

      <section className="mt-[22px]">
        <SectionHead
          icon={<MapPin size={15} className="text-gold-dk" strokeWidth={1.6} />}
          title="Venues"
          count={venues.length}
          action={<CategoryToggle sectionKey="profile_venues" />}
        />
        {state.categoryVisibility.profile_venues !== false && (
          <HScroll label="Venues">
            {venues.map((v) => (
              <VenueCard key={v.id} venue={v} />
            ))}
          </HScroll>
        )}
      </section>

      <div className="mt-4.5">
        <Button variant="ghost wide" onClick={() => setAddingCat(true)}>
          <Plus size={13} /> Add another category
        </Button>
        <p className="ff-body ff-muted mt-2 mb-0 text-center" style={{ fontSize: 11.5 }}>
          The built-in categories are a starting point, not the limit.
        </p>
      </div>

      <InfoCardSheet
        key={`info:${openRec ? `${openRec.category}:${openRec.record.id}` : "none"}`}
        open={!!openRec}
        record={openRec?.record ?? null}
        def={openRec?.def ?? null}
        category={openRec?.category ?? null}
        readOnly={openRec?.category === "reviews"}
        onClose={() => setOpenRec(null)}
      />
      <AddRecordSheet
        key={`addrec:${addingTo ?? "none"}`}
        open={!!addingTo}
        category={addingTo}
        def={addingTo ? cats[addingTo] : null}
        onClose={() => setAddingTo(null)}
      />
      <AddCategorySheet key={`addcat:${addingCat}`} open={addingCat} onClose={() => setAddingCat(false)} />
      <AskForReviewSheet open={asking} onClose={() => setAsking(false)} />
    </>
  );
}
