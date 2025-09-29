import {
	Button,
	Form,
	Input,
	SubmitButton,
	useFormContext,
} from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import { FC } from "react";
import { CreateClientForm as CreateClientFormType } from "./CreateClient.types";
import { useCreateClient } from "./useCreateClient";

const CreateClientForm: FC<{
	offices: { id?: number; name?: string }[] | undefined;
}> = ({ offices }) => {
	const { values } = useFormContext<CreateClientFormType>();

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
				<Input
					name="officeId"
					label="Office"
					type="select"
					options={
						offices
							?.filter((office) => office.name && office.id)
							.map((office) => ({
								label: office.name as string,
								value: office.id as number,
							})) || []
					}
				/>
			</div>
			<div className="flex items-center justify-between mt-6">
				<Input name="active" type="checkbox" label="Active?" />
			</div>
			{values.active && (
				<div className="mt-4">
					<Input name="activationDate" label="Activation Date" type="date" />
				</div>
			)}
		</>
	);
};

export const CreateClientView: FC<ReturnType<typeof useCreateClient>> = ({
	initialValues,
	validationSchema,
	onSubmit,
	isCreatingClient,
	offices,
}) => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-md">
				<h1 className="text-2xl font-bold text-center">Create New Client</h1>
				<p className="text-center text-gray-600">
					Fill in the details below to create a new client record.
				</p>
				<Form
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={onSubmit}
				>
					<CreateClientForm offices={offices} />
					<div className="flex justify-end space-x-4 mt-8">
						<Button
							type="button"
							variant="secondary"
							onClick={() => navigate({ to: "/dashboard" })}
						>
							Cancel
						</Button>
						<SubmitButton
							label={isCreatingClient ? "Creating Client..." : "Create Client"}
							disabled={isCreatingClient}
						/>
					</div>
				</Form>
			</div>
		</div>
	);
};
