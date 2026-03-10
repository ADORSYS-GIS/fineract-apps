import { Button } from "@fineract-apps/ui";
import { Calendar, Lock, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components";
import type { Closure } from "./useClosures";

interface ClosuresViewProps {
	closures: Closure[];
	isLoading: boolean;
	onCreateClosure: () => void;
	onDeleteClosure: (closureId: number, closingDate: string) => void;
}

export function ClosuresView({
	closures,
	isLoading,
	onCreateClosure,
	onDeleteClosure,
}: ClosuresViewProps) {
	const { t } = useTranslation();
	return (
		<div className="p-6 min-h-screen">
			<PageHeader
				title={t("accountingClosures")}
				subtitle={t("managePeriodEndAccountingClosures")}
				actions={[
					{
						label: t("createClosure"),
						onClick: onCreateClosure,
						icon: <Plus className="h-4 w-4" />,
					},
				]}
			/>

			{isLoading ? (
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="animate-pulse space-y-4">
						{[1, 2, 3].map((i) => (
							<div
								key={`loading-closure-${i}`}
								className="h-20 bg-gray-200 rounded"
							/>
						))}
					</div>
				</div>
			) : closures.length === 0 ? (
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
					<Lock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
					<h3 className="text-lg font-semibold mb-2">{t("noClosuresYet")}</h3>
					<p className="text-gray-500 mb-4">
						{t("createYourFirstAccountingClosure")}
					</p>
					<Button onClick={onCreateClosure} className="flex items-center gap-2">
						<Plus className="h-4 w-4" />
						{t("createFirstClosure")}
					</Button>
				</div>
			) : (
				<div className="space-y-4">
					{closures.map((closure) => (
						<div
							key={closure.id}
							className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
						>
							<div className="flex items-start justify-between">
								<div className="flex items-start gap-4 flex-1">
									<div className="p-3 bg-blue-50 rounded-lg">
										<Lock className="h-6 w-6 text-blue-600" />
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<h3 className="text-lg font-semibold">
												{closure.officeName}
											</h3>
											<span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
												{t("active")}
											</span>
										</div>
										<div className="space-y-2 text-sm text-gray-600">
											<div className="flex items-center gap-2">
												<Calendar className="h-4 w-4" />
												<span>
													{t("closingDate")}:{" "}
													<span className="font-medium text-gray-900">
														{new Date(closure.closingDate).toLocaleDateString(
															"en-US",
															{
																year: "numeric",
																month: "long",
																day: "numeric",
															},
														)}
													</span>
												</span>
											</div>
											{closure.createdDate && (
												<div className="flex items-center gap-2">
													<span>
														{t("created")}:{" "}
														{new Date(closure.createdDate).toLocaleDateString(
															"en-US",
														)}{" "}
														{closure.createdByUsername && (
															<span>
																{t("by")} {closure.createdByUsername}
															</span>
														)}
													</span>
												</div>
											)}
											{closure.comments && (
												<div className="mt-2 p-3 bg-gray-50 rounded-lg">
													<p className="text-sm italic">{closure.comments}</p>
												</div>
											)}
										</div>
									</div>
								</div>
								<Button
									onClick={() =>
										onDeleteClosure(closure.id, closure.closingDate)
									}
									variant="outline"
									className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
								>
									<Trash2 className="h-3 w-3" />
									{t("delete")}
								</Button>
							</div>
						</div>
					))}
				</div>
			)}

			{closures.length > 0 && (
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
					<div className="flex items-start gap-2 text-blue-800">
						<Lock className="h-5 w-5 mt-0.5" />
						<div className="text-sm">
							<p className="font-medium">{t("aboutAccountingClosures")}</p>
							<p className="mt-1">{t("accountingClosuresDescription")}</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
