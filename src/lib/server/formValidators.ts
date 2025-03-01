import { promises as dns } from "dns";
import fetch from "node-fetch";

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

  nameStr = nameStr.replace(/\s+/g, " ");

  if (nameStr.length > 50) {
    throw new Error("Name must not exceed 50 characters.");
  }

  const validChars = /^[a-zA-Z0-9\s.'’-]+$/;

  if (!validChars.test(nameStr)) {
    throw new Error("Name contains invalid characters.");
  }

  return nameStr;
}

export function validateFacilityName(name: FormDataEntryValue | null): string {
  if (!name) {
    throw new Error("No name provided.");
  }

  let nameStr = String(name).trim();

  nameStr = nameStr.replace(/\s+/g, " ");

  if (nameStr.length > 50) {
    throw new Error("Name must not exceed 50 characters.");
  }

  const validChars = /^[a-zA-Z0-9\s.'’&+-]+$/;

  if (!validChars.test(nameStr)) {
    throw new Error("Name contains invalid characters.");
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
    throw new Error("Phone number contains invalid characters.");
  }

  const digits = phoneNumberStr.replace(/\s+/g, "");
  
  if (digits.startsWith("+639")) {
    if (digits.length !== 13) {
      throw new Error("Phone number length is incorrect for +639 format.");
    }

  } else if (digits.startsWith("09")) {
    if (digits.length !== 11) {
      throw new Error("Phone number length is incorrect for 09 format.");
    }

  } else {
    throw new Error("Phone number is neither in +639 nor the 09 format.");
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
    throw new Error("Email contains invalid characters.");
  }

  const consecutiveDots = /\.\./;

  if (consecutiveDots.test(emailStr)) {
    throw new Error("Email contains consecutive dots.");
  }

  const domain = emailStr.split("@")[1];

  if (!(await hasMXRecords(domain))) {
    throw new Error("Email domain is invalid.");
  }

  return emailStr;
}

export function validateOperatingHours(open: FormDataEntryValue | null, close: FormDataEntryValue | null): { openingTime: Date, closingTime: Date } {
  if (!open || !close) {
    throw new Error("No opening and closing time provided.");
  }

  const openStr  = String(open).trim();
  const closeStr = String(close).trim();

  const timeFormat = /^(?:[0-9]|[01]\d|2[0-3]):[0-5]\d$/;

  if (!timeFormat.test(openStr)) {
    throw new Error("Invalid opening time format. Use HH:MM (24-hour).");
  }

  if (!timeFormat.test(closeStr)) {
    throw new Error("Invalid closing time format. Use HH:MM (24-hour).");
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
    throw new Error("Maximum coverage radius must be greater than or equal to minimum coverage radius.");
  }

  return { minCoverageRadius, maxCoverageRadius };
}

export function validateCompletionTime(days: FormDataEntryValue | null, hours: FormDataEntryValue | null, attribute: string): { days: number; hours: number } {  
  const daysValue  = validateInteger(days, `${attribute} time days`);
  const hoursValue = validateInteger(hours, `${attribute} time hours`);

  if (daysValue === 0 && hoursValue === 0) {
    throw new Error(`Total ${attribute} time must be greater than zero.`);
  }

  if (hoursValue > 23) {
    throw new Error(`${attribute} time hours must be at least 0 and at most 23.`);
  }

  return { days: daysValue, hours: hoursValue };
}

export function validateStreet(street: FormDataEntryValue | null): string {
  if (!street) {
    throw new Error("No street address provided.");
  }

  let streetStr = String(street).trim();

  streetStr = streetStr.replace(/\s+/g, " ");

  if (streetStr.length > 100) {
    throw new Error("Street address must not exceed 100 characters.");
  }

  const validChars = /^[a-zA-Z0-9.,\-\s]+$/;

  if (!validChars.test(streetStr)) {
    throw new Error("Street address contains invalid characters.");
  }

  return streetStr;
}

// Does not work for websites that block API requests like Twitter.

export async function validateLink(link: string): Promise<string> {
  if (!link) {
    throw new Error("No booking system link provided.");
  }

  let linkStr = String(link).trim();

  if (!/^https?:\/\//i.test(linkStr)) {
    linkStr = `https://${linkStr}`;
  }

  console.log(linkStr)

  const linkFormat = /^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;

  if (!linkFormat.test(linkStr)) {
    throw new Error(`(${linkStr}) Booking system link must be valid.`);
  }

  try {
    const response = await fetch(linkStr, { method: "HEAD" });
    if (!response.ok) {
      throw new Error("Booking system link is unreachable.");
    }
  } catch (error) {
    throw new Error("Booking system link is unreachable.");
  }

  return linkStr;
}