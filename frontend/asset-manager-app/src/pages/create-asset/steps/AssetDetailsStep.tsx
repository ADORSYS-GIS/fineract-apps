import { FC } from "react";
import { ASSET_CATEGORIES } from "@/constants/categories";
import type { AssetFormData } from "../useCreateAsset";

interface Props {
	formData: AssetFormData;
	updateFormData: (updates: Partial<AssetFormData>) => void;
	validationErrors: string[];
}

export const AssetDetailsStep: FC<Props> = ({
	formData,
	updateFormData,
	validationErrors,
}) => {
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
					{fieldError("name") && (
						<p className="text-xs text-red-600 mt-1">{fieldError("name")}</p>
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
							Also used as the currency code in Fineract
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
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Image URL
				</label>
				<input
					type="url"
					aria-label="Image URL"
					className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					placeholder="https://example.com/asset-image.jpg"
					value={formData.imageUrl}
					onChange={(e) => updateFormData({ imageUrl: e.target.value })}
				/>
			</div>
		</div>
	);
};
