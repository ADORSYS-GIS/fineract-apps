import { Card } from "@fineract-apps/ui";
import { createFileRoute, Link } from "@tanstack/react-router";

function RouteComponent() {
	return (
		<div className="max-w-screen-xl mx-auto mt-4 p-4 sm:p-6">
			{/* Section title */}
			<h1 className="text-2xl font-bold text-gray-900">Fund Management</h1>

			{/* Cards for sub-features */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
				<Card className="hoverable cursor-pointer">
					<Link
						to="/approve/savings/account"
						className="block w-full h-full p-4 text-center font-medium text-gray-700 hover:text-green-600"
					>
						Pending Accounts
					</Link>
				</Card>

				<Card className="hoverable cursor-pointer">
					<div className="block w-full h-full p-4 text-center font-medium text-gray-700 hover:text-green-600">
						Pending Loans
					</div>
				</Card>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/approve/account")({
	component: RouteComponent,
});
