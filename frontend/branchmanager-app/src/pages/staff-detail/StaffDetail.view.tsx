import { Card } from "@fineract-apps/ui";

export type StaffDetailData = {
	title: string;
	externalId?: string;
	mobileNo?: string;
	officeName?: string;
	isLoanOfficer?: boolean;
	isActive?: boolean;
	joiningDate?: string;
};

export const StaffDetailView = ({
	data,
	isLoading,
	error,
}: {
	data?: StaffDetailData;
	isLoading: boolean;
	error?: string;
}) => {
	return (
		<div className="px-6 py-6">
			<h1 className="text-2xl font-bold text-gray-900 mb-6">Staff Details</h1>
			{isLoading && <div>Loading...</div>}
			{error && <div className="text-red-600">{error}</div>}
			{!isLoading && !error && data && (
				<Card title={<span className="text-xl">{data.title}</span>}>
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
};
