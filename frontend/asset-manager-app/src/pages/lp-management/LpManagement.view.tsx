import { Card } from "@fineract-apps/ui";
import { AlertTriangle, Building2, Search } from "lucide-react";
import { FC } from "react";
import { useLpManagement } from "./useLpManagement";

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n));

const Field: FC<{ label: string; value?: string | number | null }> = ({
	label,
	value,
}) => (
	<div>
		<p className="text-xs text-gray-500">{label}</p>
		<p className="font-medium text-sm">{value ?? "—"}</p>
	</div>
);

export const LpManagementView: FC<ReturnType<typeof useLpManagement>> = ({
	lookupId,
	setLookupId,
	handleLookup,
	registerForm,
	setRegisterForm,
	showRegisterForm,
	setShowRegisterForm,
	handleRegister,
	isRegistering,
	selectedLpId,
	lpDetail,
	isLoadingDetail,
	isDetailError,
	shortfalls,
	isLoadingShortfalls,
}) => {
	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				<div className="flex justify-between items-center mb-6">
					<div>
						<h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
							<Building2 className="w-6 h-6" />
							LP Management
						</h1>
						<p className="text-sm text-gray-500 mt-1">
							Register liquidity providers and view their account details
						</p>
					</div>
					<button
						type="button"
						onClick={() => setShowRegisterForm((v) => !v)}
						className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
					>
						{showRegisterForm ? "Cancel" : "Register LP"}
					</button>
				</div>

				{/* Register form */}
				{showRegisterForm && (
					<Card className="p-4 mb-6">
						<h2 className="text-base font-semibold text-gray-800 mb-4">
							Register New LP
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
							<div>
								<label className="block text-xs text-gray-500 mb-1">
									Fineract Client ID *
								</label>
								<input
									type="number"
									value={registerForm.lpClientId}
									onChange={(e) =>
										setRegisterForm((f) => ({
											...f,
											lpClientId: e.target.value,
										}))
									}
									placeholder="e.g. 42"
									className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<label className="block text-xs text-gray-500 mb-1">
									LP Name *
								</label>
								<input
									type="text"
									value={registerForm.lpClientName}
									onChange={(e) =>
										setRegisterForm((f) => ({
											...f,
											lpClientName: e.target.value,
										}))
									}
									placeholder="e.g. Ecobank Cameroun"
									className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>
						<p className="text-xs text-gray-400 mb-4">
							This will atomically provision 3 Fineract savings accounts (LSAV,
							LSPD, LTAX) for the LP.
						</p>
						<button
							type="button"
							onClick={handleRegister}
							disabled={isRegistering}
							className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg"
						>
							{isRegistering ? "Registering…" : "Confirm Registration"}
						</button>
					</Card>
				)}

				{/* Lookup form */}
				<Card className="p-4 mb-6">
					<h2 className="text-base font-semibold text-gray-800 mb-3">
						Look Up LP
					</h2>
					<div className="flex gap-2">
						<input
							type="number"
							value={lookupId}
							onChange={(e) => setLookupId(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleLookup()}
							placeholder="Enter LP Client ID"
							className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							type="button"
							onClick={handleLookup}
							className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
						>
							<Search className="w-4 h-4" />
							Look Up
						</button>
					</div>
				</Card>

				{/* LP Detail */}
				{selectedLpId != null && (
					<>
						{isLoadingDetail && (
							<Card className="p-4 mb-4">
								<p className="text-sm text-gray-500">Loading LP details…</p>
							</Card>
						)}
						{isDetailError && (
							<Card className="p-4 mb-4 bg-red-50">
								<p className="text-sm text-red-700">
									LP {selectedLpId} not found. Please register it first.
								</p>
							</Card>
						)}
						{lpDetail && (
							<Card className="p-4 mb-6">
								<h2 className="text-base font-semibold text-gray-800 mb-4">
									LP: {lpDetail.lpClientName} (ID: {lpDetail.lpClientId})
								</h2>
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
									<Field
										label="Cash Account ID"
										value={lpDetail.cashAccountId}
									/>
									<Field
										label="Cash Account No"
										value={lpDetail.cashAccountNo}
									/>
									<Field
										label="Spread Account ID"
										value={lpDetail.spreadAccountId}
									/>
									<Field
										label="Spread Account No"
										value={lpDetail.spreadAccountNo}
									/>
									<Field label="Tax Account ID" value={lpDetail.taxAccountId} />
									<Field label="Tax Account No" value={lpDetail.taxAccountNo} />
								</div>
							</Card>
						)}

						{/* Shortfall */}
						{lpDetail && (
							<Card className="overflow-hidden mb-6">
								<div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
									<h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
										<AlertTriangle className="w-4 h-4 text-orange-500" />
										Upcoming Obligations &amp; Shortfall
									</h2>
								</div>

								{isLoadingShortfalls ? (
									<div className="p-4">
										<p className="text-sm text-gray-500">Loading…</p>
									</div>
								) : shortfalls ? (
									<>
										<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-gray-50">
											<Field
												label="Cash Balance"
												value={`${fmt(shortfalls.cashBalance)} XAF`}
											/>
											<Field
												label="Total Obligation"
												value={`${fmt(shortfalls.totalObligation)} XAF`}
											/>
											<Field
												label="Shortfall"
												value={`${fmt(shortfalls.totalShortfall)} XAF`}
											/>
										</div>
										{shortfalls.assets.length === 0 ? (
											<div className="p-6 text-center text-gray-500 text-sm">
												No upcoming coupon or income obligations.
											</div>
										) : (
											<div className="overflow-x-auto">
												<table className="min-w-full divide-y divide-gray-200">
													<thead className="bg-gray-50">
														<tr>
															<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
																Asset
															</th>
															<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
																Obligation (XAF)
															</th>
															<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
																Due Date
															</th>
														</tr>
													</thead>
													<tbody className="bg-white divide-y divide-gray-200">
														{shortfalls.assets.map((entry) => (
															<tr
																key={entry.assetId}
																className="hover:bg-gray-50"
															>
																<td className="px-4 py-3 text-sm font-medium text-gray-900">
																	{entry.symbol}
																	<span className="ml-1 text-xs text-gray-400">
																		{entry.assetName}
																	</span>
																</td>
																<td
																	className={`px-4 py-3 text-sm text-right font-medium ${
																		entry.obligation > 0
																			? "text-orange-700"
																			: "text-gray-500"
																	}`}
																>
																	{fmt(entry.obligation)}
																</td>
																<td className="px-4 py-3 text-sm text-right text-gray-500">
																	{entry.dueDate ?? "—"}
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
										)}
									</>
								) : null}
							</Card>
						)}
					</>
				)}
			</main>
		</div>
	);
};
