export const getStatusClass = (status: string) => {
	switch (status) {
		case "active":
			return "bg-green-100 text-green-800";
		case "submittedAndPendingApproval":
			return "bg-yellow-100 text-yellow-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

export const getStatusFromCode = (code = "") => {
	const status = code.split(".")[1] || "unknown";
	return status;
};
