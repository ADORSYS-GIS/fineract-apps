export function formatToFineractDate(value: string): string {
	const date = new Date(value + "T00:00:00");
	if (isNaN(date.getTime())) {
		throw new Error("Invalid date value");
	}
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}
