import { useState } from "react";
import { ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import { useStore } from "../../hooks/useStore";
import { useGoTab } from "../../hooks/useGoTab";
import { Logo } from "../../components/common/Logo";
import { Wordmark } from "../../components/common/Wordmark";
import { Corners } from "../../components/common/Corners";
import { Button } from "../../components/common/Button";
import { Field } from "../../components/common/Field";
import { PhoneInput } from "../../components/common/PhoneInput";
import { EditableProfileCard } from "../../components/card/EditableProfileCard";
import { ProfileCardLandscape } from "../../components/card/ProfileCardLandscape";
import type { ProfileDraft } from "../../types/store";
import { isValidPhone, phoneErrorMessage, STATIC_OTP } from "../../utils/otp";
import { DEFAULT_COUNTRY, type Country } from "../../constants/countries";

export function Home() {
  const { state, dispatch } = useStore();
  const { profile } = state;
  const goTab = useGoTab();

  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState(profile.phone);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);

  const updateDraft = (patch: Partial<ProfileDraft>) =>
    dispatch({ type: "PROFILE_PATCH", patch });

  const started = profile.started || profile.accountCreated;
  const cardReady =
    profile.name.trim().length > 0 && profile.professions.length > 0;
  const awaitingSave =
    cardReady && !profile.cardSaved && !profile.accountCreated;
  const awaitingContact = profile.cardSaved && !profile.accountCreated;
  const phoneReady = isValidPhone(phone, country);
  const phoneError = phone.trim() ? phoneErrorMessage(phone, country) : null;
  const fullPhone = `${country.dial} ${phone.trim()}`;

  const sendCode = () => {
    setOtpSent(true);
    setOtp("");
    setOtpError(null);
    dispatch({ type: "TOAST", toast: "Code sent - use 1234 for now." });
  };

  const changeNumber = () => {
    setOtpSent(false);
    setOtp("");
    setOtpError(null);
  };

  const verifyAndCreateAccount = () => {
    if (otp.trim() !== STATIC_OTP) {
      setOtpError("That code's wrong - try 1234.");
      return;
    }
    dispatch({ type: "CREATE_ACCOUNT", phone: fullPhone });
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
              Your card is saved. Add a phone number to create your account.
            </p>

            {!otpSent ? (
              <>
                <Field
                  label="Mobile number"
                  hint={
                    phoneError
                      ? undefined
                      : "We only use this to save and secure your account."
                  }
                >
                  <PhoneInput
                    country={country}
                    onCountryChange={setCountry}
                    number={phone}
                    onNumberChange={setPhone}
                  />
                  {phoneError && (
                    <p className="text-bad mt-1.5 text-xs">{phoneError}</p>
                  )}
                </Field>

                <Button
                  variant="primary wide"
                  disabled={!phoneReady}
                  onClick={sendCode}
                >
                  Send code
                </Button>
              </>
            ) : (
              <>
                <Field
                  label="Verification code"
                  hint={`Sent to ${fullPhone}. (Use 1234 for now.)`}
                >
                  <input
                    className="ff-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="1234"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 4));
                      setOtpError(null);
                    }}
                  />
                  {otpError && (
                    <p className="text-bad mt-1.5 text-xs">{otpError}</p>
                  )}
                </Field>

                <Button
                  variant="primary wide"
                  disabled={otp.trim().length !== 4}
                  onClick={verifyAndCreateAccount}
                >
                  <ShieldCheck size={15} /> Verify &amp; create account
                </Button>

                <button
                  className="ff-body ff-muted mt-3 w-full text-center text-xs tracking-[0.1em] uppercase underline underline-offset-2"
                  onClick={changeNumber}
                >
                  Change number
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
