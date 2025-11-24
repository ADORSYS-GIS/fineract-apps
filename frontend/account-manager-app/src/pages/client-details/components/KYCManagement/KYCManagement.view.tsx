import { Button } from "@fineract-apps/ui";
import { useQuery } from "@tanstack/react-query";
import { Download, Trash2, Upload } from "lucide-react";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { fineractApi } from "@/services/api";
import { UploadDocument } from "../UploadDocument/UploadDocument.view";
import { useDeleteIdentity } from "./useDeleteIdentity";
import { useKYCManagement } from "./useKYCManagement";

const useGetIdentifierDocuments = (identifierId: number) => {
	return useQuery({
		queryKey: ["identifier-documents", identifierId],
		queryFn: () =>
			fineractApi.DocumentsService.getV1ByEntityTypeByEntityIdDocuments({
				entityType: "client_identifiers",
				entityId: identifierId,
			}),
	});
};

const IdentifierDocuments: FC<{ identifierId: number }> = ({
	identifierId,
}) => {
	const { data: documents, isLoading } =
		useGetIdentifierDocuments(identifierId);

	if (isLoading) {
		return <div className="text-sm text-gray-500">Loading documents...</div>;
	}

	if (!documents || documents.length === 0) {
		return null;
	}

	return (
		<div className="mt-2 border-t pt-2">
			<h5 className="text-sm font-semibold text-gray-600 mb-1">Documents:</h5>
			<ul className="space-y-1">
				{documents.map((doc) => (
					<li key={doc.id} className="text-sm text-blue-600 hover:underline">
						<button
							type="button"
							onClick={async () => {
								if (!doc.id || !doc.name) return;
								try {
									const response =
										await fineractApi.DocumentsService.getV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachment(
											{
												entityType: "client_identifiers",
												entityId: identifierId,
												documentId: doc.id,
											},
										);

									const blob = response as Blob;
									const downloadUrl = window.URL.createObjectURL(blob);
									const a = document.createElement("a");
									a.href = downloadUrl;
									a.download = doc.name;
									document.body.appendChild(a);
									a.click();
									a.remove();
									window.URL.revokeObjectURL(downloadUrl);
								} catch (error) {
									console.error("Download failed", error);
								}
							}}
							className="flex items-center"
						>
							{doc.name}
							<Download className="h-4 w-4 ml-2" />
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

const formatStatus = (status: string | undefined) => {
	if (!status) return "";
	const parts = status.split(".");
	if (parts.length > 1) {
		const lastPart = parts[parts.length - 1];
		return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
	}
	return status;
};

export const KYCManagement: FC<{ onAddIdentity: () => void }> = ({
	onAddIdentity,
}) => {
	const { t } = useTranslation();
	const { identifiers, isLoading } = useKYCManagement();
	const { deleteIdentity } = useDeleteIdentity();
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const [selectedIdentityId, setSelectedIdentityId] = useState<number | null>(
		null,
	);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="mt-8">
			<h3 className="text-lg font-semibold mb-4 text-gray-800">
				{t("kycManagement")}
			</h3>
			<div className="bg-white rounded-lg shadow-md p-6">
				<h4 className="font-semibold text-gray-700 mb-4">{t("identities")}</h4>
				<Button
					className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-6"
					onClick={onAddIdentity}
				>
					+ {t("add")}
				</Button>
				<div className="space-y-4">
					{identifiers?.map((identity) => (
						<div
							key={identity.id}
							className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
						>
							<div>
								<p className="font-semibold text-gray-800">
									<span className="font-normal text-gray-500">
										Document Type:{" "}
									</span>
									{identity.documentType?.name}
								</p>
								<p className="text-sm text-gray-500">
									<span className="font-normal">Document Key: </span>
									{identity.documentKey}
								</p>
								<p
									className={`text-sm font-medium ${
										formatStatus(identity.status) === "Active"
											? "text-green-600"
											: "text-red-600"
									}`}
								>
									<span className="font-normal text-gray-500">Status: </span>
									{formatStatus(identity.status)}
								</p>
								{identity.id && (
									<IdentifierDocuments identifierId={identity.id} />
								)}
							</div>
							<div className="flex space-x-2">
								<Button
									variant="ghost"
									onClick={() => {
										if (identity.id) {
											setSelectedIdentityId(identity.id);
											setIsUploadModalOpen(true);
										}
									}}
								>
									<Upload className="h-5 w-5 text-gray-500" />
								</Button>
								<Button
									variant="ghost"
									onClick={() => {
										if (identity.id) {
											deleteIdentity(identity.id);
										}
									}}
								>
									<Trash2 className="h-5 w-5 text-red-500" />
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
			{selectedIdentityId && (
				<UploadDocument
					isOpen={isUploadModalOpen}
					onClose={() => setIsUploadModalOpen(false)}
					identityId={selectedIdentityId}
				/>
			)}
		</div>
	);
};
