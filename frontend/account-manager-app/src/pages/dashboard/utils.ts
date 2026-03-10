export const getStatusClass = (status: string) => {
	switch (status) {
		case "Active":
			return "bg-green-100 text-green-800";
		case "Submitted and pending approval":
			return "bg-yellow-100 text-yellow-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

export const getStatusFromCode = (code = "") => {
	const status = code.split(".")[1] || "";
	return status.charAt(0).toUpperCase() + status.slice(1);
};
