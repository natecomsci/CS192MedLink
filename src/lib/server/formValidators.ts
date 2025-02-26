import { promises as dns } from "dns";

export function validatePhone(phone: FormDataEntryValue | null): string {
  if (!phone) {
    throw new Error("No phone number provided.");
  }

  const phoneNumberStr = (phone as string).trim();

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

  const validSpaces = /^\+639\d{2} \d{3} \d{4}$|^09\d{2} \d{3} \d{4}$/;

  if (phoneNumberStr.includes(" ") && !validSpaces.test(phoneNumberStr)) {
    throw new Error(`(${phoneNumberStr}) Phone number spacing is incorrect.`);
  }

  return phoneNumberStr;
}

async function hasMXRecords(domain: string): Promise<boolean> {
  try {
      const records = await dns.resolveMx(domain);
      return records.length > 0;
  } catch (error) {
      return false;
  }
}

export async function validateEmail(email: string): Promise<string> {
  const emailFormat = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const consecutiveDots = /\.\./;

  if (!email) {
    throw new Error("No email provided.");
  }

  const emailStr = email.trim();

  if (!emailFormat.test(emailStr)) {
    throw new Error(`(${emailStr}) Email contains invalid characters.`);
  }

  if (consecutiveDots.test(emailStr)) {
    throw new Error(`(${emailStr}) Email contains consecutive dots.`);
  }

  const domain = emailStr.split("@")[1];

  if (!(await hasMXRecords(domain))) {
    throw new Error(`(${domain}) Email domain is invalid.`);
  }

  return emailStr;
}

export function validateOpenClose(open: FormDataEntryValue | null, close: FormDataEntryValue | null): {openingTime: Date, closingTime: Date} {
  const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!open || !close) {
    throw new Error("No opening and closing time provided.");
  }

  const openStr  = String(open).trim();
  const closeStr = String(close).trim();

  if (!timeFormat.test(openStr) || !timeFormat.test(closeStr)) {
    throw new Error("Invalid time format. Use HH:MM (24-hour format).");
  }

  const openHour  = Number(openStr.slice(0, 2));
  const openMin   = Number(openStr.slice(3, 5));
  const closeHour = Number(closeStr.slice(0, 2));
  const closeMin  = Number(closeStr.slice(3, 5));

  if (closeHour < openHour || (closeHour === openHour && closeMin <= openMin)) {
    throw new Error("Closing time must be later than opening time.");
  }

  return {openingTime: new Date("25 February 2025 "+String(open)+" UTC"), closingTime: new Date("25 February 2025 "+String(close)+" UTC")};
  /* 
  const today = new Date().toISOString();
  
  return {
    openingTime: `${today} ${openStr} UTC`,
    closingTime: `${today} ${closeStr} UTC`,
  };
  */
}

export function validateCoverageRadius(min: FormDataEntryValue | null, max: FormDataEntryValue | null): {minCoverageRadius: number, maxCoverageRadius: number} {
  const floatFormat = /^(0|[1-9]\d*)(\.\d{1,2})?$/;

  if (!min || !max) {
    throw new Error("No minimum and maximum coverage radius provided.");
  }

  const minStr = String(min).trim();
  const maxStr = String(max).trim();
  
  if (!floatFormat.test(minStr) || !floatFormat.test(maxStr)) {
    throw new Error("Coverage radius must be a valid float with up to two decimal places.");
  }

  const minCoverageRadius = parseFloat(minStr);
  const maxCoverageRadius = parseFloat(maxStr);

  if (Number(max) < Number(min)) {
    throw new Error("Max is less than min coverage radius.");
  }
  return { minCoverageRadius, maxCoverageRadius };
}

export function validateTurnaroundCompletionTime(days: FormDataEntryValue | null, hours: FormDataEntryValue | null): {days: number, hours: number} {
  const integerFormat = /^[0-9]+$/;
  
  if (!days || !hours) {
    throw new Error("No days or hours provided.");
  }

  const daysStr  = String(days).trim();
  const hoursStr = String(hours).trim();

  if (!integerFormat.test(daysStr) || !integerFormat.test(hoursStr)) {
    throw new Error("Days and hours must be non-negative integers.");
  }

  const daysValue  = Number(daysStr);
  const hoursValue = Number(hoursStr);

  if (daysValue === 0 && hoursValue === 0) {
    throw new Error("Total turnaround time must be greater than zero.");
  }

  if (hoursValue > 23) {
    throw new Error("Hours must be between 0 and 23 (inclusive).");
  }

  return { days: daysValue, hours: hoursValue };
}

export function validateStreet(street: FormDataEntryValue | null): string {
  const streetFormat = /^[a-zA-Z0-9.,\- ]+$/;

  if (!street) {
    throw new Error("No street address provided.");
  }

  let streetStr = String(street).trim();

  if (!streetFormat.test(streetStr)) {
    throw new Error(`(${streetStr}) Street address contains invalid characters.`);
  }

  streetStr = streetStr.replace(/\s+/g, " ");

  if (streetStr.length > 100) {
    throw new Error(`(${streetStr}) Street address is too long. Must not exceed 100 characters.`);
  }

  return streetStr;
}
