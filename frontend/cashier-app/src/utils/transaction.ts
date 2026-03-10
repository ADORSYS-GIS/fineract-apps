/**
 * Extracts the client name from a transaction note.
 * It looks for a "Client:" prefix and extracts the name that follows.
 * It handles formats like "..., Client:4-jude tambe" and "..., Client:jude tambe".
 *
 * @example
 * // returns "jude tambe"
 * extractClientNameFromTxnNote("withdrawal, Sav:4-000000004,Client:4-jude tambe");
 *
 * @param txnNote - The transaction note string.
 * @returns The extracted client name, or an empty string if the pattern is not found.
 */
export const extractClientNameFromTxnNote = (
	txnNote: string | undefined | null,
): string => {
	if (!txnNote) {
		return "";
	}

	const regex = /Client:(\d+-)?(.*)/;
	const match = regex.exec(txnNote);
	if (match?.[2]) {
		return match[2].trim();
	}

	return "";
};
