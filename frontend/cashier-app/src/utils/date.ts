export const formatDateArray = (dateArray: number[] | undefined) => {
	if (!dateArray || dateArray.length < 3) {
		return null;
	}
	const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
	return `${String(date.getDate()).padStart(2, "0")} ${date.toLocaleString(
		"en",
		{
			month: "long",
		},
	)} ${date.getFullYear()}`;
};
