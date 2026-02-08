import { FC } from "react";

const statusStyles: Record<string, string> = {
	PENDING: "bg-yellow-100 text-yellow-800",
	ACTIVE: "bg-green-100 text-green-800",
	HALTED: "bg-red-100 text-red-800",
	DELISTED: "bg-gray-100 text-gray-800",
};

export const StatusBadge: FC<{ status: string }> = ({ status }) => {
	const style = statusStyles[status] ?? "bg-gray-100 text-gray-800";
	return (
		<span
			className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}
		>
			{status}
		</span>
	);
};
