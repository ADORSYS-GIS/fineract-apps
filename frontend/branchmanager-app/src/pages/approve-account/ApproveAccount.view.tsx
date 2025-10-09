import { Card } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";

export const ApproveAccountView = () => (
	<div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
		<div className="mb-6">
			<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
				Fund Management
			</h1>
			<p className="text-gray-500 mt-1">
				Approve pending savings accounts and loans.
			</p>
		</div>
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
			<Card className="hoverable cursor-pointer">
				<Link
					to="/approve/savings/account"
					className="block w-full h-full p-6 text-center"
				>
					<h2 className="text-lg font-semibold text-gray-800">
						Pending Accounts
					</h2>
					<p className="text-gray-500 text-sm mt-1">
						Review and approve savings account applications.
					</p>
				</Link>
			</Card>
			<Card className="hoverable cursor-pointer">
				<div className="block w-full h-full p-6 text-center">
					<h2 className="text-lg font-semibold text-gray-800">Pending Loans</h2>
					<p className="text-gray-500 text-sm mt-1">
						Review and approve loan applications.
					</p>
				</div>
			</Card>
		</div>
	</div>
);
