import { OfficesService, RolesService } from "@fineract-apps/fineract-api";
import {
	Button,
	Card,
	FormTitle,
	Input,
	SubmitButton,
} from "@fineract-apps/ui";
import { useQuery } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { createUserFormSchema } from "@/components/CreateUser/createUserFormSchema";
import { useCreateUser } from "./useCreateUser";

type CreateUserViewProps = ReturnType<typeof useCreateUser>;

export const CreateUserView = ({
	initialValues,
	onSubmit,
	onConfirmSync,
	creationStep,
	isLoading,
}: CreateUserViewProps) => {
	const { data: offices, isLoading: officesLoading } = useQuery({
		queryKey: ["offices"],
		queryFn: () => OfficesService.getV1Offices(),
	});
	const { data: roles, isLoading: rolesLoading } = useQuery({
		queryKey: ["roles"],
		queryFn: () => RolesService.getV1Roles(),
	});

	const officeOptions =
		offices?.map((office) => ({
			label: office.name || "",
			value: office.id || 0,
		})) || [];

	const roleOptions =
		roles?.map((role) => ({
			label: role.name || "",
			value: role.id || 0,
		})) || [];

	if (creationStep.step === "confirm") {
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<Card className="w-full max-w-md">
					<div className="p-6">
						<h2 className="text-xl font-semibold mb-4">Confirm User Sync</h2>
						<p className="mb-4">
							Employee has been created in Fineract. Please confirm to sync this
							user to Keycloak.
						</p>
						<div className="space-y-2">
							<p>
								<strong>Username:</strong> {creationStep.newUser?.username}
							</p>
							<p>
								<strong>Email:</strong> {creationStep.newUser?.email}
							</p>
						</div>
						<Button
							onClick={onConfirmSync}
							disabled={isLoading}
							className="mt-4 w-full"
						>
							{isLoading ? "Syncing..." : "Complete Creation"}
						</Button>
					</div>
				</Card>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto">
			<Card variant="elevated" size="lg">
				<div className="p-6">
					<Formik
						initialValues={initialValues}
						onSubmit={onSubmit}
						validationSchema={toFormikValidationSchema(createUserFormSchema)}
						enableReinitialize
					>
						{() => (
							<Form>
								<FormTitle>Create New Employee</FormTitle>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
									<Input
										name="firstname"
										label="First Name"
										type="text"
										placeholder="Enter first name"
										required
									/>
									<Input
										name="lastname"
										label="Last Name"
										type="text"
										placeholder="Enter last name"
										required
									/>
									<Input
										name="username"
										label="Username"
										type="text"
										placeholder="Enter username"
										required
									/>
									<Input
										name="email"
										label="Email Address"
										type="email"
										placeholder="user@example.com"
										required
									/>
									<Input
										name="mobileNo"
										label="Mobile Number"
										type="text"
										placeholder="Enter mobile number"
									/>
									<Input
										name="officeId"
										label="Office"
										type="select"
										required
										options={officeOptions}
										disabled={officesLoading}
									/>
									<Input
										name="roles"
										label="Roles"
										type="select"
										required
										options={roleOptions}
										disabled={rolesLoading}
										helperText="Select a role"
									/>
									<Input
										name="joiningDate"
										label="Joining Date"
										type="date"
										required
									/>
									<div className="flex items-center space-x-2">
										<Input name="loanOfficer" type="checkbox" />
										<label
											htmlFor="loanOfficer"
											className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
										>
											Loan Officer
										</label>
									</div>
								</div>

								<div className="pt-4 flex items-center gap-3">
									<SubmitButton
										label={isLoading ? "Creating..." : "Create Employee"}
									/>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			</Card>
		</div>
	);
};
