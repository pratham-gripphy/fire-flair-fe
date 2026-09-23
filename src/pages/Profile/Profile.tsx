import { useState } from "react";
import { Award, User } from "lucide-react";
import { useStore } from "../../hooks/useStore";
import { useGoTab } from "../../hooks/useGoTab";
import { Button } from "../../components/common/Button";
import { Empty } from "../../components/common/Empty";
import { Notice } from "../../components/common/Notice";
import { Pill } from "../../components/common/Pill";
import { SectionHead } from "../../components/common/SectionHead";
import { EditableProfileCard } from "../../components/card/EditableProfileCard";
import { ProfileCardView } from "../../components/card/ProfileCardView";
import { AIProfileCompletion } from "../../components/profile/AIProfileCompletion";
import { QuestionCardsCollection } from "../../components/questions/QuestionCardsCollection";
import { TIERS } from "../../constants/theme";
import type { Profile as ProfileState, ProfileDraft } from "../../types/store";

const draftOf = (profile: ProfileState): ProfileDraft => ({
  name: profile.name,
  photo: profile.photo,
  professions: profile.professions,
  skills: profile.skills,
  interests: profile.interests,
  locations: profile.locations,
  languages: profile.languages,
});

export function Profile() {
  const { state, dispatch } = useStore();
  const { profile } = state;
  const goTab = useGoTab();

  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState<ProfileDraft | null>(null);
  const [notice, setNotice] = useState<{ tone: "ok" | "bad"; text: string } | null>(null);

  const startEditing = () => {
    setEditDraft(draftOf(profile));
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditDraft(null);
    setEditing(false);
  };

  const saveEditing = () => {
    if (editDraft) dispatch({ type: "PROFILE_PATCH", patch: editDraft });
    setEditDraft(null);
    setEditing(false);
    setNotice({ tone: "ok", text: "Card updated." });
  };

  const shareCard = async () => {
    const shareData = {
      title: `${profile.name || "My"} FireFlair card`,
      text: `Check out ${profile.name.split(" ")[0] || "my"} FireFlair card.`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // the user cancelled the native share sheet - nothing to do
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(shareData.url);
      setNotice({ tone: "ok", text: "Card link copied to clipboard." });
    } catch {
      setNotice({
        tone: "bad",
        text: "Could not copy the link - copy it from the address bar.",
      });
    }
  };

  if (!profile.accountCreated) {
    return (
      <div className="ff-page">
        <div className="ff-page-narrow">
          <Empty
            icon={<User size={26} />}
            title="Finish creating your profile and your card appears here."
            action={
              <Button variant="primary" onClick={() => goTab("home")}>
                Continue setting up
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const eyebrow = state.role === "staff" ? "FF Staff" : "FF Team";

  if (editing && editDraft) {
    return (
      <div className="ff-page">
        <div className="ff-page-narrow">
          <div className="ff-eyebrow">{eyebrow}</div>
          <h1 className="ff-h1 mt-1 mb-3.5">Edit your card</h1>

          <EditableProfileCard
            draft={editDraft}
            onChange={(patch) =>
              setEditDraft((d) => (d ? { ...d, ...patch } : d))
            }
            themeKey={profile.theme}
            tier={profile.tier}
            level={profile.level}
          />

          <div className="mt-5 flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={cancelEditing}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" onClick={saveEditing}>
              Save changes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ff-page">
      <div className="ff-page-narrow">
        <div className="ff-eyebrow">{eyebrow}</div>
        <h1 className="ff-h1 mt-1 mb-3.5">Your card</h1>

        {notice && (
          <Notice
            tone={notice.tone}
            className="mb-3.5"
            onDismiss={() => setNotice(null)}
          >
            {notice.text}
          </Notice>
        )}

        <ProfileCardView
          profile={profile}
          onEdit={startEditing}
          onShare={shareCard}
        />

        <div className="ff-frame mt-5 flex flex-wrap items-center gap-2 p-3">
          <Pill tone="gold">Level {profile.level}</Pill>
          <Pill>{TIERS[profile.tier].name} tier</Pill>
          {profile.phone && <Pill tone="ok">{profile.phone}</Pill>}
          {profile.email && <Pill tone="ok">{profile.email}</Pill>}
        </div>

        <AIProfileCompletion />
      </div>

      <section className="mt-[22px]">
        <SectionHead
          icon={<Award size={15} className="text-gold-dk" strokeWidth={1.6} />}
          title="Questions"
        />
        <QuestionCardsCollection />
      </section>
    </div>
  );
}
