import { useState } from "react";
import {
  Award,
  Calendar,
  ChevronRight,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useStore } from "../../hooks/useStore";
import { useGoTab } from "../../hooks/useGoTab";
import { Logo } from "../../components/common/Logo";
import { Wordmark } from "../../components/common/Wordmark";
import { Corners } from "../../components/common/Corners";
import { Button } from "../../components/common/Button";
import { Field } from "../../components/common/Field";
import { EditableProfileCard } from "../../components/card/EditableProfileCard";
import { ProfileCardLandscape } from "../../components/card/ProfileCardLandscape";
import { FeedSection } from "../../components/feed/FeedSection";
import { FEED } from "../../constants/feed";
import type { ProfileDraft } from "../../types/store";

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
const isValidPhone = (value: string) => value.replace(/\D/g, "").length >= 9;

export function Home() {
  const { state, dispatch } = useStore();
  const { profile } = state;
  const goTab = useGoTab();

  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);

  const updateDraft = (patch: Partial<ProfileDraft>) =>
    dispatch({ type: "PROFILE_PATCH", patch });

  const started = profile.started || profile.accountCreated;
  const cardReady =
    profile.name.trim().length > 0 && profile.professions.length > 0;
  const awaitingSave =
    cardReady && !profile.cardSaved && !profile.accountCreated;
  const awaitingContact = profile.cardSaved && !profile.accountCreated;
  const contactReady = isValidPhone(phone) || isValidEmail(email);

  const createAccount = () => {
    dispatch({
      type: "CREATE_ACCOUNT",
      phone: phone.trim(),
      email: email.trim(),
    });
  };

  if (!started) {
    return (
      <div className="ff-page">
        <div className="ff-page-narrow text-center">
          <div className="ff-frame ff-lattice p-8">
            <Corners />
            <div className="mb-3 flex justify-center">
              <Logo size={56} />
            </div>
            <div className="mb-3">
              <Wordmark size={18} tone="#7E611D" />
            </div>
            <h1 className="ff-h1">
              Let&apos;s build your
              <br />
              professional identity
            </h1>
            <p className="ff-lede mt-2.5 mb-0">
              Your profession, on a card worth sharing. No account to create
              until you&apos;re ready.
            </p>
          </div>
          <div className="h-4" />
          <Button
            variant="primary wide"
            onClick={() => dispatch({ type: "START_BUILDING" })}
          >
            Build my card <ChevronRight size={15} />
          </Button>
        </div>
      </div>
    );
  }

  // Card exists - Home becomes the dashboard; the card itself lives on Profile.
  if (profile.accountCreated) {
    const firstName = profile.name.split(" ")[0] || "there";
    const missing: string[] = [];
    if (!profile.skills.length) missing.push("skills");
    if (!profile.interests.length) missing.push("interests");
    if (!profile.locations.length) missing.push("work locations");

    return (
      <div className="ff-page">
        <div className="ff-eyebrow">
          {state.role === "staff" ? "FF Staff" : "FF Team"}
        </div>
        <h1 className="ff-h1 mt-1 mb-3.5">Hello, {firstName}</h1>

        <ProfileCardLandscape
          profile={profile}
          onClick={() => goTab("profile")}
        />

        <div className="mt-3 grid grid-cols-3 gap-2">
          {(
            [
              ["Professions", profile.professions.length],
              ["Skills", profile.skills.length],
              ["Languages", profile.languages.length],
            ] as const
          ).map(([label, value]) => (
            <button
              key={label}
              className="ff-frame px-3 py-2.5 text-left"
              onClick={() => goTab("profile")}
            >
              <div className="font-display text-[22px]">{value}</div>
              <div className="ff-label">{label}</div>
            </button>
          ))}
        </div>

        {missing.length > 0 && (
          <div className="ff-frame mt-5 flex items-start gap-3 p-3.5">
            <Sparkles
              size={17}
              className="text-gold-mid mt-0.5 shrink-0"
              strokeWidth={1.6}
            />
            <div>
              <p className="ff-body m-0">
                Add {missing.join(", ")} to make your card stand out.
              </p>
              <button
                className="ff-label mt-1.5 underline underline-offset-2"
                onClick={() => goTab("profile")}
              >
                Complete your card
              </button>
            </div>
          </div>
        )}

        <FeedSection
          title="Events"
          icon={
            <Calendar size={15} className="text-gold-dk" strokeWidth={1.6} />
          }
          items={FEED.events}
          kind="Event"
          actionLabel="See event"
          onAction={(i) =>
            dispatch({
              type: "TOAST",
              toast: `${i.title} - ${i.when}, ${i.where}`,
            })
          }
        />

        <FeedSection
          title="Training"
          icon={<Award size={15} className="text-gold-dk" strokeWidth={1.6} />}
          items={FEED.training}
          kind="Training"
          actionLabel="Sign up"
          onAction={(i) =>
            dispatch({
              type: "TOAST",
              toast: `Registered interest - ${i.title}`,
            })
          }
        />
      </div>
    );
  }

  // Building the first card, before the account exists.
  return (
    <div className="ff-page">
      <div className="ff-page-narrow">
        <h1 className="ff-h1 text-center">Build your card</h1>
        <p className="ff-body mt-2 mb-4 text-center">
          Type straight onto it. Add as many professions as you have - your card
          shows the first three.
        </p>

        <EditableProfileCard
          draft={profile}
          onChange={updateDraft}
          themeKey={profile.theme}
          tier={profile.tier}
          level={profile.level}
        />

        {awaitingSave && (
          <div className="mt-5 flex animate-[ffup_.22s_ease-out] gap-3">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => dispatch({ type: "RESET_CARD" })}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => dispatch({ type: "SAVE_CARD" })}
            >
              Save card
            </Button>
          </div>
        )}

        {awaitingContact && (
          <div className="mt-6 animate-[ffup_.22s_ease-out]">
            <div className="ff-rule mb-5" />
            <h2 className="ff-h2 text-center">Almost there</h2>
            <p className="ff-body ff-muted mt-1 mb-4 text-center">
              Your card is saved. Add a phone number or an email to create your
              account.
            </p>

            <Field
              label="Mobile number"
              hint="We only use this to save and secure your account."
            >
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-gold-dk shrink-0" />
                <input
                  className="ff-input"
                  type="tel"
                  placeholder="+44 7700 900000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </Field>

            <div className="ff-body ff-muted mb-4 text-center text-xs tracking-[0.2em] uppercase">
              or
            </div>

            <Field label="Email address">
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-gold-dk shrink-0" />
                <input
                  className="ff-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </Field>

            <Button
              variant="primary wide"
              disabled={!contactReady}
              onClick={createAccount}
            >
              <ShieldCheck size={15} /> Create my account
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
