import { promises as dns } from "dns";

export function validateFloat(value: FormDataEntryValue | null, attribute: string): number {
  if (!value) {
    throw new Error(`No ${attribute} provided.`);
  }

  const floatStr = String(value).trim();

  const floatFormat = /^(0|[1-9]\d*)(\.\d{1,2})?$|^0?\.\d{1,2}$/;

  if (!floatFormat.test(floatStr)) {
    throw new Error(`${attribute} must be a valid number with up to two decimal places.`);
  }

  return Number(floatStr);
}

export function validateInteger(value: FormDataEntryValue | null, attribute: string): number {
  if (!value) {
    throw new Error(`No ${attribute} provided.`);
  }

  const integerStr = String(value).trim();

  const integerFormat = /^(0|[1-9]\d*)$/;

  if (!integerFormat.test(integerStr)) {
    throw new Error(`${attribute} must be a non-negative integer.`);
  }

  return Number(integerStr);
}

export function validatePersonName(name: FormDataEntryValue | null): string {
  if (!name) {
    throw new Error("No name provided.");
  }

  let nameStr = String(name).trim();

  const validChars = /^[a-zA-Z0-9\s.'’-]+$/;

  if (!validChars.test(nameStr)) {
    throw new Error(`(${nameStr}) Name contains invalid characters.`);
  }

  nameStr = nameStr.replace(/\s+/g, " ");

  if (nameStr.length > 50) {
    throw new Error(`(${nameStr}) Name must not exceed 50 characters.`);
  }

  return nameStr;
}

export function validateFacilityName(name: FormDataEntryValue | null): string {
  if (!name) {
    throw new Error("No name provided.");
  }

  let nameStr = String(name).trim();

  const validChars = /^[a-zA-Z0-9\s.'’&+-]+$/;

  if (!validChars.test(nameStr)) {
    throw new Error(`(${nameStr}) Name contains invalid characters.`);
  }

  nameStr = nameStr.replace(/\s+/g, " ");

  if (nameStr.length > 50) {
    throw new Error(`(${nameStr}) Name must not exceed 50 characters.`);
  }

  return nameStr;
}

export function validatePhone(phone: FormDataEntryValue | null): string {
  if (!phone) {
    throw new Error("No phone number provided.");
  }

  let phoneNumberStr = (phone as string).trim();

  const validChars = /^\+?\d[\d\s]*$/;

  if (!validChars.test(phoneNumberStr)) {
    throw new Error(`(${phoneNumberStr}) Phone number contains invalid characters.`);
  }

  const digits = phoneNumberStr.replace(/\s+/g, "");
  
  if (digits.startsWith("+639")) {
    if (digits.length !== 13) {
      throw new Error(`(${phoneNumberStr}) Phone number length is incorrect for +639 format.`);
    }

  } else if (digits.startsWith("09")) {
    if (digits.length !== 11) {
      throw new Error(`(${phoneNumberStr}) Phone number length is incorrect for 09 format.`);
    }

  } else {
    throw new Error(`(${phoneNumberStr}) Phone number country code is neither in +639 nor the 09 format.`);
  }

  phoneNumberStr = phoneNumberStr.replace(/\s+/g, " ");

  return phoneNumberStr;
}

async function hasMXRecords(domain: string): Promise<boolean> {
  try {
    const records = await dns.resolveMx(domain);

    return records.length > 0;
  } catch {
    return false;
  }
}

export async function validateEmail(email: string): Promise<string> {
  if (!email) {
    throw new Error("No email provided.");
  }

  const emailStr = email.trim();

  const validChars = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!validChars.test(emailStr)) {
    throw new Error(`(${emailStr}) Email contains invalid characters.`);
  }

  const consecutiveDots = /\.\./;

  if (consecutiveDots.test(emailStr)) {
    throw new Error(`(${emailStr}) Email contains consecutive dots.`);
  }

  const domain = emailStr.split("@")[1];

  if (!(await hasMXRecords(domain))) {
    throw new Error(`(${domain}) Email domain is invalid.`);
  }

  return emailStr;
}

export function validateOpenClose(open: FormDataEntryValue | null, close: FormDataEntryValue | null): { openingTime: Date, closingTime: Date } {
  if (!open || !close) {
    throw new Error("No opening and closing time provided.");
  }

  const openStr  = String(open).trim();
  const closeStr = String(close).trim();

  const timeFormat = /^(?:[0-9]|[01]\d|2[0-3]):[0-5]\d$/;

  if (!timeFormat.test(openStr) || !timeFormat.test(closeStr)) {
    throw new Error("Invalid time format. Use HH:MM (24-hour).");
  }

  const [openHour, openMin]   = openStr.split(":").map(Number);
  const [closeHour, closeMin] = closeStr.split(":").map(Number);

  if (closeHour < openHour || (closeHour === openHour && closeMin <= openMin)) {
    throw new Error("Closing time must be later than opening time.");
  }

  const today = new Date();

  const openingTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(),  openHour,  openMin);
  const closingTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), closeHour, closeMin);

  return { openingTime, closingTime };  
}

export function validateCoverageRadius(min: FormDataEntryValue | null, max: FormDataEntryValue | null): { minCoverageRadius: number; maxCoverageRadius: number } {
  const minCoverageRadius = validateFloat(min, "minimum coverage radius");
  const maxCoverageRadius = validateFloat(max, "maximum coverage radius");

  if (maxCoverageRadius < minCoverageRadius) {
    throw new Error("Maximum coverage radius must be greater than or equal to minimum coverage radius.");
  }

  return { minCoverageRadius, maxCoverageRadius };
}

export function validateTurnaroundCompletionTime(days: FormDataEntryValue | null, hours: FormDataEntryValue | null): { days: number; hours: number } {  
  const daysValue  = validateInteger(days, "Days");
  const hoursValue = validateInteger(hours, "Hours");

  if (daysValue === 0 && hoursValue === 0) {
    throw new Error("Total turnaround time must be greater than zero.");
  }

  if (hoursValue > 23) {
    throw new Error("Hours must be between 0 and 23 (inclusive).");
  }

  return { days: daysValue, hours: hoursValue };
}

export function validateStreet(street: FormDataEntryValue | null): string {
  if (!street) {
    throw new Error("No street address provided.");
  }

  let streetStr = String(street).trim();

  const validChars = /^[a-zA-Z0-9.,\-\s]+$/;

  if (!validChars.test(streetStr)) {
    throw new Error(`(${streetStr}) Street address contains invalid characters.`);
  }

  streetStr = streetStr.replace(/\s+/g, " ");

  if (streetStr.length > 100) {
    throw new Error(`(${streetStr}) Street address must not exceed 100 characters.`);
  }

  return streetStr;
}

export function validateLink(link: string): string {
  if (!link) {
    throw new Error("No booking system link provided.");
  }

  const linkStr = String(link).trim();

  const linkFormat = /^https?:\/\//;

  if (!linkFormat.test(linkStr)) {
    throw new Error(`(${linkStr}) Booking system link must start with http:// or https://.`);
  }

  // no validation if actual link sya

  return linkStr;
}