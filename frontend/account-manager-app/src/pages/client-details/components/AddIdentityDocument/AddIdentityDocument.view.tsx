import { Button, Form, Input } from "@fineract-apps/ui";
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
			<div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

			{/* Bottom Sheet */}
			<div
				className="fixed inset-x-0 bottom-0 z-50 flex justify-center"
				onClick={onClose}
			>
				<div
					className="bg-white rounded-t-2xl p-6 w-full max-w-md shadow-lg"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Drag handle */}
					<div className="flex justify-center mb-4">
						<div className="w-12 h-1.5 bg-gray-300 rounded-full" />
					</div>

					<h2 className="text-xl font-bold text-center mb-6">
						Add Identity Document
					</h2>
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
									{ label: "Select Status", value: "" },
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
