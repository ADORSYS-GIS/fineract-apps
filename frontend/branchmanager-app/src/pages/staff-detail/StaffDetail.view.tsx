import { Card } from "@fineract-apps/ui";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";

export type StaffDetailData = {
	firstname: string;
	lastname: string;
	externalId?: string;
	mobileNo?: string;
	officeName?: string;
	isLoanOfficer?: boolean;
	isActive?: boolean;
	joiningDate?: string;
};

export const StaffDetailView = ({
	data,
	isLoading,
	error,
	title,
}: {
	data?: StaffDetailData;
	isLoading: boolean;
	error?: string;
	title?: string;
}) => {
	const { t } = useTranslation();

	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
			<PageHeader title={title} to="/staff" />
			<div className="flex justify-center">
				<div className="w-full max-w-2xl mx-auto">
					{isLoading && <div>{t("loading")}</div>}
					{error && <div className="text-red-600">{error}</div>}
					{!isLoading && !error && data && (
						<Card>
							<div className="grid grid-cols-2 gap-x-8 gap-y-4 p-6">
								<p className="text-gray-500">{t("firstName")}</p>
								<p className="font-medium">{data.firstname ?? "-"}</p>
								<p className="text-gray-500">{t("lastName")}</p>
								<p className="font-medium">{data.lastname ?? "-"}</p>
								<p className="text-gray-500">{t("office")}</p>
								<p className="font-medium">{data.officeName ?? "-"}</p>
								<p className="text-gray-500">{t("isLoanOfficer")}</p>
								<p className="font-medium">
									{data.isLoanOfficer ? t("yes") : t("no")}
								</p>
								<p className="text-gray-500">{t("mobileNumberForSms")}</p>
								<p className="font-medium">{data.mobileNo ?? "-"}</p>
								<p className="text-gray-500">{t("status")}</p>
								<p className="font-medium">
									{data.isActive ? t("active") : t("inactive")}
								</p>
								<p className="text-gray-500">{t("joiningDate")}</p>
								<p className="font-medium">{data.joiningDate ?? "-"}</p>
							</div>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
};
