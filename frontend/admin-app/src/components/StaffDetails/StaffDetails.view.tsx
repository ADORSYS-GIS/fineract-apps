import { Button, Card } from "@fineract-apps/ui";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Edit } from "lucide-react";
import { UserStatusBadge } from "../UserStatusBadge";
import { useStaffDetails } from "./useStaffDetails";

export const StaffDetailsView = () => {
	const { staffData, isLoadingStaff } = useStaffDetails();
	const { staffId } = useParams({ from: "/staff/$staffId/" });

	if (isLoadingStaff) {
		return (
			<Card variant="elevated">
				<div className="p-8 text-center text-gray-500">Loading staff...</div>
			</Card>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center p-6">
			<div className="w-full max-w-5xl flex justify-between items-center mb-6">
				<div>
					<Link to="/staff/list">
						<Button variant="ghost" size="sm">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Staff
						</Button>
					</Link>
					<h1 className="text-2xl font-bold text-gray-800 mt-4">
						{staffData?.displayName}
					</h1>
					<p className="text-sm text-gray-600 mt-1">Staff Details</p>
				</div>
				<Link to="/staff/$staffId/edit" params={{ staffId }}>
					<Button>
						<Edit className="w-4 h-4 mr-2" />
						Edit
					</Button>
				</Link>
			</div>

			<Card variant="elevated" className="p-8 w-full max-w-5xl">
				<div className="grid grid-cols-2 gap-x-8 gap-y-4">
					<div className="space-y-4">
						<p className="font-medium text-gray-500">First Name</p>
						<p className="font-medium text-gray-500">Last Name</p>
						<p className="font-medium text-gray-500">Office</p>
						<p className="font-medium text-gray-500">Is Loan Officer</p>
						<p className="font-medium text-gray-500">Mobile Number for SMS</p>
						<p className="font-medium text-gray-500">Status</p>
						<p className="font-medium text-gray-500">Joining Date</p>
					</div>
					<div className="space-y-4">
						<p className="text-gray-900">{staffData?.firstname}</p>
						<p className="text-gray-900">{staffData?.lastname}</p>
						<p className="text-gray-900">{staffData?.officeName}</p>
						<p className="text-gray-900">
							{staffData?.isLoanOfficer ? "Yes" : "No"}
						</p>
						<p className="text-gray-900">{staffData?.mobileNo || "N/A"}</p>
						<p className="text-gray-900">
							<UserStatusBadge isActive={staffData?.isActive || false} />
						</p>
						<p className="text-gray-900">
							{staffData?.joiningDate
								? new Date(staffData.joiningDate).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})
								: "N/A"}
						</p>
					</div>
				</div>
			</Card>
		</div>
	);
};
