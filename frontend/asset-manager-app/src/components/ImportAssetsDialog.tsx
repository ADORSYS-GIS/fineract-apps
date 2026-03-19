import { Button } from "@fineract-apps/ui";
import {
	AlertCircle,
	CheckCircle2,
	FileSpreadsheet,
	Upload,
	X,
} from "lucide-react";
import { type FC, useCallback, useRef, useState } from "react";
import { assetApi, extractErrorMessage } from "@/services/assetApi";
import { type ParseResult, parseAssetExcel } from "@/utils/assetExcelTemplate";

type DialogState = "upload" | "preview" | "importing" | "results";

interface ImportResult {
	rowIndex: number;
	symbol: string;
	status: "SUCCESS" | "FAILED";
	assetId?: string;
	error?: string;
}

interface ImportAssetsDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export const ImportAssetsDialog: FC<ImportAssetsDialogProps> = ({
	isOpen,
	onClose,
	onSuccess,
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const abortedRef = useRef(false);
	const [state, setState] = useState<DialogState>("upload");
	const [parseResult, setParseResult] = useState<ParseResult | null>(null);
	const [importResults, setImportResults] = useState<ImportResult[]>([]);
	const [importProgress, setImportProgress] = useState(0);
	const [parseError, setParseError] = useState<string | null>(null);

	const reset = useCallback(() => {
		abortedRef.current = true;
		setState("upload");
		setParseResult(null);
		setImportResults([]);
		setImportProgress(0);
		setParseError(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	}, []);

	const handleClose = useCallback(() => {
		if (state === "results") onSuccess();
		reset();
		onClose();
	}, [state, onSuccess, reset, onClose]);

	const handleFileSelect = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			if (!file.name.endsWith(".xlsx")) {
				setParseError("Please select an .xlsx file");
				return;
			}

			setParseError(null);
			try {
				const result = await parseAssetExcel(file);
				setParseResult(result);
				setState("preview");
			} catch (err) {
				setParseError(
					`Failed to parse file: ${err instanceof Error ? err.message : String(err)}`,
				);
			}
		},
		[],
	);

	const handleImport = useCallback(async () => {
		if (!parseResult) return;

		abortedRef.current = false;
		setState("importing");
		const results: ImportResult[] = [];

		for (let i = 0; i < parseResult.rows.length; i++) {
			if (abortedRef.current) break;
			const row = parseResult.rows[i];

			try {
				const response = await assetApi.createAsset(row);
				results.push({
					rowIndex: i,
					symbol: row.symbol,
					status: "SUCCESS",
					assetId: response.data.id,
				});
			} catch (err) {
				results.push({
					rowIndex: i,
					symbol: row.symbol,
					status: "FAILED",
					error: extractErrorMessage(err),
				});
			}

			if (!abortedRef.current) setImportProgress(i + 1);
		}

		if (!abortedRef.current) {
			setImportResults(results);
			setState("results");
		}
	}, [parseResult]);

	if (!isOpen) return null;

	const validRows = parseResult ? parseResult.rows.length : 0;
	const errorRows = parseResult
		? new Set(parseResult.errors.map((e) => e.row)).size
		: 0;

	return (
		<div
			className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
			role="dialog"
			aria-modal="true"
			onClick={(e) => {
				if (e.target === e.currentTarget && state !== "importing")
					handleClose();
			}}
		>
			<div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
						<FileSpreadsheet className="h-5 w-5" />
						Import Assets
					</h3>
					{state !== "importing" && (
						<button
							type="button"
							onClick={handleClose}
							className="text-gray-400 hover:text-gray-600"
						>
							<X className="h-5 w-5" />
						</button>
					)}
				</div>

				{/* Upload state */}
				{state === "upload" && (
					<div className="space-y-4">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Upload a filled Excel template (.xlsx) to create multiple assets
							at once. Use the "Export Template" button to download the template
							first.
						</p>
						<div
							className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
							onClick={() => fileInputRef.current?.click()}
						>
							<Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
							<p className="text-sm text-gray-600">
								Click to select an .xlsx file
							</p>
						</div>
						<input
							ref={fileInputRef}
							type="file"
							accept=".xlsx"
							className="hidden"
							onChange={handleFileSelect}
						/>
						{parseError && (
							<div className="flex items-center gap-2 text-red-600 text-sm">
								<AlertCircle className="h-4 w-4" />
								{parseError}
							</div>
						)}
					</div>
				)}

				{/* Preview state */}
				{state === "preview" && parseResult && (
					<div className="space-y-4">
						{/* Summary */}
						<div className="flex gap-4 text-sm">
							<span className="text-green-600 font-medium">
								{validRows} rows parsed
							</span>
							{errorRows > 0 && (
								<span className="text-red-600 font-medium">
									{errorRows} rows with errors
								</span>
							)}
						</div>

						{/* Validation errors */}
						{parseResult.errors.length > 0 && (
							<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 max-h-40 overflow-y-auto">
								<p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
									Validation Errors
								</p>
								{parseResult.errors.map((err) => (
									<p
										key={`${err.row}-${err.field}`}
										className="text-xs text-red-600 dark:text-red-400"
									>
										Row {err.row}:{" "}
										<span className="font-mono">{err.field}</span> —{" "}
										{err.message}
									</p>
								))}
							</div>
						)}

						{/* Preview table */}
						<div className="overflow-x-auto max-h-60 border rounded-lg">
							<table className="min-w-full text-xs divide-y divide-gray-200">
								<thead className="bg-gray-50 sticky top-0">
									<tr>
										<th className="px-3 py-2 text-left font-medium text-gray-500">
											#
										</th>
										<th className="px-3 py-2 text-left font-medium text-gray-500">
											Symbol
										</th>
										<th className="px-3 py-2 text-left font-medium text-gray-500">
											Name
										</th>
										<th className="px-3 py-2 text-left font-medium text-gray-500">
											Category
										</th>
										<th className="px-3 py-2 text-left font-medium text-gray-500">
											Price
										</th>
										<th className="px-3 py-2 text-left font-medium text-gray-500">
											Supply
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{parseResult.rows.map((row, i) => {
										const rowErrors = parseResult.errors.filter(
											(e) => e.row === i + 2,
										);
										return (
											<tr
												key={row.symbol || i}
												className={rowErrors.length > 0 ? "bg-red-50" : ""}
											>
												<td className="px-3 py-2 text-gray-500">{i + 1}</td>
												<td className="px-3 py-2 font-mono font-medium">
													{row.symbol}
												</td>
												<td className="px-3 py-2">{row.name}</td>
												<td className="px-3 py-2">{row.category}</td>
												<td className="px-3 py-2">
													{row.issuerPrice?.toLocaleString()}
												</td>
												<td className="px-3 py-2">
													{row.totalSupply?.toLocaleString()}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>

						{/* Actions */}
						<div className="flex justify-end gap-3">
							<Button variant="outline" onClick={reset}>
								Cancel
							</Button>
							<Button onClick={handleImport} disabled={validRows === 0}>
								Import {validRows} Asset{validRows !== 1 ? "s" : ""}
							</Button>
						</div>
					</div>
				)}

				{/* Importing state */}
				{state === "importing" && parseResult && (
					<div className="space-y-4 text-center py-8">
						<div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
						<p className="text-sm text-gray-600">
							Creating assets... {importProgress} / {parseResult.rows.length}
						</p>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-blue-600 h-2 rounded-full transition-all"
								style={{
									width: `${(importProgress / parseResult.rows.length) * 100}%`,
								}}
							/>
						</div>
					</div>
				)}

				{/* Results state */}
				{state === "results" && (
					<div className="space-y-4">
						{/* Summary */}
						<div className="flex gap-4 text-sm">
							<span className="text-green-600 font-medium">
								{importResults.filter((r) => r.status === "SUCCESS").length}{" "}
								created
							</span>
							{importResults.filter((r) => r.status === "FAILED").length >
								0 && (
								<span className="text-red-600 font-medium">
									{importResults.filter((r) => r.status === "FAILED").length}{" "}
									failed
								</span>
							)}
						</div>

						{/* Results table */}
						<div className="max-h-60 overflow-y-auto border rounded-lg">
							<table className="min-w-full text-xs divide-y divide-gray-200">
								<thead className="bg-gray-50 sticky top-0">
									<tr>
										<th className="px-3 py-2 text-left font-medium text-gray-500">
											Status
										</th>
										<th className="px-3 py-2 text-left font-medium text-gray-500">
											Symbol
										</th>
										<th className="px-3 py-2 text-left font-medium text-gray-500">
											Details
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{importResults.map((result) => (
										<tr key={result.symbol}>
											<td className="px-3 py-2">
												{result.status === "SUCCESS" ? (
													<CheckCircle2 className="h-4 w-4 text-green-600" />
												) : (
													<AlertCircle className="h-4 w-4 text-red-600" />
												)}
											</td>
											<td className="px-3 py-2 font-mono font-medium">
												{result.symbol}
											</td>
											<td className="px-3 py-2">
												{result.status === "SUCCESS" ? (
													"Created successfully"
												) : (
													<span className="text-red-600">{result.error}</span>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className="flex justify-end">
							<Button onClick={handleClose}>Close</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
