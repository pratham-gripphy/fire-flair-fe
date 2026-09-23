import { useState } from "react";
import { LogIn } from "lucide-react";
import { Sheet } from "../../common/Sheet";
import { Field } from "../../common/Field";
import { Button } from "../../common/Button";
import { Pill } from "../../common/Pill";
import { Corners } from "../../common/Corners";
import { Coin } from "../../common/Coin";
import { PhoneInput } from "../../common/PhoneInput";
import { useStore } from "../../../hooks/useStore";
import { xpProgress } from "../../../constants/xp";
import { isValidPhone, phoneErrorMessage, STATIC_OTP } from "../../../utils/otp";
import { DEFAULT_COUNTRY, type Country } from "../../../constants/countries";

interface XPModalProps {
  open: boolean;
  onClose: () => void;
}

/** Opened from the header's XP button. A phone + OTP login for an existing
 *  account sits above the XP preview, since XP itself isn't live yet. */
export function XPModal({ open, onClose }: XPModalProps) {
  const { state, dispatch } = useStore();
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);

  const xpInfo = xpProgress(state.profile.xp);
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

  const login = () => {
    if (otp.trim() !== STATIC_OTP) {
      setOtpError("That code's wrong - try 1234.");
      return;
    }
    dispatch({ type: "TOAST", toast: "Account login is coming soon." });
  };

  return (
    <Sheet open={open} onClose={onClose} title="FireFlair XP">
      <p className="ff-label mb-1.5">Log in to an existing account</p>

      {!otpSent ? (
        <>
          <Field label="Mobile number">
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
            {otpError && <p className="text-bad mt-1.5 text-xs">{otpError}</p>}
          </Field>

          <Button
            variant="primary wide"
            disabled={otp.trim().length !== 4}
            onClick={login}
          >
            <LogIn size={15} /> Log in
          </Button>

          <button
            className="ff-body ff-muted mt-3 w-full text-center text-xs tracking-[0.1em] uppercase underline underline-offset-2"
            onClick={changeNumber}
          >
            Change number
          </button>
        </>
      )}

      <div className="ff-rule my-5" />

      <div className="ff-frame p-5 text-center">
        <Corners />
        <div className="mb-2.5 flex justify-center">
          <Coin size={40} tier={xpInfo.currentTier} />
        </div>
        <div className="mb-2.5 flex justify-center">
          <Pill tone="warn">Coming soon</Pill>
        </div>
        <p className="ff-serif mb-2 text-[17px] text-[#4A443A]">
          {xpInfo.xp} XP earned so far
        </p>
        <p className="ff-body ff-muted mb-0 text-[13px] leading-[1.5]">
          XP is how FireFlair rewards you for building a great profile -
          completing your card, answering questions, and staying active all
          add up. It&apos;s not live yet, but once it is, your XP will unlock
          Bronze, Silver and Gold tiers, badges on your card, and priority
          visibility to teams browsing FireFlair.
        </p>
      </div>
    </Sheet>
  );
}
