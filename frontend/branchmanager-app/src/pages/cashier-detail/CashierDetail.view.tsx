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
		<div className="flex justify-center p-4 sm:p-6">
			<div className="w-full max-w-2xl">
				<Card className="w-full">
					<div className="p-6">
						<h1 className="text-2xl font-bold mb-4">{data.staffName}</h1>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
							<div>
								<p className="font-semibold text-gray-600">Description</p>
								<p className="text-gray-800">{data.description}</p>
							</div>
							<div>
								<p className="font-semibold text-gray-600">Full Day</p>
								<p className="text-gray-800">{data.isFullDay ? "Yes" : "No"}</p>
							</div>
							<div>
								<p className="font-semibold text-gray-600">Start Date</p>
								<p className="text-gray-800">
									{Array.isArray(data.startDate)
										? data.startDate.join("-")
										: data.startDate}
								</p>
							</div>
							<div>
								<p className="font-semibold text-gray-600">End Date</p>
								<p className="text-gray-800">
									{Array.isArray(data.endDate)
										? data.endDate.join("-")
										: data.endDate}
								</p>
							</div>
						</div>
					</div>
				</Card>
				<div className="flex justify-end gap-4 mt-4">
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
		</div>
	);
};
