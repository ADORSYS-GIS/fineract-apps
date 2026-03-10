import { FC } from "react";
import { AuditLogTable } from "@/components/AuditLogTable";

export const AuditLogView: FC = () => {
	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-800">Audit Log</h1>
					<p className="text-sm text-gray-500 mt-1">
						History of all admin actions across asset management, order
						resolution, and reconciliation.
					</p>
				</div>
				<AuditLogTable />
			</main>
		</div>
	);
};
