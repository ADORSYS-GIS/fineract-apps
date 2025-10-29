import { Button, Form, Input } from "@fineract-apps/ui";
import { X } from "lucide-react";
import { FC } from "react";
import { useAddIdentityDocument } from "./useAddIdentityDocument";

export const AddIdentityDocument: FC<{
	isOpen: boolean;
	onClose: () => void;
}> = ({ isOpen, onClose }) => {
	const { initialValues, onSubmit, isPending } =
		useAddIdentityDocument(onClose);

	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 z-40 bg-black/40"
				onClick={onClose}
				onKeyDown={(e) => e.key === "Escape" && onClose()}
				role="button"
				tabIndex={0}
				aria-label="Close modal"
			/>

			{/* Modal */}
			<div
				className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
				onClick={onClose}
				onKeyDown={(e) => e.key === "Escape" && onClose()}
				role="button"
				tabIndex={0}
				aria-label="Close modal"
			>
				<div
					className="relative bg-white rounded-t-2xl md:rounded-lg p-6 w-full max-w-md shadow-lg"
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
					role="dialog"
					aria-modal="true"
				>
					<button
						type="button"
						className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hidden md:block"
						onClick={onClose}
					>
						<X className="w-6 h-6" />
					</button>
					<div className="hidden md:block">
						<h2 className="text-xl font-bold text-center mb-6">
							Add Identity Document
						</h2>
					</div>
					<div className="md:hidden flex justify-center mb-4">
						<div className="w-12 h-1.5 bg-gray-300 rounded-full" />
					</div>
					<div className="md:hidden">
						<h2 className="text-xl font-bold text-center mb-6">
							Add Identity Document
						</h2>
					</div>
					<Form initialValues={initialValues} onSubmit={onSubmit}>
						<div className="space-y-4">
							<Input
								name="documentTypeId"
								label="Document Type"
								type="select"
								options={[
									{ label: "Passport", value: "1" },
									{ label: "ID Card", value: "2" },
									{ label: "Driver's License", value: "3" },
									{ label: "Other Types", value: "4" },
								]}
							/>
							<Input
								name="status"
								label="Status"
								type="select"
								options={[
									{ label: "Active", value: "ACTIVE" },
									{ label: "Inactive", value: "INACTIVE" },
								]}
							/>
							<Input
								name="documentKey"
								label="Document Key"
								placeholder="Enter Document Key"
							/>
							<Button
								type="submit"
								className="w-full bg-green-500 hover:bg-green-600 text-white"
								disabled={isPending}
							>
								{isPending ? "Submitting..." : "Submit"}
							</Button>
						</div>
					</Form>
				</div>
			</div>
		</>
	);
};
