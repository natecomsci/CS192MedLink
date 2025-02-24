export function validatePhone(phone: FormDataEntryValue | null): string {
  if (!phone) {
    throw new Error("No phone number provided.");
  }
  const phoneNumber = phone as string;

  const phoneFormat = /\+63 9[0-9]{2} [0-9]{3} [0-9]{4}/;
  if (!phoneFormat.test(phoneNumber) || phoneNumber.length !== 16) {
    throw new Error("Phone Number is not in the correct format.");
  }

  return phoneNumber;
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
  return {openingTime: String(open), closingTime: String(close)};
}

export function validateCoverageRadius(min: FormDataEntryValue | null, max: FormDataEntryValue | null): {minCoverageRadius: number, maxCoverageRadius: number} {
  if (!min || !max) {
    throw new Error("No minimum and maximum coverage radius provided.");
  }

  if (Number(max) < Number(max)) {
    throw new Error("Max is less than min coverage radius.");
  }
  return {minCoverageRadius: Number(min), maxCoverageRadius: Number(max)};
}

export function validateTurnaroundCompletionTime(days: FormDataEntryValue | null, hours: FormDataEntryValue | null): {days: number, hours: number} {
  if (!days || !hours) {
    throw new Error("No days or hours provided.");
  }

  if (Number(days) < 0 && Number(hours) <= 0) {
    throw new Error("Not enough time provided.");
  }
  return {days: Number(days), hours: Number(hours)};
}
