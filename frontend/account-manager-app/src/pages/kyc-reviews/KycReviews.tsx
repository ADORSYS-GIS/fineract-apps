import { Button, Card } from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import {
	CheckCircle,
	ClipboardCheck,
	Clock,
	Eye,
	Search,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useKycStats, useKycSubmissions } from "@/hooks/useKycReviews";

function StatCard({
	title,
	value,
	icon: Icon,
	color,
}: {
	title: string;
	value: string | number;
	icon: React.ComponentType<{ className?: string }>;
	color: "blue" | "green" | "red" | "purple";
}) {
	const colorClasses = {
		blue: "bg-blue-100 text-blue-600",
		green: "bg-green-100 text-green-600",
		red: "bg-red-100 text-red-600",
		purple: "bg-purple-100 text-purple-600",
	};

	return (
		<Card className="p-6">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm text-gray-500">{title}</p>
					<p className="text-2xl font-bold mt-1">{value}</p>
				</div>
				<div className={`p-3 rounded-full ${colorClasses[color]}`}>
					<Icon className="w-6 h-6" />
				</div>
			</div>
		</Card>
	);
}

function StatusBadge({ status }: { status: string }) {
	const { t } = useTranslation();

	const statusStyles: Record<string, string> = {
		pending: "bg-yellow-100 text-yellow-800",
		approved: "bg-green-100 text-green-800",
		rejected: "bg-red-100 text-red-800",
		info_requested: "bg-blue-100 text-blue-800",
	};

	const statusLabels: Record<string, string> = {
		pending: t("kycReviews.pending"),
		approved: t("kycReviews.approved"),
		rejected: t("kycReviews.rejected"),
		info_requested: t("kycReviews.infoRequested"),
	};

	return (
		<span
			className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}
		>
			{statusLabels[status] || status}
		</span>
	);
}

export function KycReviews() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [status, setStatus] = useState<string>("all");
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(0);

	const { data: stats, isLoading: statsLoading } = useKycStats();
	const { data: submissions, isLoading: submissionsLoading } =
		useKycSubmissions({
			status: status !== "all" ? status : undefined,
			page,
			size: 10,
			search: search || undefined,
		});

	const formatTime = (minutes: number) => {
		if (minutes < 60) return `${minutes}m`;
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	};

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold">{t("kycReviews.title")}</h1>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard
					title={t("kycReviews.pendingReviews")}
					value={statsLoading ? "..." : stats?.pendingCount || 0}
					icon={ClipboardCheck}
					color="blue"
				/>
				<StatCard
					title={t("kycReviews.approvedToday")}
					value={statsLoading ? "..." : stats?.approvedToday || 0}
					icon={CheckCircle}
					color="green"
				/>
				<StatCard
					title={t("kycReviews.rejectedToday")}
					value={statsLoading ? "..." : stats?.rejectedToday || 0}
					icon={XCircle}
					color="red"
				/>
				<StatCard
					title={t("kycReviews.avgReviewTime")}
					value={
						statsLoading ? "..." : formatTime(stats?.avgReviewTimeMinutes || 0)
					}
					icon={Clock}
					color="purple"
				/>
			</div>

			{/* Filters */}
			<Card className="p-4">
				<div className="flex flex-col md:flex-row gap-4">
					<div className="flex-1">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<input
								type="text"
								placeholder={t("kycReviews.searchPlaceholder")}
								value={search}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									setSearch(e.target.value);
									setPage(0);
								}}
								className="pl-10 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
							/>
						</div>
					</div>
					<div className="w-full md:w-48">
						<select
							value={status}
							onChange={(e) => {
								setStatus(e.target.value);
								setPage(0);
							}}
							className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
						>
							<option value="all">{t("kycReviews.allStatuses")}</option>
							<option value="pending">{t("kycReviews.pending")}</option>
							<option value="approved">{t("kycReviews.approved")}</option>
							<option value="rejected">{t("kycReviews.rejected")}</option>
							<option value="info_requested">
								{t("kycReviews.infoRequested")}
							</option>
						</select>
					</div>
				</div>
			</Card>

			{/* Submissions Table */}
			<Card>
				<div className="p-4 border-b">
					<h2 className="text-lg font-semibold">
						{t("kycReviews.allSubmissions")}
					</h2>
				</div>
				<div className="overflow-x-auto">
					{submissionsLoading ? (
						<div className="p-8 text-center text-gray-500">
							{t("kycReviews.loading")}
						</div>
					) : submissions?.content.length === 0 ? (
						<div className="p-8 text-center text-gray-500">
							{t("kycReviews.noSubmissions")}
						</div>
					) : (
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										{t("kycReviews.customer")}
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										{t("kycReviews.email")}
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										{t("kycReviews.tier")}
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										{t("kycReviews.submitted")}
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										{t("kycReviews.status")}
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										{t("kycReviews.actions")}
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{submissions?.content.map((submission) => (
									<tr key={submission.externalId} className="hover:bg-gray-50">
										<td className="px-4 py-4 whitespace-nowrap">
											<div className="font-medium text-gray-900">
												{submission.firstName} {submission.lastName}
											</div>
										</td>
										<td className="px-4 py-4 whitespace-nowrap text-gray-500">
											{submission.email}
										</td>
										<td className="px-4 py-4 whitespace-nowrap">
											<span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded">
												Tier {submission.kycTier}
											</span>
										</td>
										<td className="px-4 py-4 whitespace-nowrap text-gray-500">
											{new Date(submission.submittedAt).toLocaleDateString()}
										</td>
										<td className="px-4 py-4 whitespace-nowrap">
											<StatusBadge status={submission.kycStatus} />
										</td>
										<td className="px-4 py-4 whitespace-nowrap">
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													navigate({
														to: "/kyc-reviews/$externalId",
														params: { externalId: submission.externalId },
													})
												}
											>
												<Eye className="w-4 h-4 mr-1" />
												{t("kycReviews.review")}
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
				{/* Pagination */}
				{submissions && submissions.totalPages > 1 && (
					<div className="px-4 py-3 border-t flex items-center justify-between">
						<div className="text-sm text-gray-500">
							Page {submissions.number + 1} of {submissions.totalPages}
						</div>
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								disabled={submissions.number === 0}
								onClick={() => setPage((p) => Math.max(0, p - 1))}
							>
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								disabled={submissions.number >= submissions.totalPages - 1}
								onClick={() => setPage((p) => p + 1)}
							>
								Next
							</Button>
						</div>
					</div>
				)}
			</Card>
		</div>
	);
}
