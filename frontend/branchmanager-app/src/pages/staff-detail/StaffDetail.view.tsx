import { Card } from "@fineract-apps/ui";
import { PageHeader } from "@/components/PageHeader";

export type StaffDetailData = {
	firstname: string;
	lastname: string;
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
	title,
}: {
	data?: StaffDetailData;
	isLoading: boolean;
	error?: string;
	title?: string;
}) => {
	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
			<PageHeader title={title} />
			<div className="flex justify-center">
				<div className="w-full max-w-2xl mx-auto">
					{isLoading && <div>Loading...</div>}
					{error && <div className="text-red-600">{error}</div>}
					{!isLoading && !error && data && (
						<Card>
							<div className="grid grid-cols-2 gap-x-8 gap-y-4 p-6">
								<p className="text-gray-500">First Name</p>
								<p className="font-medium">{data.firstname ?? "-"}</p>
								<p className="text-gray-500">Last Name</p>
								<p className="font-medium">{data.lastname ?? "-"}</p>
								<p className="text-gray-500">Office</p>
								<p className="font-medium">{data.officeName ?? "-"}</p>
								<p className="text-gray-500">Is Loan Officer</p>
								<p className="font-medium">
									{data.isLoanOfficer ? "Yes" : "No"}
								</p>
								<p className="text-gray-500">Mobile Number for SMS</p>
								<p className="font-medium">{data.mobileNo ?? "-"}</p>
								<p className="text-gray-500">Status</p>
								<p className="font-medium">
									{data.isActive ? "Active" : "Inactive"}
								</p>
								<p className="text-gray-500">Joining Date</p>
								<p className="font-medium">{data.joiningDate ?? "-"}</p>
							</div>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
};
