import { GetClientsPageItemsResponse } from "@fineract-apps/fineract-api";
import { Button } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { getStatusClass, getStatusFromCode } from "../utils";

interface ClientTableProps {
	clients: GetClientsPageItemsResponse[];
	onActivateClient: (client: GetClientsPageItemsResponse) => void;
}

export const ClientTable: FC<ClientTableProps> = ({
	clients,
	onActivateClient,
}) => {
	const { t } = useTranslation();
	return (
		<div className="hidden md:block">
			<table className="min-w-full bg-white">
				<thead>
					<tr>
						<th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							{t("name")}
						</th>
						<th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							{t("accountNo")}
						</th>
						<th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							{t("office")}
						</th>
						<th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							{t("email")}
						</th>
						<th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							{t("status")}
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200">
					{clients.map((client) => {
						const clientStatus = getStatusFromCode(client.status?.code);
						return (
							<tr key={client.id} className="hover:bg-gray-50">
								<td className="py-4 px-6 whitespace-nowrap">
									<Link
										to="/client-details/$clientId"
										params={{ clientId: String(client.id) }}
										className="block"
									>
										{client.displayName}
									</Link>
								</td>
								<td className="py-4 px-6 whitespace-nowrap">
									<Link
										to="/client-details/$clientId"
										params={{ clientId: String(client.id) }}
										className="block"
									>
										{client.accountNo}
									</Link>
								</td>
								<td className="py-4 px-6 whitespace-nowrap">
									<Link
										to="/client-details/$clientId"
										params={{ clientId: String(client.id) }}
										className="block"
									>
										{client.officeName}
									</Link>
								</td>
								<td className="py-4 px-6 whitespace-nowrap">
									<Link
										to="/client-details/$clientId"
										params={{ clientId: String(client.id) }}
										className="block"
									>
										{client.emailAddress ?? t("notAvailable")}
									</Link>
								</td>
								<td className="py-4 px-6 whitespace-nowrap">
									<Link
										to="/client-details/$clientId"
										params={{ clientId: String(client.id) }}
										className="block"
									>
										<span
											className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(clientStatus)}`}
										>
											{t(clientStatus)}
										</span>
									</Link>
								</td>
								<td className="py-4 px-6 whitespace-nowrap text-right">
									{clientStatus === "pending" && (
										<Button
											variant="outline"
											onClick={() => onActivateClient(client)}
										>
											{t("activate")}
										</Button>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};
