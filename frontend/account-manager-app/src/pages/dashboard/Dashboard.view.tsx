import { GetClientsPageItemsResponse } from "@fineract-apps/fineract-api";
import { Button, Card, Pagination, SearchBar } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { Briefcase, Mail, PhoneCallIcon, UserPlus } from "lucide-react";
import { FC, useState } from "react";
import { ActivateClient } from "./components";
import { useDashboard } from "./useDashboard";

const getStatusClass = (status: string) => {
	switch (status) {
		case "Active":
			return "bg-green-100 text-green-800";
		case "Closed":
			return "bg-red-100 text-red-800";
		default:
			return "bg-yellow-100 text-yellow-800";
	}
};

export const DashboardView: FC<ReturnType<typeof useDashboard>> = ({
	searchValue,
	onSearchValueChange,
	onSearch,
	clients,
	isFetchingClients,
	currentPage,
	totalPages,
	onPageChange,
}) => {
	const [selectedClient, setSelectedClient] =
		useState<GetClientsPageItemsResponse | null>(null);

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-gray-800">Clients</h1>
					<Link to="/create-client">
						<button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
							<UserPlus className="h-6 w-6" />
						</button>
					</Link>
				</div>

				<div className="mb-6">
					<SearchBar
						value={searchValue}
						onValueChange={onSearchValueChange}
						onSearch={onSearch}
						placeholder="Search clients by name"
						className="w-full"
					/>
				</div>

				{isFetchingClients ? (
					<p>Loading clients...</p>
				) : (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{clients.map((client: GetClientsPageItemsResponse) => (
								<Card
									key={client.id}
									className="p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow w-full"
								>
									<Link
										to="/client-details/$clientId"
										params={{ clientId: String(client.id) }}
									>
										<div className="flex justify-between items-start">
											<div>
												<h2 className="text-lg font-semibold text-gray-900">
													{client.displayName}
												</h2>
												<p className="text-sm text-gray-500">
													Account No: {client.accountNo}
												</p>
											</div>
											<span
												className={`px-2 py-1 text-xs font-semibold rounded-full ${
													client.status
														? getStatusClass(client.status.code ?? "")
														: ""
												}`}
											>
												{client.status?.code}
											</span>
										</div>
										<div className="mt-4 space-y-2">
											<div className="flex items-center text-sm text-gray-600">
												<Briefcase className="h-4 w-4 mr-2" />
												<span>{client.officeName}</span>
											</div>
											<div className="flex items-center text-sm text-gray-600">
												<Mail className="h-4 w-4 mr-2" />
												<span>{client.emailAddress || "N/A"}</span>
											</div>
										</div>
									</Link>
									{client.status?.code === "Pending" && (
										<div className="mt-4 flex justify-end">
											<Button
												variant="outline"
												onClick={() => setSelectedClient(client)}
											>
												Activate
											</Button>
										</div>
									)}
								</Card>
							))}
						</div>
						<div className="mt-4">
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={onPageChange}
							/>
						</div>
					</>
				)}
			</main>
			{selectedClient && (
				<ActivateClient
					client={selectedClient}
					onClose={() => setSelectedClient(null)}
				/>
			)}
		</div>
	);
};
