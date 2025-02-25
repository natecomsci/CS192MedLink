import { promises as dns } from "dns";

export function validatePhone(phone: FormDataEntryValue | null): string {
  if (!phone) {
    throw new Error("No phone number provided.");
  }
  const phoneNumber = (phone as string).split(' ').join('');

  if (phoneNumber.slice(0, 4) !== "+639" && phoneNumber.slice(0, 2) !== "09") {
    console.log(phoneNumber.slice(0, 4), phoneNumber.slice(0, 2), phoneNumber.length)
    throw new Error("Phone Number country code is not in the right format. (use either +639 or 09)");
  }

  if ((phoneNumber.slice(0, 4) === "+639" && phoneNumber.length !==13) && (phoneNumber.slice(0, 2) !== "09" && phoneNumber.length !== 11)) {
    throw new Error("Phone Number length is not correct");
  }

  return phoneNumber;
}

async function hasMXRecords(domain: string): Promise<boolean> {
  try {
      const records = await dns.resolveMx(domain);
      return records.length > 0;
  } catch (error) {
      console.error(`DNS lookup failed for ${domain}:`, error);
      return false;
  }
}

export async function validateEmail(email: string): Promise<string | null> {
  const emailRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const consecutiveDotsRegex = /\.\./;

  if (!email) {
      console.log("Result: No email provided.");
      return null;
  }

  const emailStr = email.trim();

  if (!emailRegex.test(emailStr) || consecutiveDotsRegex.test(emailStr)) {
      console.log(`${emailStr} has an invalid format.`);
      return null;
  }

  const domain = emailStr.split("@")[1];

  if (!(await hasMXRecords(domain))) {
      console.log(`${domain} is not a valid domain, so ${emailStr} has an invalid format.`);
      return null;
  }

  console.log(`${emailStr} has a valid format.`);
  return emailStr;
}

export function validateOpenClose(open: FormDataEntryValue | null, close: FormDataEntryValue | null): {openingTime: string, closingTime: string} {
  if (!open || !close) {
    throw new Error("No opening and closing time provided.");
  }

  const openHour = Number(String(open).slice(0, 2))
  const openMin = Number(String(open).slice(3, 5))
  const closeHour = Number(String(close).slice(0, 2))
  const closeMin = Number(String(close).slice(3, 5))

  if (closeHour <= openHour && closeMin < openMin) {
    throw new Error("Closing time is earlier than opening time.");
  }
  return {openingTime: "25 February 2025 "+String(open)+" UTC", closingTime: "25 February 2025 "+String(close)+" UTC"};
}

export function validateCoverageRadius(min: FormDataEntryValue | null, max: FormDataEntryValue | null): {minCoverageRadius: number, maxCoverageRadius: number} {
  if (!min || !max) {
    throw new Error("No minimum and maximum coverage radius provided.");
  }

  if (Number(max) < Number(min)) {
    throw new Error("Max is less than min coverage radius.");
  }
  return {minCoverageRadius: Number(min), maxCoverageRadius: Number(max)};
}

export function validateTurnaroundCompletionTime(days: FormDataEntryValue | null, hours: FormDataEntryValue | null): {days: number, hours: number} {
  if (!days || !hours) {
    throw new Error("No days or hours provided.");
  }

  if (!Number.isInteger(Number(days)) || !!Number.isInteger(Number(hours))) {
    throw new Error("Values must be integers");
  }

  if (Number(days) < 0 && Number(hours) <= 0) {
    throw new Error("Not enough time provided.");
  }

  if (Number(hours) > 0) {
    throw new Error("Hours must be between 0 and 23 (inclusive)");
  }

  return {days: Number(days), hours: Number(hours)};
}

export function validateStreet(street: FormDataEntryValue | null): string {
  if (!street) {
    throw new Error("No street address provided.");
  }

  if (String(street).length > 100) {
    throw new Error("Street address is too long. Must not exceed 100 characters");
  }

  return String(street);
}
