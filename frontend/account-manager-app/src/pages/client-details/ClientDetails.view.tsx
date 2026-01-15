import { Button } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Camera, Edit, Trash2, Upload } from "lucide-react";
import { FC, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AccountCard } from "./components/AccountCard/AccountCard";
import { AddIdentityDocument } from "./components/AddIdentityDocument/AddIdentityDocument.view";
import { CaptureImage } from "./components/CaptureImage/CaptureImage.view";
import { EditClientDetails } from "./components/EditClientDetails/EditClientDetails.view";
import { EditLoanAccount } from "./components/EditLoanAccount/EditLoanAccount";
import { KYCManagement } from "./components/KYCManagement/KYCManagement.view";
import {
	useDeleteClientImage,
	useGetClientImage,
	useUploadClientImage,
} from "./hooks/useClientImage";
import { useClientDetails } from "./useClientDetails";

const parseFineractDate = (dateArray: unknown): Date | null => {
	if (
		Array.isArray(dateArray) &&
		dateArray.length >= 3 &&
		typeof dateArray[0] === "number" &&
		typeof dateArray[1] === "number" &&
		typeof dateArray[2] === "number"
	) {
		// Month is 0-indexed in JavaScript Date
		return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
	}
	return null;
};

export const ClientDetailsView: FC<ReturnType<typeof useClientDetails>> = ({
	client,
	isLoading,
	accounts,
	activateAccount,
	deleteSavingsAccount,
	deleteLoanAccount,
}) => {
	const { t } = useTranslation();
	const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
	const [isEditLoanModalOpen, setIsEditLoanModalOpen] = useState(false);
	const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);
	const [isAddIdentityModalOpen, setIsAddIdentityModalOpen] = useState(false);
	const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const {
		data: clientImage,
		isLoading: isClientImageLoading,
		refetch: refetchClientImage,
	} = useGetClientImage(String(client?.id));

	const { mutate: uploadImage } = useUploadClientImage(() => {
		refetchClientImage();
	});

	const { mutate: deleteImage } = useDeleteClientImage();

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			uploadImage(file);
		}
	};

	const renderClientImage = () => {
		if (isClientImageLoading) {
			return (
				<div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
					<span className="text-sm text-gray-500">
						{t("clientDetails.loading")}
					</span>
				</div>
			);
		}
		if (clientImage) {
			return (
				<img
					src={clientImage}
					alt="Client"
					className="w-full h-full object-cover"
				/>
			);
		}
		return (
			<div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
				<span className="text-sm text-gray-500">
					{t("clientDetails.noImage")}
				</span>
			</div>
		);
	};

	if (isLoading) {
		return <div>{t("accountManagerCommon.loading")}</div>;
	}

	return (
		<div className="bg-gray-100 min-h-screen font-sans">
			<header className="bg-white shadow-sm sticky top-0 z-10 ">
				<div className="container mx-auto p-4 flex justify-between items-center">
					<Link to="/dashboard">
						<Button variant="ghost">
							<ArrowLeft className="h-6 w-6" />
						</Button>
					</Link>
					<h1 className="text-xl font-semibold">
						{t("clientDetails.clientProfile")}
					</h1>
					<Button
						variant="ghost"
						onClick={() => setIsEditClientModalOpen(true)}
					>
						<Edit className="h-6 w-6" />
					</Button>
				</div>
			</header>

			<main className="p-4 sm:p-6 lg:p-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="md:col-span-1">
						<div className="bg-white p-6 rounded-lg shadow-md">
							<div className="flex flex-col items-center text-center">
								<div className="w-40 h-40 rounded-full mb-4 bg-gray-200 flex items-center justify-center overflow-hidden">
									{renderClientImage()}
								</div>
								<div className="flex space-x-4 items-center text-gray-600 mb-4">
									<input
										type="file"
										ref={fileInputRef}
										onChange={handleFileChange}
										className="hidden"
										accept="image/*"
									/>
									<button
										className="flex items-center space-x-1 text-sm"
										onClick={() => fileInputRef.current?.click()}
									>
										<Upload className="h-4 w-4" />
										<span>{t("clientDetails.upload")}</span>
									</button>
									<button
										className="flex items-center space-x-1 text-sm"
										onClick={() => setIsCaptureModalOpen(true)}
									>
										<Camera className="h-4 w-4" />
										<span>{t("clientDetails.capture")}</span>
									</button>
									<button
										className="flex items-center space-x-1 text-sm text-red-500"
										onClick={() => deleteImage(String(client?.id))}
									>
										<Trash2 className="h-4 w-4" />
										<span>{t("clientDetails.delete")}</span>
									</button>
								</div>
								<h2 className="text-2xl font-bold">{client?.displayName}</h2>
								<p className="text-sm text-gray-500 mt-1">
									{t("clientDetails.clientId")} {client?.accountNo}
								</p>
								<p className="text-sm text-gray-500 mt-1">
									{t("clientDetails.phone")} {client?.mobileNo}
								</p>
								<p className="text-sm text-gray-500">
									{t("clientDetails.joined")}{" "}
									{parseFineractDate(
										client?.timeline?.submittedOnDate,
									)?.toLocaleDateString("en-US", {
										year: "numeric",
									}) ?? ""}
								</p>
							</div>
							<div className="mt-8">
								<Link
									to="/select-account-type/$clientId"
									params={{ clientId: String(client?.id) }}
								>
									<Button className="w-full">
										{t("clientDetails.openAccount")}
									</Button>
								</Link>
							</div>
						</div>
					</div>
					<div className="md:col-span-2">
						<div className="bg-white p-6 rounded-lg shadow-md">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-lg font-semibold">
									{t("clientDetails.accounts")}
								</h3>
								{accounts?.savingsAccounts &&
								accounts.savingsAccounts.length > 0 ? (
									<Link
										to="/select-account-type/$clientId"
										params={{ clientId: String(client?.id) }}
									>
										<Button variant="outline">
											{t("clientDetails.addAnotherAccount")}
										</Button>
									</Link>
								) : null}
							</div>
							{(accounts?.savingsAccounts?.length ?? 0) > 0 ||
							(accounts?.loanAccounts?.length ?? 0) > 0 ? (
								<>
									{accounts?.savingsAccounts?.map((account) => (
										<AccountCard
											key={account.id}
											account={account}
											onActivate={activateAccount}
											onDelete={deleteSavingsAccount}
										/>
									))}
									{accounts?.loanAccounts?.map((account) => (
										<AccountCard
											key={account.id}
											account={account}
											onActivate={activateAccount}
											onDelete={deleteLoanAccount}
											onEdit={(loanId: number) => {
												setSelectedLoanId(loanId);
												setIsEditLoanModalOpen(true);
											}}
										/>
									))}
								</>
							) : (
								<p className="text-gray-500">
									{t("clientDetails.noAccountOpenedYet")}
								</p>
							)}
						</div>
						<div className="mt-8">
							<KYCManagement
								onAddIdentity={() => setIsAddIdentityModalOpen(true)}
							/>
						</div>
					</div>
				</div>
			</main>
			<EditClientDetails
				isOpen={isEditClientModalOpen}
				onClose={() => setIsEditClientModalOpen(false)}
				client={client}
			/>
			{isEditLoanModalOpen && selectedLoanId && (
				<EditLoanAccount
					loanId={selectedLoanId}
					onClose={() => setIsEditLoanModalOpen(false)}
				/>
			)}
			<AddIdentityDocument
				isOpen={isAddIdentityModalOpen}
				onClose={() => setIsAddIdentityModalOpen(false)}
			/>
			<CaptureImage
				isOpen={isCaptureModalOpen}
				onClose={() => setIsCaptureModalOpen(false)}
				onCapture={(file) => {
					uploadImage(file);
					setIsCaptureModalOpen(false);
				}}
			/>
		</div>
	);
};
