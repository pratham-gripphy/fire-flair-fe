import { useState } from "react";
import { ChevronRight, PenLine, ShieldCheck, Sparkles } from "lucide-react";
import { useStore } from "../../hooks/useStore";
import { useGoTab } from "../../hooks/useGoTab";
import { formatCountdown, useResendTimer } from "../../hooks/useResendTimer";
import { Logo } from "../../components/common/Logo";
import { Wordmark } from "../../components/common/Wordmark";
import { Corners } from "../../components/common/Corners";
import { Button } from "../../components/common/Button";
import { Field } from "../../components/common/Field";
import { FieldError } from "../../components/common/FieldError";
import { Notice } from "../../components/common/Notice";
import { PhoneInput } from "../../components/common/PhoneInput";
import { OtpInput } from "../../components/common/OtpInput";
import { AICardCompletion } from "../../components/card/AICardCompletion";
import { CardColourPicker } from "../../components/card/CardColourPicker";
import { EditableProfileCard } from "../../components/card/EditableProfileCard";
import { ProfileCardLandscape } from "../../components/card/ProfileCardLandscape";
import type { ProfileDraft } from "../../types/store";
import {
  isValidPhone,
  OTP_LENGTH,
  OTP_RESEND_SECONDS,
  phoneErrorMessage,
  STATIC_OTP,
} from "../../utils/otp";
import { DEFAULT_COUNTRY, type Country } from "../../constants/countries";

/** Three-segment progress bar across the build flow: choose, build, verify. */
function BuildSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="mb-4 grid grid-cols-3 gap-1.5" aria-label={`Step ${current} of 3`}>
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`h-0.5 ${n <= current ? "bg-gold-mid" : "bg-gold-mid/30"}`}
        />
      ))}
    </div>
  );
}

export function Home() {
  const { state, dispatch } = useStore();
  const { profile } = state;
  const goTab = useGoTab();

  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState(profile.phone);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [justActivated, setJustActivated] = useState(false);
  const [resent, setResent] = useState(false);
  const resend = useResendTimer(OTP_RESEND_SECONDS);
  // First-time builders pick AI or manual before the blank card appears;
  // returning to a card already in progress skips straight past the choice.
  const [buildMethod, setBuildMethod] = useState<"choice" | "ai" | "manual">(
    () => (profile.name.trim() || profile.professions.length > 0 ? "manual" : "choice"),
  );

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
    setResent(false);
    resend.restart();
  };

  const resendCode = () => {
    sendCode();
    setResent(true);
  };

  const changeNumber = () => {
    setOtpSent(false);
    setOtp("");
    setOtpError(null);
    setResent(false);
    resend.reset();
  };

  const verifyAndCreateAccount = () => {
    if (otp !== STATIC_OTP) {
      setOtpError(`That code's wrong - try ${STATIC_OTP}.`);
      return;
    }
    setJustActivated(true);
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

        {justActivated && (
          <Notice className="mb-3.5" onDismiss={() => setJustActivated(false)}>
            Your FireFlair card is live.
          </Notice>
        )}

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
  if (buildMethod === "choice") {
    return (
      <div className="ff-page">
        <div className="ff-page-narrow">
          <BuildSteps current={1} />
          <h1 className="ff-h1 text-center">Build your card</h1>
          <p className="ff-body mt-2 mb-4 text-center">
            How would you like to get started?
          </p>

          <button
            type="button"
            className="ff-frame ff-lattice relative mb-3 flex w-full items-start gap-3 p-3.5 text-left"
            onClick={() => setBuildMethod("ai")}
          >
            <Corners />
            <Sparkles
              size={20}
              className="text-gold-mid mt-0.5 shrink-0"
              strokeWidth={1.6}
            />
            <span>
              <span className="font-display block text-sm">Let AI build it</span>
              <span className="ff-body ff-muted mt-0.5 block text-xs">
                Type, speak, or paste a bio - we&apos;ll draft your card and you
                confirm before anything is saved.
              </span>
            </span>
          </button>

          <button
            type="button"
            className="ff-frame relative mb-3 flex w-full items-start gap-3 p-3.5 text-left"
            onClick={() => setBuildMethod("manual")}
          >
            <PenLine size={20} className="text-ink/70 mt-0.5 shrink-0" strokeWidth={1.6} />
            <span>
              <span className="font-display block text-sm">Build it myself</span>
              <span className="ff-body ff-muted mt-0.5 block text-xs">
                Type straight onto the card, field by field.
              </span>
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (buildMethod === "ai") {
    return (
      <div className="ff-page">
        <div className="ff-page-narrow">
          <BuildSteps current={2} />
          <h1 className="ff-h1 text-center">Build your card</h1>
          <p className="ff-body mt-2 mb-4 text-center">
            Tell us about yourself and we&apos;ll fill in the card for you.
          </p>

          <AICardCompletion
            onApply={(patch) => {
              updateDraft(patch);
              setBuildMethod("manual");
            }}
            onSwitchToManual={() => setBuildMethod("manual")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="ff-page">
      <div className="ff-page-narrow">
        <BuildSteps current={awaitingContact ? 3 : 2} />
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

        <CardColourPicker
          value={profile.theme}
          onChange={(theme) => dispatch({ type: "PROFILE_PATCH", patch: { theme } })}
        />

        {!profile.cardSaved && (
          <div className="mt-5">
            <Button
              variant="primary wide"
              disabled={!awaitingSave}
              onClick={() => dispatch({ type: "SAVE_CARD" })}
            >
              Save my card
            </Button>
            {!cardReady && (
              <p className="ff-body ff-muted mt-2 text-center text-xs">
                Add your name and at least one profession to continue.
              </p>
            )}
            <button
              className="ff-body ff-muted mt-3 w-full text-center text-xs tracking-[0.1em] uppercase underline underline-offset-2"
              onClick={() => {
                dispatch({ type: "RESET_CARD" });
                setBuildMethod("choice");
              }}
            >
              Start over
            </button>
          </div>
        )}

        {awaitingContact && (
          <div className="mx-auto mt-6 max-w-[420px] animate-[ffup_.22s_ease-out]">
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
                    invalid={!!phoneError}
                  />
                  {phoneError && <FieldError>{phoneError}</FieldError>}
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
                  hint={`${resent ? "New code sent" : "Sent"} to ${fullPhone}. (Use ${STATIC_OTP} for now.)`}
                >
                  <OtpInput
                    length={OTP_LENGTH}
                    value={otp}
                    onChange={(v) => {
                      setOtp(v);
                      setOtpError(null);
                    }}
                    invalid={!!otpError}
                    autoFocus
                  />
                  {otpError && <FieldError>{otpError}</FieldError>}
                </Field>

                <Button
                  variant="primary wide"
                  disabled={otp.length !== OTP_LENGTH}
                  onClick={verifyAndCreateAccount}
                >
                  <ShieldCheck size={15} /> Verify &amp; create account
                </Button>

                <p className="ff-body ff-muted mt-3 text-center text-xs">
                  Didn&apos;t get it?{" "}
                  {resend.canResend ? (
                    <button
                      type="button"
                      className="text-gold-dk font-semibold underline underline-offset-2"
                      onClick={resendCode}
                    >
                      Resend code
                    </button>
                  ) : (
                    <span>Resend in {formatCountdown(resend.remaining)}</span>
                  )}
                </p>

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
