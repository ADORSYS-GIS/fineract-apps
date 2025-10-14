import {
	Button,
	Form,
	Input,
	SubmitButton,
	useFormContext,
} from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import { Formik } from "formik";
import { FC } from "react";
import { CreateClientForm as CreateClientFormType } from "./CreateClient.types";
import { useCreateClient } from "./useCreateClient";

const CreateClientForm: FC = () => {
	useFormContext<CreateClientFormType>();

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
					placeholder="Enter email address"
				/>
				<Input
					name="mobileNo"
					label="Mobile Number"
					placeholder="Enter mobile number"
				/>
			</div>
			<div className="flex items-center justify-between mt-6">
				<Input name="active" type="checkbox" label="Active?" />
			</div>
		</>
	);
};

export const CreateClientView: FC<ReturnType<typeof useCreateClient>> = ({
	initialValues,
	validationSchema,
	onSubmit,
	isCreatingClient,
}) => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-md">
				<h1 className="text-2xl font-bold text-center">Create New Client</h1>
				<p className="text-center text-gray-600">
					Fill in the details below to create a new client record.
				</p>
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={onSubmit}
				>
					<Form>
						<CreateClientForm />
						<div className="flex justify-end space-x-4 mt-8">
							<Button
								type="button"
								variant="secondary"
								onClick={() => navigate({ to: "/dashboard" })}
							>
								Cancel
							</Button>
							<SubmitButton
								label={
									isCreatingClient ? "Creating Client..." : "Create Client"
								}
								disabled={isCreatingClient}
							/>
						</div>
					</Form>
				</Formik>
			</div>
		</div>
	);
};
