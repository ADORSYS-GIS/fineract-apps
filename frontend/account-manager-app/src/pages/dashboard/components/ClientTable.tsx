import { GetClientsPageItemsResponse } from "@fineract-apps/fineract-api";
import { Button } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { getStatusClass, getStatusFromCode } from "../utils";

interface ClientTableProps {
	clients: GetClientsPageItemsResponse[];
	onActivateClient: (client: GetClientsPageItemsResponse) => void;
}

export const ClientTable: FC<ClientTableProps> = ({
	clients,
	onActivateClient,
}) => {
	return (
		<div className="hidden md:block">
			<table className="min-w-full bg-white">
				<thead>
					<tr>
						<th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Name
						</th>
						<th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Account No.
						</th>
						<th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Office
						</th>
						<th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Email
						</th>
						<th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Status
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
										{client.emailAddress ?? "N/A"}
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
											{clientStatus}
										</span>
									</Link>
								</td>
								<td className="py-4 px-6 whitespace-nowrap text-right">
									{clientStatus === "Pending" && (
										<Button
											variant="outline"
											onClick={() => onActivateClient(client)}
										>
											Activate
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
