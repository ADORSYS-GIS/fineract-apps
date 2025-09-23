import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/fund")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<Link
				to="/funds/allocate"
				className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-gray-500 hover:text-green-600 hover:border-green-500 pb-3 pt-2 text-sm font-bold"
			>
				Allocate Funds
			</Link>
			<Link
				to="/funds/settle"
				className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-gray-500 hover:text-green-600 hover:border-green-500 pb-3 pt-2 text-sm font-bold"
			>
				Settle Funds
			</Link>
		</div>
	);
}
