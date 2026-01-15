import { GetClientsPageItemsResponse } from "@fineract-apps/fineract-api";
import { Button, Card, Pagination, SearchBar } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { Briefcase, Mail, UserPlus } from "lucide-react";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivateClient, ClientTable } from "./components";
import { useDashboard } from "./useDashboard";
import { getStatusClass, getStatusFromCode } from "./utils";

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
	const { t } = useTranslation();
	const [selectedClient, setSelectedClient] =
		useState<GetClientsPageItemsResponse | null>(null);

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				<div className="flex flex-col md:flex-row justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
						{t("accountManagerDashboard.title")}
					</h1>
					<div className="flex items-center space-x-4 w-full md:w-auto">
						<SearchBar
							value={searchValue}
							onValueChange={onSearchValueChange}
							onSearch={onSearch}
							placeholder={t("accountManagerDashboard.searchClientsByName")}
							className="w-full md:w-64"
						/>
						<Link to="/create-client">
							<Button className="flex items-center space-x-2">
								<UserPlus className="h-5 w-5" />
								<span>{t("accountManagerDashboard.addClient")}</span>
							</Button>
						</Link>
					</div>
				</div>

				{isFetchingClients ? (
					<p>{t("accountManagerDashboard.loadingClients")}</p>
				) : (
					<>
						<div className="md:hidden">
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
								{clients.map((client: GetClientsPageItemsResponse) => {
									const clientStatus = getStatusFromCode(client.status?.code);
									return (
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
															{t("accountManagerDashboard.accountNo")}:{" "}
															{client.accountNo}
														</p>
													</div>
													<span
														className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
															clientStatus,
														)}`}
													>
														{clientStatus}
													</span>
												</div>
												<div className="mt-4 space-y-2">
													<div className="flex items-center text-sm text-gray-600">
														<Briefcase className="h-4 w-4 mr-2" />
														<span>{client.officeName}</span>
													</div>
													<div className="flex items-center text-sm text-gray-600">
														<Mail className="h-4 w-4 mr-2" />
														<span>{client.emailAddress ?? t("common.na")}</span>
													</div>
												</div>
											</Link>
											{clientStatus === "Pending" && (
												<div className="mt-4 flex justify-end">
													<Button
														variant="outline"
														onClick={() => setSelectedClient(client)}
													>
														{t("accountManagerDashboard.activate")}
													</Button>
												</div>
											)}
										</Card>
									);
								})}
							</div>
						</div>
						<ClientTable
							clients={clients}
							onActivateClient={setSelectedClient}
						/>
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
