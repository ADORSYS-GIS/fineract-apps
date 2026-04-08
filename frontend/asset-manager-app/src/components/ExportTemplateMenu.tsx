import { Button } from "@fineract-apps/ui";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Download, FileSpreadsheet, X } from "lucide-react";
import { type FC, useRef, useState } from "react";
import { fineractApi } from "@/services/api";
import {
	exportAssetTemplate,
	exportCemacBulletinTemplate,
} from "@/utils/assetExcelTemplate";

type LpClient = {
	id?: number;
	displayName?: string;
};

// ─── LP picker dialog ────────────────────────────────────────────────────────

interface CemacDialogProps {
	onClose: () => void;
}

const CemacExportDialog: FC<CemacDialogProps> = ({ onClose }) => {
	const [selectedLpId, setSelectedLpId] = useState<number | "">("");
	const [isExporting, setIsExporting] = useState(false);

	const { data: clients = [], isLoading } = useQuery({
		queryKey: ["entity-clients"],
		queryFn: () =>
			fineractApi.clients.getV1Clients({
				limit: 100,
				orderBy: "displayName",
				sortOrder: "ASC",
			}),
		select: (res) =>
			(res.pageItems ?? []).filter((c) => {
				const client = c as unknown as {
					legalForm?: { id?: number };
					displayName?: string;
				};
				const name = client.displayName?.toLowerCase() ?? "";
				return (
					client.legalForm?.id === 2 &&
					!name.includes("platform fee collector") &&
					!name.includes("tax authority")
				);
			}) as LpClient[],
	});

	const handleExport = async () => {
		if (!selectedLpId) return;
		setIsExporting(true);
		try {
			await exportCemacBulletinTemplate(selectedLpId);
			onClose();
		} catch (err) {
			console.error("Failed to export CEMAC template:", err);
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-2">
						<FileSpreadsheet className="h-5 w-5 text-blue-600" />
						<h2 className="text-lg font-semibold text-gray-900">
							Export CEMAC Bulletin
						</h2>
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600"
						aria-label="Close"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<p className="text-sm text-gray-500 mb-5">
					Generates a pre-filled Excel template with 18 CEMAC assets (6 BVMAC
					stocks + 12 government bonds) from the Elite Capital bulletin
					30/03/2026. Select the Liquidity Partner who will hold these assets.
				</p>

				<div className="mb-5">
					<label
						htmlFor="cemac-lp-select"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Liquidity Partner
					</label>
					{isLoading ? (
						<div className="animate-pulse h-10 bg-gray-200 rounded-lg" />
					) : (
						<select
							id="cemac-lp-select"
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							value={selectedLpId}
							onChange={(e) =>
								setSelectedLpId(e.target.value ? Number(e.target.value) : "")
							}
						>
							<option value="">— Select a liquidity partner —</option>
							{clients.map((c) => (
								<option key={c.id} value={c.id}>
									{c.displayName}
								</option>
							))}
						</select>
					)}
				</div>

				<div className="flex justify-end gap-3">
					<Button variant="outline" onClick={onClose} disabled={isExporting}>
						Cancel
					</Button>
					<Button
						onClick={handleExport}
						disabled={!selectedLpId || isExporting}
						className="flex items-center gap-2"
					>
						<Download className="h-4 w-4" />
						{isExporting ? "Exporting…" : "Download"}
					</Button>
				</div>
			</div>
		</div>
	);
};

// ─── Dropdown menu button ─────────────────────────────────────────────────────

interface ExportTemplateMenuProps {
	className?: string;
}

export const ExportTemplateMenu: FC<ExportTemplateMenuProps> = ({
	className,
}) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isCemacDialogOpen, setIsCemacDialogOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const handleEmptyTemplate = () => {
		setIsMenuOpen(false);
		exportAssetTemplate().catch((err) => {
			console.error("Failed to export template:", err);
		});
	};

	const handleCemacTemplate = () => {
		setIsMenuOpen(false);
		setIsCemacDialogOpen(true);
	};

	return (
		<>
			<div className={`relative ${className ?? ""}`} ref={menuRef}>
				<Button
					variant="outline"
					onClick={() => setIsMenuOpen((o) => !o)}
					className="flex items-center gap-2 whitespace-nowrap"
					aria-haspopup="menu"
					aria-expanded={isMenuOpen}
				>
					<Download className="h-4 w-4" />
					<span>Export Template</span>
					<ChevronDown className="h-3 w-3 ml-1" />
				</Button>

				{isMenuOpen && (
					<>
						{/* Click-away overlay */}
						<div
							className="fixed inset-0 z-10"
							onClick={() => setIsMenuOpen(false)}
							aria-hidden="true"
						/>
						<div
							role="menu"
							className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1"
						>
							<button
								role="menuitem"
								className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-start gap-3"
								onClick={handleEmptyTemplate}
							>
								<Download className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
								<div>
									<div className="font-medium">Empty Template</div>
									<div className="text-xs text-gray-400">
										Blank template with all columns
									</div>
								</div>
							</button>
							<button
								role="menuitem"
								className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-start gap-3"
								onClick={handleCemacTemplate}
							>
								<FileSpreadsheet className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
								<div>
									<div className="font-medium">CEMAC Bulletin</div>
									<div className="text-xs text-gray-400">
										18 assets pre-filled from Elite Capital (30/03/2026)
									</div>
								</div>
							</button>
						</div>
					</>
				)}
			</div>

			{isCemacDialogOpen && (
				<CemacExportDialog onClose={() => setIsCemacDialogOpen(false)} />
			)}
		</>
	);
};
