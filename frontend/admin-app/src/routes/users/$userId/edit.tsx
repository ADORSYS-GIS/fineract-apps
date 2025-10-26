import {
	type OfficeData,
	type RoleData,
	useStaffServicePutV1StaffByStaffId,
	useUsersServiceGetV1UsersByUserId,
	useUsersServiceGetV1UsersTemplate,
	useUsersServicePutV1UsersByUserId,
} from "@fineract-apps/fineract-api";
import {
	Button,
	Card,
	Form,
	FormTitle,
	Input,
	SubmitButton,
} from "@fineract-apps/ui";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/Toast";
import {
	type UserEditFormValues,
	userEditFormSchema,
} from "@/components/UserForm/userFormSchema";

function EditUserPage() {
	const { userId } = Route.useParams();
	const navigate = useNavigate();
	const toast = useToast();
	const [error, setError] = useState<string | null>(null);

	// Fetch user details and template
	const { data: user, isLoading } = useUsersServiceGetV1UsersByUserId({
		userId: Number(userId),
	});
	const { data: template } = useUsersServiceGetV1UsersTemplate();

	// Mutations
	const updateUserMutation = useUsersServicePutV1UsersByUserId();
	const updateStaffMutation = useStaffServicePutV1StaffByStaffId();

	const handleSubmit = async (values: UserEditFormValues) => {
		setError(null);

		try {
			// Update user record
			await updateUserMutation.mutateAsync({
				userId: Number(userId),
				requestBody: {
					firstname: values.firstname,
					lastname: values.lastname,
					email: values.email,
					officeId: values.officeId,
					roles: values.roles,
				},
			});

			// If phone changed, update staff record
			if (values.mobileNo !== user?.mobileNo && user?.staffId) {
				await updateStaffMutation.mutateAsync({
					staffId: user.staffId,
					requestBody: {
						firstname: values.firstname,
						lastname: values.lastname,
						mobileNo: values.mobileNo,
						officeId: values.officeId,
						isLoanOfficer: values.isLoanOfficer,
					},
				});
			}

			// Show success message and navigate to user detail
			toast.success("User updated successfully!");
			navigate({ to: "/users/$userId", params: { userId } });
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Failed to update user. Please try again.";
			setError(errorMessage);
		}
	};

	const handleBack = () => {
		navigate({ to: "/users/$userId", params: { userId } });
	};

	if (isLoading) {
		return (
			<div className="p-6">
				<div className="text-center text-gray-500">Loading user details...</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="p-6">
				<Card variant="elevated">
					<div className="p-8 text-center">
						<p className="text-gray-500">User not found</p>
						<Button
							onClick={() => navigate({ to: "/users" })}
							variant="outline"
							className="mt-4"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Users
						</Button>
					</div>
				</Card>
			</div>
		);
	}

	const initialValues: UserEditFormValues = {
		firstname: user?.firstname || "",
		lastname: user?.lastname || "",
		email: user?.email || "",
		mobileNo: user?.mobileNo || "",
		officeId: user?.officeId || 0,
		roles: user?.selectedRoles?.map((role: RoleData) => role.id) || [],
		isLoanOfficer: user?.isLoanOfficer || false,
		staffId: user?.staffId,
	};

	return (
		<div className="p-6">
			<Button onClick={handleBack} variant="ghost" size="sm" className="mb-4">
				<ArrowLeft className="w-4 h-4 mr-2" />
				Back to User Details
			</Button>

			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Edit User</h1>
				<p className="text-sm text-gray-600 mt-1">
					Update user account information
				</p>
			</div>

			<div className="max-w-3xl">
				<Card variant="elevated" size="lg">
					<div className="p-6">
						<Form
							initialValues={initialValues}
							validationSchema={userEditFormSchema}
							onSubmit={handleSubmit}
						>
							<FormTitle>User Information</FormTitle>

							{error && (
								<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
									{error}
								</div>
							)}

							<div className="space-y-4">
								{/* Show username as read-only */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Username
									</label>
									<div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-600">
										{user?.username || "N/A"}
									</div>
									<p className="mt-1 text-xs text-gray-500">
										Username cannot be changed
									</p>
								</div>

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
									options={template?.allowedOffices?.map(
										(office: OfficeData) => ({
											value: office.id,
											label: office.name,
										}),
									)}
								/>

								<Input
									name="roles"
									label="Roles"
									type="select"
									required
									multiple
									options={template?.availableRoles?.map((role: RoleData) => ({
										value: role.id,
										label: role.name,
									}))}
									helperText="Select one or more roles for this user"
								/>

								<Input
									name="isLoanOfficer"
									label="Is Loan Officer"
									type="checkbox"
								/>

								<div className="pt-4 flex items-center gap-3">
									<SubmitButton
										label={
											updateUserMutation.isPending ||
											updateStaffMutation.isPending
												? "Saving Changes..."
												: "Save Changes"
										}
									/>
									<Button type="button" variant="outline" onClick={handleBack}>
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

export const Route = createFileRoute("/users/$userId/edit")({
	component: EditUserPage,
});
