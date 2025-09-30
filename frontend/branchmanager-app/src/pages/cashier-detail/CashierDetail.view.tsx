import { Button, Card } from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import { CashierDetailViewProps } from "./CashierDetail.types";

export const CashierDetailView = ({
	data,
	isLoading,
	error,
}: CashierDetailViewProps) => {
	const navigate = useNavigate();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6">
			<Card>
				<h1 className="text-2xl font-bold">{data.staffName}</h1>
				<p>Description: {data.description}</p>
				<p>
					Start Date:{" "}
					{Array.isArray(data.startDate)
						? data.startDate.join("-")
						: data.startDate}
				</p>
				<p>
					End Date:{" "}
					{Array.isArray(data.endDate) ? data.endDate.join("-") : data.endDate}
				</p>
				<p>Full Day: {data.isFullDay ? "Yes" : "No"}</p>
			</Card>
			<div className="flex justify-center gap-4 mt-4">
				<Button
					onClick={() =>
						navigate({
							to: "/tellers/$tellerId/cashiers/$cashierId/settle",
							params: {
								tellerId: String(data.tellerId),
								cashierId: String(data.id),
							},
						})
					}
				>
					Settle
				</Button>
				<Button
					onClick={() =>
						navigate({
							to: "/tellers/$tellerId/cashiers/$cashierId/allocate",
							params: {
								tellerId: String(data.tellerId),
								cashierId: String(data.id),
							},
						})
					}
				>
					Allocate
				</Button>
			</div>
		</div>
	);
};
