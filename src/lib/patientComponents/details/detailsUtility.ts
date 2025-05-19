export function normalizePhoneNumberForSMS(phoneNumber: string): string {
	const sms = phoneNumber.trim().replace(/[^\d+]/g, "");

	if (sms.startsWith("+63")) {
		return sms;
	} else if (sms.startsWith("0")) {
		return "+63" + sms.slice(1);
	} else {
		throw new Error("The SMS is not SMS-ing.");
	}
}