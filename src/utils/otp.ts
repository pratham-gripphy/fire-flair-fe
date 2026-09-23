import { validatePhoneNumberLength } from "libphonenumber-js";
import type { Country } from "../constants/countries";

/** National number only - the dial code is picked separately in PhoneInput.
 *  Length rules come from libphonenumber-js's per-country metadata. */
export function phoneErrorMessage(value: string, country: Country): string | null {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "Enter your mobile number.";

  switch (validatePhoneNumberLength(digits, country.code)) {
    case "TOO_SHORT":
      return `That number's too short for ${country.name}.`;
    case "TOO_LONG":
      return `That number's too long for ${country.name}.`;
    case "INVALID_LENGTH":
    case "NOT_A_NUMBER":
      return `That doesn't look like a valid ${country.name} number.`;
    default:
      return null;
  }
}

export const isValidPhone = (value: string, country: Country) =>
  phoneErrorMessage(value, country) === null;

/** Placeholder for a real SMS provider - every code is "1234" for now. */
export const STATIC_OTP = "1234";
