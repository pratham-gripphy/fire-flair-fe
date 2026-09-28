import { useState } from "react";
import { LogIn } from "lucide-react";
import { Sheet } from "../../common/Sheet";
import { Field } from "../../common/Field";
import { FieldError } from "../../common/FieldError";
import { Button } from "../../common/Button";
import { Notice } from "../../common/Notice";
import { PhoneInput } from "../../common/PhoneInput";
import { isValidPhone, phoneErrorMessage, STATIC_OTP } from "../../../utils/otp";
import { DEFAULT_COUNTRY, type Country } from "../../../constants/countries";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

/** Opened from the header's logo button: phone + OTP login for an existing
 *  account. */
export function LoginModal({ open, onClose }: LoginModalProps) {
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const phoneReady = isValidPhone(phone, country);
  const phoneError = phone.trim() ? phoneErrorMessage(phone, country) : null;
  const fullPhone = `${country.dial} ${phone.trim()}`;

  const sendCode = () => {
    setOtpSent(true);
    setOtp("");
    setOtpError(null);
  };

  const changeNumber = () => {
    setOtpSent(false);
    setOtp("");
    setOtpError(null);
    setLoggedIn(false);
  };

  const login = () => {
    if (otp.trim() !== STATIC_OTP) {
      setOtpError("Invalid OTP");
      return;
    }
    setLoggedIn(true);
  };

  return (
    <Sheet open={open} onClose={onClose} title="Log in">
      <p className="ff-label mb-1.5">Log in to an existing account</p>

      {!otpSent ? (
        <>
          <Field label="Mobile number">
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
            hint={`Sent to ${fullPhone}. (Use 1234 for now.)`}
          >
            <input
              className={`ff-input ${otpError ? "border-bad/50" : ""}`}
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="1234"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 4));
                setOtpError(null);
              }}
              aria-invalid={!!otpError}
            />
            {otpError && <FieldError>{otpError}</FieldError>}
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

          {loggedIn && (
            <Notice className="mt-3.5" onDismiss={() => setLoggedIn(false)}>
              Account login is coming soon.
            </Notice>
          )}
        </>
      )}
    </Sheet>
  );
}
