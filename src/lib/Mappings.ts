export function dateToTimeMapping(date: Date | undefined): string {
    if (!date) {
        return ""
    }

    return date.toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit", hour12: true});
}

export function completionTimeMapping(completionTimeD: number, completionTimeH: number): string {
	if (completionTimeD > 0 && completionTimeH > 0) {
		return `${completionTimeD} day${completionTimeD === 1 ? "" : "s"} and ${completionTimeH} hour${completionTimeH === 1 ? "" : "s"}`;
	} else if (completionTimeD > 0) {
		return `${completionTimeD} day${completionTimeD === 1 ? "" : "s"}`;
	} else if (completionTimeH > 0) {
		return `${completionTimeH} hour${completionTimeH === 1 ? "" : "s"}`;
	} else {
		return "Less than an hour";
	}
}

export function moneyMapping(money: number): string {
    return `${money} peso${money > 1 ? "s" : ""}`;
}

export function updatedAtMapping(updatedAt: Date): string {
	const now = new Date();

	const elapsed = now.getTime() - updatedAt.getTime();

	const seconds = Math.floor(elapsed / 1000);

	if (seconds < 60) {
        return "seconds ago";
    }

	const minutes = Math.floor(seconds / 60);

	if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    }

	const hours = Math.floor(minutes / 60);

	const remainingMinutes = minutes % 60;

	if (hours < 24) {
		return `${hours} hour${hours === 1 ? "" : "s"}${remainingMinutes > 0 ? ` and ${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"}` : ""} ago`;
	}

	const days = Math.floor(hours / 24);

	const remainingHours = hours % 24;

	return `${days} day${days === 1 ? "" : "s"}${remainingHours > 0 || remainingMinutes > 0 ? `, ${remainingHours} hour${remainingHours === 1 ? "" : "s"}${remainingMinutes > 0 ? ` and ${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"}` : ""}` : ""} ago`;
}
