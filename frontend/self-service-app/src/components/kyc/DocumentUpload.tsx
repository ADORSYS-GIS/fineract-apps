import {
	AlertCircle,
	Camera,
	Check,
	FileText,
	Loader2,
	Upload,
	X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { KycDocumentType, KycStatus } from "@/types";

interface DocumentUploadProps {
	documentType: KycDocumentType;
	status?: KycStatus;
	onUpload: (file: File) => Promise<void>;
	onRemove?: () => void;
	maxSizeMB?: number;
	acceptedTypes?: string[];
	preview?: string;
}

export function DocumentUpload({
	documentType,
	status = "pending",
	onUpload,
	onRemove,
	maxSizeMB = 10,
	acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
	preview,
}: DocumentUploadProps) {
	const { t } = useTranslation();
	const [isDragging, setIsDragging] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [localPreview, setLocalPreview] = useState<string | null>(
		preview || null,
	);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const documentIcons: Record<KycDocumentType, React.ReactNode> = {
		id_front: <FileText className="w-6 h-6" />,
		id_back: <FileText className="w-6 h-6" />,
		selfie_with_id: <Camera className="w-6 h-6" />,
		selfie: <Camera className="w-6 h-6" />,
		proof_of_address: <FileText className="w-6 h-6" />,
	};

	const validateFile = (file: File): string | null => {
		if (!acceptedTypes.includes(file.type)) {
			return "Invalid file type. Please upload an image.";
		}
		if (file.size > maxSizeMB * 1024 * 1024) {
			return `File size must be less than ${maxSizeMB}MB`;
		}
		return null;
	};

	const handleFile = useCallback(
		async (file: File) => {
			const validationError = validateFile(file);
			if (validationError) {
				setError(validationError);
				return;
			}

			setError(null);
			setIsUploading(true);

			// Create preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setLocalPreview(reader.result as string);
			};
			reader.readAsDataURL(file);

			try {
				await onUpload(file);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Upload failed");
				setLocalPreview(null);
			} finally {
				setIsUploading(false);
			}
		},
		[onUpload, maxSizeMB, acceptedTypes],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);

			const file = e.dataTransfer.files[0];
			if (file) {
				handleFile(file);
			}
		},
		[handleFile],
	);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleFile(file);
		}
		e.target.value = "";
	};

	const handleRemove = () => {
		setLocalPreview(null);
		setError(null);
		onRemove?.();
	};

	const statusColors: Record<KycStatus, string> = {
		pending: "border-gray-200",
		uploaded: "border-yellow-300",
		verified: "border-green-300",
		rejected: "border-red-300",
		approved: "border-green-300",
	};

	const statusBadges: Record<KycStatus, React.ReactNode> = {
		pending: null,
		uploaded: (
			<span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">
				Under Review
			</span>
		),
		verified: (
			<span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
				<Check className="w-3 h-3" /> Verified
			</span>
		),
		rejected: (
			<span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
				<AlertCircle className="w-3 h-3" /> Rejected
			</span>
		),
		approved: (
			<span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
				<Check className="w-3 h-3" /> Approved
			</span>
		),
	};

	const isEditable = status === "pending" || status === "rejected";

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
						{documentIcons[documentType]}
					</div>
					<div>
						<p className="font-medium text-gray-900">
							{t(`kyc.documents.${documentType}`)}
						</p>
						<p className="text-sm text-gray-500">{t("kyc.maxSize")}</p>
					</div>
				</div>
				{statusBadges[status]}
			</div>

			<input
				ref={fileInputRef}
				type="file"
				accept={acceptedTypes.join(",")}
				onChange={handleFileChange}
				className="hidden"
				disabled={!isEditable || isUploading}
			/>

			{localPreview ? (
				<div
					className={`relative rounded-lg overflow-hidden border-2 ${statusColors[status]}`}
				>
					<img
						src={localPreview}
						alt={documentType}
						className="w-full h-48 object-cover"
					/>
					{isEditable && (
						<button
							onClick={handleRemove}
							className="absolute top-2 right-2 p-1.5 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition-colors"
							disabled={isUploading}
						>
							<X className="w-5 h-5" />
						</button>
					)}
					{isUploading && (
						<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
							<Loader2 className="w-8 h-8 text-white animate-spin" />
						</div>
					)}
				</div>
			) : (
				<div
					onClick={() => isEditable && fileInputRef.current?.click()}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
						isEditable ? "cursor-pointer" : "cursor-not-allowed opacity-60"
					} ${
						isDragging
							? "border-blue-400 bg-blue-50"
							: "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
					}`}
				>
					{isUploading ? (
						<Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
					) : (
						<Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
					)}
					<p className="text-sm text-gray-500">{t("kyc.uploadHint")}</p>
				</div>
			)}

			{error && (
				<p className="text-sm text-red-600 flex items-center gap-1">
					<AlertCircle className="w-4 h-4" />
					{error}
				</p>
			)}
		</div>
	);
}
