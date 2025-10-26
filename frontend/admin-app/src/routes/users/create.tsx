import {
	Button,
	Card,
	Form,
	FormTitle,
	Input,
	SubmitButton,
} from "@fineract-apps/ui";
import {
	useUsersServiceGetV1UsersTemplate,
	useUsersServicePostV1Users,
	useStaffServicePostV1Staff,
} from "@fineract-apps/fineract-api";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import {
	userFormSchema,
	type UserFormValues,
} from "@/components/UserForm/userFormSchema";
import { useToast } from "@/components/Toast";

function CreateUserPage() {
	const navigate = useNavigate();
	const toast = useToast();
	const [error, setError] = useState<string | null>(null);

	// Fetch template data for offices and roles
	const { data: template } = useUsersServiceGetV1UsersTemplate();

	// Mutations for two-step creation
	const createStaffMutation = useStaffServicePostV1Staff();
	const createUserMutation = useUsersServicePostV1Users();

	const handleSubmit = async (values: UserFormValues) => {
		setError(null);

		try {
			// Step 1: Create Staff Record
			const staffPayload: any = {
				firstname: values.firstname,
				lastname: values.lastname,
				mobileNo: values.mobileNo,
				officeId: values.officeId,
				isLoanOfficer: values.isLoanOfficer,
			};

			// Add joining date if provided
			if (values.joiningDate) {
				staffPayload.joiningDate = values.joiningDate;
				staffPayload.dateFormat = "yyyy-MM-dd";
				staffPayload.locale = "en";
			}

			const staffResponse = await createStaffMutation.mutateAsync({
				requestBody: staffPayload,
			});

			// Extract staffId from response
			// The response structure is typically { resourceId: number }
			const staffId = (staffResponse as any)?.resourceId;

			if (!staffId) {
				throw new Error("Failed to create staff record");
			}

			// Step 2: Create User Record with staffId
			await createUserMutation.mutateAsync({
				requestBody: {
					username: values.username,
					firstname: values.firstname,
					lastname: values.lastname,
					email: values.email,
					officeId: values.officeId,
					roles: values.roles,
					staffId: staffId,
					sendPasswordToEmail: values.sendPasswordToEmail,
				},
			});

			// Show success message and navigate to user list
			toast.success("User created successfully!");
			navigate({ to: "/users" });
		} catch (err: any) {
			setError(
				err.body?.errors?.[0]?.developerMessage ||
					err.message ||
					"Failed to create user. Please try again.",
			);
		}
	};

	const handleBack = () => {
		navigate({ to: "/users" });
	};

	const initialValues: UserFormValues = {
		username: "",
		firstname: "",
		lastname: "",
		email: "",
		mobileNo: "",
		officeId: 0,
		roles: [],
		joiningDate: "",
		isLoanOfficer: false,
		sendPasswordToEmail: true,
	};

	return (
		<div className="p-6">
			<Button onClick={handleBack} variant="ghost" size="sm" className="mb-4">
				<ArrowLeft className="w-4 h-4 mr-2" />
				Back to Users
			</Button>

			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Create New User</h1>
				<p className="text-sm text-gray-600 mt-1">
					Add a new user account to the system
				</p>
			</div>

			<div className="max-w-3xl">
				<Card variant="elevated" size="lg">
					<div className="p-6">
						<Form
							initialValues={initialValues}
							validationSchema={userFormSchema}
							onSubmit={handleSubmit}
						>
							<FormTitle>User Information</FormTitle>

							{error && (
								<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
									{error}
								</div>
							)}

							<div className="space-y-4">
								<Input
									name="username"
									label="Username"
									type="text"
									placeholder="Enter username"
									required
									helperText="Username cannot be changed after creation"
								/>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
								</div>

								<Input
									name="email"
									label="Email Address"
									type="email"
									placeholder="user@example.com"
									required
								/>

								<Input
									name="mobileNo"
									label="Phone Number"
									type="text"
									placeholder="+1234567890"
									required
								/>

								<Input
									name="officeId"
									label="Office"
									type="select"
									required
									options={template?.allowedOffices?.map((office: any) => ({
										value: office.id,
										label: office.name,
									}))}
								/>

								<Input
									name="roles"
									label="Roles"
									type="select"
									required
									multiple
									options={template?.availableRoles?.map((role: any) => ({
										value: role.id,
										label: role.name,
									}))}
									helperText="Select one or more roles for this user"
								/>

								<Input
									name="joiningDate"
									label="Joining Date (Optional)"
									type="date"
								/>

								<Input
									name="isLoanOfficer"
									label="Is Loan Officer"
									type="checkbox"
								/>

								<Input
									name="sendPasswordToEmail"
									label="Send password to email"
									type="checkbox"
									helperText="A temporary password will be generated and sent to the user's email"
								/>

								<div className="pt-4 flex items-center gap-3">
									<SubmitButton
										label={
											createStaffMutation.isPending ||
											createUserMutation.isPending
												? "Creating User..."
												: "Create User"
										}
									/>
									<Button
										type="button"
										variant="outline"
										onClick={handleBack}
									>
										Cancel
									</Button>
								</div>
							</div>
						</Form>
					</div>
				</Card>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/users/create")({
	component: CreateUserPage,
});
