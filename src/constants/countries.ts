import { getCountries, getCountryCallingCode, type CountryCode } from 'libphonenumber-js';

export interface Country {
  code: CountryCode;
  name: string;
  dial: string;
}

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

/** Every country libphonenumber-js has a dialling code for - drives both the
 *  picker (flags come from country-flag-icons, keyed by the same code) and
 *  the length validation in ../utils/otp. */
export const COUNTRIES: Country[] = getCountries()
  .map((code) => ({
    code,
    name: regionNames.of(code) ?? code,
    dial: `+${getCountryCallingCode(code)}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const DEFAULT_COUNTRY: Country =
  COUNTRIES.find((c) => c.code === 'GB') ?? COUNTRIES[0];
