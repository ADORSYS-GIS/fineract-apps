import { Button, Card, Form, Input, SubmitButton } from "@fineract-apps/ui";
import { FC } from "react";
import { ActivateClientProps } from "./ActivateClient.types";
import { useActivateClient } from "./useActivateClient";

export const ActivateClientView: FC<
	ReturnType<typeof useActivateClient> & ActivateClientProps
> = ({ initialValues, onSubmit, isActivatingClient, onClose }) => {
	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 z-40 bg-black/40 "
				onClick={onClose}
				onKeyDown={(e) => e.key === "Escape" && onClose()}
				role="button"
				tabIndex={0}
				aria-label="Close modal"
			/>

			{/* Bottom Sheet */}
			<div className="fixed inset-x-0 bottom-0 z-50 flex justify-center">
				<Card className="w-full max-w-md rounded-t-2xl shadow-lg p-6">
					{/* Drag handle */}
					<div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300" />

					<h2 className="text-lg font-semibold">Activate Client</h2>
					<Form initialValues={initialValues} onSubmit={onSubmit}>
						<div className="mt-4">
							<Input
								name="activationDate"
								label="Activation Date"
								type="date"
							/>
						</div>
						<div className="flex justify-end space-x-4 mt-4">
							<Button type="button" variant="secondary" onClick={onClose}>
								Cancel
							</Button>
							<SubmitButton
								label={isActivatingClient ? "Activating..." : "Activate"}
								disabled={isActivatingClient}
							/>
						</div>
					</Form>
				</Card>
			</div>
		</>
	);
};
