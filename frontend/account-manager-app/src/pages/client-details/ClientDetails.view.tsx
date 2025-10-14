import { Button } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Camera, Edit, Trash2, Upload } from "lucide-react";
import { FC, useRef, useState } from "react";
import { AccountCard } from "./components/AccountCard/AccountCard";
import { AddIdentityDocument } from "./components/AddIdentityDocument/AddIdentityDocument.view";
import { CaptureImage } from "./components/CaptureImage/CaptureImage.view";
import { EditClientDetails } from "./components/EditClientDetails/EditClientDetails.view";
import { KYCManagement } from "./components/KYCManagement/KYCManagement.view";
import { SelectAccountType } from "./components/SelectAccountType/SelectAccountType";
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
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
					<span className="text-sm text-gray-500">Loading...</span>
				</div>
			);
		}
		if (clientImage) {
			return (
				<img
					src={clientImage}
					alt="Client"
					className="w-32 h-32 rounded-full shadow-md"
				/>
			);
		}
		return (
			<div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
				<span className="text-sm text-gray-500">No Image</span>
			</div>
		);
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="bg-gray-100 min-h-screen font-sans">
			<header className="bg-white shadow-sm sticky top-0 z-10">
				<div className="max-w-md mx-auto p-4 flex justify-between items-center">
					<Link to="/dashboard">
						<Button variant="ghost">
							<ArrowLeft className="h-6 w-6" />
						</Button>
					</Link>
					<h1 className="text-xl font-semibold">Client Profile</h1>
					<Button variant="ghost" onClick={() => setIsEditModalOpen(true)}>
						<Edit className="h-6 w-6" />
					</Button>
				</div>
			</header>

			<main className="max-w-md mx-auto p-4 pb-20">
				<div className="flex flex-col items-center text-center mt-4">
					<div className="w-32 h-32 rounded-full mb-4 bg-gray-200 flex items-center justify-center overflow-hidden">
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
							<span>Upload</span>
						</button>
						<button
							className="flex items-center space-x-1 text-sm"
							onClick={() => setIsCaptureModalOpen(true)}
						>
							<Camera className="h-4 w-4" />
							<span>Capture</span>
						</button>
						<button
							className="flex items-center space-x-1 text-sm text-red-500"
							onClick={() => deleteImage()}
						>
							<Trash2 className="h-4 w-4" />
							<span>Delete</span>
						</button>
					</div>
					<h2 className="text-2xl font-bold">{client?.displayName}</h2>
					<p className="text-sm text-gray-500 mt-1">
						Client ID: {client?.accountNo}
					</p>
					<p className="text-sm text-gray-500">
						Joined{" "}
						{parseFineractDate(
							client?.timeline?.submittedOnDate,
						)?.toLocaleDateString("en-US", {
							year: "numeric",
						}) ?? ""}
					</p>
				</div>

				<div className="mt-8">
					<h3 className="text-lg font-semibold mb-4">Accounts</h3>
					{accounts?.savingsAccounts?.map((account) => (
						<AccountCard
							key={account.id}
							account={account}
							onActivate={activateAccount}
						/>
					))}
				</div>

				<div className="mt-8">
					<Button className="w-full" onClick={() => setIsModalOpen(true)}>
						Open Account
					</Button>
				</div>
				<KYCManagement onAddIdentity={() => setIsAddIdentityModalOpen(true)} />
			</main>
			<SelectAccountType
				isOpen={isModalOpen}
				closeModal={() => setIsModalOpen(false)}
				clientId={client?.id}
			/>
			<EditClientDetails
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				client={client}
			/>
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
