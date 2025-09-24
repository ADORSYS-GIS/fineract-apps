import { Card } from "@fineract-apps/ui";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/fund")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="mt-4">
			{/* Section title */}
			<h1 className="text-2xl font-bold text-gray-900">Fund Management</h1>

			{/* Cards for sub-features */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Card className="hoverable cursor-pointer">
					<Link
						to="/funds/allocate"
						className="block w-full h-full p-4 text-center font-medium text-gray-700 hover:text-green-600"
					>
						Allocate Funds
					</Link>
				</Card>

				<Card className="hoverable cursor-pointer">
					<Link
						to="/funds/settle"
						className="block w-full h-full p-4 text-center font-medium text-gray-700 hover:text-green-600"
					>
						Settle Funds
					</Link>
				</Card>
			</div>
		</div>
	);
}
