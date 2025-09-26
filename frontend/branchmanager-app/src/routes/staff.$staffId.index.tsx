import { useStaffServiceGetV1StaffByStaffId } from "@fineract-apps/fineract-api";
import { Card } from "@fineract-apps/ui";
import { createFileRoute } from "@tanstack/react-router";

function StaffDetailPage() {
	const { staffId } = Route.useParams();
	const id = Number(staffId);
	const { data, isLoading, isError, error } =
		useStaffServiceGetV1StaffByStaffId({ staffId: id }, ["staff", id]);

	return (
		<div className="px-6 py-6">
			<h1 className="text-2xl font-bold text-gray-900 mb-6">Staff Details</h1>
			{isLoading && <div>Loading...</div>}
			{isError && (
				<div className="text-red-600">
					{(error as Error)?.message ?? "Error"}
				</div>
			)}
			{!isLoading && !isError && data && (
				<Card
					title={
						<span className="text-xl">
							{data.displayName || `${data.firstname} ${data.lastname}`}
						</span>
					}
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
						<div>
							<p className="text-gray-500">External ID</p>
							<p className="font-medium">{data.externalId || "-"}</p>
						</div>
						<div>
							<p className="text-gray-500">Mobile</p>
							<p className="font-medium">{data.mobileNo || "-"}</p>
						</div>
						<div>
							<p className="text-gray-500">Office</p>
							<p className="font-medium">{data.officeName || "-"}</p>
						</div>
						<div>
							<p className="text-gray-500">Loan Officer</p>
							<p className="font-medium">{data.isLoanOfficer ? "Yes" : "No"}</p>
						</div>
						<div>
							<p className="text-gray-500">Active</p>
							<p className="font-medium">{data.isActive ? "Yes" : "No"}</p>
						</div>
						<div>
							<p className="text-gray-500">Joining Date</p>
							<p className="font-medium">{data.joiningDate || "-"}</p>
						</div>
					</div>
				</Card>
			)}
		</div>
	);
}

export const Route = createFileRoute("/staff/$staffId/")({
	component: StaffDetailPage,
});
