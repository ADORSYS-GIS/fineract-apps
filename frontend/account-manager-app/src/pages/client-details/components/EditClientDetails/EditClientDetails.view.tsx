import { ClientData } from "@fineract-apps/fineract-api";
import { Button, Form, Input } from "@fineract-apps/ui";
import { Formik } from "formik";
import { FC } from "react";
import { useEditClient } from "./useEditClient";

export const EditClientDetails: FC<{
	isOpen: boolean;
	onClose: () => void;
	client: ClientData | undefined;
}> = ({ isOpen, onClose, client }) => {
	const { validationSchema, onSubmit, isEditingClient } =
		useEditClient(onClose);

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
						Edit Client Details
					</h2>
					<Formik
						initialValues={{
							firstname: client?.firstname || "",
							lastname: client?.lastname || "",
							emailAddress: client?.emailAddress || "",
							mobileNo: client?.mobileNo || "",
						}}
						validationSchema={validationSchema}
						onSubmit={onSubmit}
					>
						<Form>
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
					</Formik>
				</div>
			</div>
		</>
	);
};
