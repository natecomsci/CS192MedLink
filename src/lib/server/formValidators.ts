import { promises as dns } from "dns";
import fetch from "node-fetch";

export function validateFloat(value: FormDataEntryValue | null, attribute: string): number {
  if (!value) {
    throw new Error(`Please enter a value for ${attribute}.`);
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
    throw new Error(`Please enter a value for ${attribute}.`);
  }

  const integerStr = String(value).trim();

  const integerFormat = /^(0|[1-9]\d*)$/;

  if (!integerFormat.test(integerStr)) {
    throw new Error(`${attribute} must be a non-negative whole number.`);
  }

  return Number(integerStr);
}

export function validatePersonName(name: FormDataEntryValue | null): string {
  if (!name) {
    throw new Error("Please enter a name.");
  }

  let nameStr = String(name).trim();

  nameStr = nameStr.replace(/\s+/g, " ");

  if (nameStr.length > 50) {
    throw new Error("Name must be 50 characters or fewer.");
  }

  const validChars = /^[a-zA-Z\s.'’\-]+$/;

  if (!validChars.test(nameStr)) {
    throw new Error("Name may only include letters, spaces, and the characters '-', '.', and apostrophes.");
  }

  return nameStr;
}

export function validateFacilityName(name: FormDataEntryValue | null): string {
  if (!name) {
    throw new Error("Please enter a name.");
  }

  let nameStr = String(name).trim();

  nameStr = nameStr.replace(/\s+/g, " ");

  if (nameStr.length > 50) {
    throw new Error("Name must be 50 characters or fewer.");
  }

  const validChars = /^[a-zA-Z\d\s.'’\-&+/]+$/;

  if (!validChars.test(nameStr)) { // lol
    throw new Error("Name may only include letters, numbers, spaces, and the characters '.', ''', '-', '&', '+', and '/'.");
  }

  return nameStr;
}

// should we allow hyphens? /^\+?\d[\d\s-]*$/

export function validatePhone(phone: FormDataEntryValue | null, source: string): string {
  if (!phone) {
    if (source === "Facility" || source === "Division") {
      throw new Error("Please enter a phone number.");
    }
    return "";
  }

  let phoneNumberStr = (phone as string).trim();
  const validChars = /^\+?\d[\d\s]*$/;

  if (!validChars.test(phoneNumberStr)) {
    throw new Error("Phone number may only include digits, spaces, and an optional '+' at the start.");
  }

  const digits = phoneNumberStr.replace(/\s+/g, "");

  if (digits.startsWith("+639")) {
    if (digits.length !== 13) {
      throw new Error("A +639-format number must have exactly 13 digits (e.g., +63901 234 5678).");
    }
    return `+63${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;

  } else if (digits.startsWith("09")) {
    if (digits.length !== 11) {
      throw new Error("A 09-format number must have exactly 11 digits (e.g., 0901 234 5678).");
    }
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;

  } else {
    throw new Error("Phone number must start with either +639 or 09.");
  }
}

async function hasMXRecords(domain: string): Promise<boolean> {
  try {
    const records = await dns.resolveMx(domain);

    return records.length > 0;
  } catch {
    return false;
  }
}

export async function validateEmail(email: FormDataEntryValue | null): Promise<string> {
  if (!email) {
    return '';
  }

  const emailStr = String(email).trim();

  const validChars = /^[a-zA-Z\d](?:[a-zA-Z\d._\-]*[a-zA-Z\d])*@[a-zA-Z\d.\-]+\.[a-zA-Z]{2,}$/;

  if (!validChars.test(emailStr)) {
    throw new Error("Please enter a valid email address (e.g., username@examplewebsite.com).");
  }

  if (/\.\./.test(emailStr)) {
    throw new Error("Email address cannot contain consecutive dots.");
  }

  const domain = emailStr.split("@")[1];

  if (!(await hasMXRecords(domain))) {
    throw new Error("The domain of the email address doesn't appear to accept emails. Please check for typos.");
  }

  return emailStr;
}

export function validateOperatingHours(open: FormDataEntryValue | null, close: FormDataEntryValue | null, source: string, hasDivisions: boolean): { openingTime: Date, closingTime: Date } {
  if (!open || !close) {
    if ((source === "Facility" && !hasDivisions) || source === "Division")
      throw new Error("Please provide both opening and closing times.");
  }

  const openStr  = String(open).trim();
  const closeStr = String(close).trim();

  const timeFormat = /^(?:0?\d|1\d|2[0-3]):[0-5]\d$/;

  if (!timeFormat.test(openStr)) {
    throw new Error("Opening time format is invalid. Use HH:MM in 24-hour format (e.g., 08:00 or 20:30).");
  }

  if (!timeFormat.test(closeStr)) {
    throw new Error("Closing time format is invalid. Use HH:MM in 24-hour format (e.g., 08:00 or 20:30).");
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
  const minCoverageRadius = validateFloat(min, "Minimum coverage radius");
  const maxCoverageRadius = validateFloat(max, "Maximum coverage radius");

  if (maxCoverageRadius < minCoverageRadius) {
    throw new Error("Maximum coverage radius must be equal to or greater than the minimum coverage radius.");
  }

  return { minCoverageRadius, maxCoverageRadius };
}

export function validateCompletionTime(days: FormDataEntryValue | null, hours: FormDataEntryValue | null, attribute: string): { days: number; hours: number } {  
  const daysValue  = validateInteger(days, `${attribute} time days`);
  const hoursValue = validateInteger(hours, `${attribute} time hours`);

  if (daysValue === 0 && hoursValue === 0) {
    throw new Error(`Please enter a non-zero total ${attribute.toLowerCase()} time.`);
  }

  if (hoursValue > 23) {
    throw new Error(`${attribute} time hours must be between 0 and 23.`);
  }

  return { days: daysValue, hours: hoursValue };
}

export function validateStreet(street: FormDataEntryValue | null): string {
  if (!street) {
    throw new Error("Please enter a street address.");
  }

  let streetStr = String(street).trim();

  streetStr = streetStr.replace(/\s+/g, " ");

  if (streetStr.length > 100) {
    throw new Error("Street address must be 100 characters or fewer.");
  }

  const validChars = /^[a-zA-Z\d\s\-.,&]+$/;

  if (!validChars.test(streetStr)) {
    throw new Error("Street address may only include letters, numbers, spaces, and the characters '-', '.', ',', and '&'.");
  }

  return streetStr;
}

// Does not work for websites that block API requests like Twitter.

export async function validateLink(link: FormDataEntryValue | null): Promise<string> {
  if (link == null) {
    throw new Error("Please enter a booking system link.");
  }

  let linkStr = String(link).trim();

  if (!/^https?:\/\//i.test(linkStr)) {
    linkStr = `https://${linkStr}`;
  }

  const linkFormat = /^https?:\/\/([a-zA-Z\d\-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;

  if (!linkFormat.test(linkStr)) {
    throw new Error("Booking system link must start with http:// or https://.");
  }

  try {
    const response = await fetch(linkStr, { method: "HEAD" });
    if (!response.ok) {
      throw new Error("Booking system link could not be reached. Please check the URL.");
    }
  } catch (error) {
    throw new Error("Booking system link could not be reached. Please check the URL.");
  }

  return linkStr;
}

export function validateImage(file: File): File {
  if (file.type.split('/')[0] !== "image") {
    throw new Error("Image must be a .jpeg or a .png.");
  }

  if (file.size > 5242880) {
    throw new Error("Image must be smaller than 5 MB.");
  }

  return file;
}
