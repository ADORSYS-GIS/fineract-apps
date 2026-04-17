import { FC } from "react";
import { PaymentDlqTable } from "@/components/PaymentDlqTable";

export const PaymentDlqView: FC = () => {
	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-800">
						Payment Dead-Letter Queue
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						Reversal failures requiring manual intervention. Retry or resolve
						entries that could not be automatically processed.
					</p>
				</div>
				<PaymentDlqTable />
			</main>
		</div>
	);
};
