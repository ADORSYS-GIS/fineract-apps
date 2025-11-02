import { Card } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";

export const ApproveAccountView = () => (
	<div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
		<h1 className="text-2xl font-bold mb-6">Approve Account</h1>
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
			<Card className="hoverable cursor-pointer">
				<Link
					to="/approve/savings/account"
					search={{}}
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
				<Link
					to="/approve/loans"
					search={{ q: "" }}
					className="block w-full h-full p-6 text-center"
				>
					<h2 className="text-lg font-semibold text-gray-800">Pending Loans</h2>
					<p className="text-gray-500 text-sm mt-1">
						Review and approve loan applications.
					</p>
				</Link>
			</Card>
		</div>
	</div>
);
