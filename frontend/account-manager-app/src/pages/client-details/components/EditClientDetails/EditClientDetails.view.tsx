import { ClientData } from "@fineract-apps/fineract-api";
import { Button, Form, Input } from "@fineract-apps/ui";
import { X } from "lucide-react";
import { FC } from "react";
import { useEditClient } from "./useEditClient";

export const EditClientDetails: FC<{
	isOpen: boolean;
	onClose: () => void;
	client: ClientData | undefined;
}> = ({ isOpen, onClose, client }) => {
	const { onSubmit, isEditingClient } = useEditClient(onClose);

	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<button
				type="button"
				className="fixed inset-0 z-40 bg-black/40"
				onClick={onClose}
				onKeyDown={(e) => e.key === "Escape" && onClose()}
				tabIndex={0}
				aria-label="Close modal"
			/>

			{/* Modal */}
			<button
				type="button"
				className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
				onClick={onClose}
				onKeyDown={(e) => e.key === "Escape" && onClose()}
				tabIndex={0}
				aria-label="Close modal"
			>
				<dialog
					className="relative bg-white rounded-t-2xl md:rounded-lg p-6 w-full max-w-md shadow-lg"
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
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
							Edit Client Details
						</h2>
					</div>
					<div className="md:hidden flex justify-center mb-4">
						<div className="w-12 h-1.5 bg-gray-300 rounded-full" />
					</div>
					<div className="md:hidden">
						<h2 className="text-xl font-bold text-center mb-6">
							Edit Client Details
						</h2>
					</div>
					<Form
						initialValues={{
							firstname: client?.firstname ?? "",
							lastname: client?.lastname ?? "",
							emailAddress: client?.emailAddress ?? "",
							mobileNo: client?.mobileNo ?? "",
						}}
						onSubmit={onSubmit}
					>
						<div className="space-y-4">
							<Input
								name="firstname"
								label="First Name"
								placeholder="Enter first name"
							/>
							<Input
								name="lastname"
								label="Last Name"
								placeholder="Enter last name"
							/>
							<Input
								name="emailAddress"
								label="Email"
								type="email"
								placeholder="Enter email address"
							/>
							<Input
								name="mobileNo"
								label="Phone"
								type="text"
								placeholder="Enter mobile number"
							/>
							<Button
								type="submit"
								className="w-full bg-green-500 hover:bg-green-600 text-white"
								disabled={isEditingClient}
							>
								{isEditingClient ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</Form>
				</dialog>
			</button>
		</>
	);
};
