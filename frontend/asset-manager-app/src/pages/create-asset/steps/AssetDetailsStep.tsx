import { type FC, useRef, useState } from "react";
import { ASSET_CATEGORIES } from "@/constants/categories";
import { assetApi, extractErrorMessage } from "@/services/assetApi";
import type { AssetFormData } from "../useCreateAsset";

interface Props {
	formData: AssetFormData;
	updateFormData: (updates: Partial<AssetFormData>) => void;
	validationErrors: string[];
}

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,image/svg+xml";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const AssetDetailsStep: FC<Props> = ({
	formData,
	updateFormData,
	validationErrors,
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		formData.imageUrl || null,
	);
	const [uploadError, setUploadError] = useState<string | null>(null);

	const handleFileSelect = async (file: File) => {
		setUploadError(null);
		if (file.size > MAX_FILE_SIZE) {
			setUploadError("File size exceeds 5MB limit");
			return;
		}
		if (!ACCEPTED_TYPES.split(",").includes(file.type)) {
			setUploadError("Only JPEG, PNG, WebP, and SVG files are allowed");
			return;
		}
		setPreviewUrl(URL.createObjectURL(file));
		setUploading(true);
		try {
			const { data } = await assetApi.uploadFile(file);
			updateFormData({ imageUrl: data.key });
			setPreviewUrl(data.url);
		} catch (err) {
			setUploadError(extractErrorMessage(err));
			setPreviewUrl(null);
			updateFormData({ imageUrl: "" });
		} finally {
			setUploading(false);
		}
	};

	const handleRemoveImage = () => {
		setPreviewUrl(null);
		setUploadError(null);
		updateFormData({ imageUrl: "" });
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const fieldError = (keyword: string) =>
		validationErrors.find((e) => e.toLowerCase().includes(keyword));
	const inputClass = (keyword: string) =>
		`w-full border rounded-lg px-3 py-2 focus:ring-2 ${fieldError(keyword) ? "border-red-400 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`;
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-semibold text-gray-800 mb-1">
					Asset Details
				</h2>
				<p className="text-sm text-gray-500">
					Define the asset name, symbol, and category.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Asset Name *
					</label>
					<input
						type="text"
						aria-label="Asset name"
						className={inputClass("name")}
						placeholder="e.g. Douala Tower Token"
						value={formData.name}
						onChange={(e) => updateFormData({ name: e.target.value })}
					/>
					{fieldError("name") ? (
						<p className="text-xs text-red-600 mt-1">{fieldError("name")}</p>
					) : (
						<p className="text-xs text-gray-400 mt-1">
							Display name shown to investors in the marketplace
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Symbol *
					</label>
					<input
						type="text"
						aria-label="Symbol"
						className={`${inputClass("symbol")} uppercase`}
						placeholder="e.g. DTT"
						value={formData.symbol}
						onChange={(e) =>
							updateFormData({ symbol: e.target.value.toUpperCase() })
						}
						maxLength={3}
					/>
					{fieldError("symbol") ? (
						<p className="text-xs text-red-600 mt-1">{fieldError("symbol")}</p>
					) : (
						<p className="text-xs text-gray-400 mt-1">
							3-letter ticker code (e.g. DTT). Also registered as a currency
							code in the backend
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Category *
					</label>
					<select
						aria-label="Category"
						className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						value={formData.category}
						onChange={(e) => updateFormData({ category: e.target.value })}
					>
						{ASSET_CATEGORIES.map((cat) => (
							<option key={cat.value} value={cat.value}>
								{cat.label}
							</option>
						))}
					</select>
					<p className="text-xs text-gray-400 mt-1">
						Determines marketplace section and available income options. Bonds
						get a separate coupon configuration step
					</p>
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Description
				</label>
				<textarea
					aria-label="Description"
					className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					rows={3}
					placeholder="Describe the asset and its underlying real-world value..."
					value={formData.description}
					onChange={(e) => updateFormData({ description: e.target.value })}
					maxLength={1000}
				/>
				<p className="text-xs text-gray-400 mt-1">
					Brief summary visible on the asset detail page
				</p>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Asset Image
				</label>
				<input
					ref={fileInputRef}
					type="file"
					accept={ACCEPTED_TYPES}
					className="hidden"
					onChange={(e) => {
						const file = e.target.files?.[0];
						if (file) handleFileSelect(file);
					}}
				/>
				{previewUrl ? (
					<div className="flex items-center gap-4">
						<img
							src={previewUrl}
							alt="Asset preview"
							className="h-16 w-16 rounded-lg object-cover border border-gray-200"
						/>
						<div className="flex gap-2">
							<button
								type="button"
								className="text-sm text-blue-600 hover:text-blue-800"
								onClick={() => fileInputRef.current?.click()}
								disabled={uploading}
							>
								Change
							</button>
							<button
								type="button"
								className="text-sm text-red-600 hover:text-red-800"
								onClick={handleRemoveImage}
								disabled={uploading}
							>
								Remove
							</button>
						</div>
						{uploading && (
							<span className="text-xs text-gray-500">Uploading...</span>
						)}
					</div>
				) : (
					<button
						type="button"
						className="w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
						onClick={() => fileInputRef.current?.click()}
						onDragOver={(e) => e.preventDefault()}
						onDrop={(e) => {
							e.preventDefault();
							const file = e.dataTransfer.files[0];
							if (file) handleFileSelect(file);
						}}
						disabled={uploading}
					>
						<p className="text-sm text-gray-600">
							{uploading
								? "Uploading..."
								: "Click or drag & drop to upload an image"}
						</p>
						<p className="text-xs text-gray-400 mt-1">
							JPEG, PNG, WebP, or SVG (max 5MB)
						</p>
					</button>
				)}
				{uploadError && (
					<p className="text-xs text-red-600 mt-1">{uploadError}</p>
				)}
			</div>
		</div>
	);
};
