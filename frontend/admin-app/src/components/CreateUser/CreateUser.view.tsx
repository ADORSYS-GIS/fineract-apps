import {
	Button,
	Card,
	FormTitle,
	Input,
	SubmitButton,
} from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { Form, Formik } from "formik";
import { ArrowLeft } from "lucide-react";
import { useCreateUser } from "./useCreateUser";

export const CreateUserView = () => {
	const {
		initialValues,
		staffOptions,
		roleOptions,
		isCreatingUser,
		onSubmit,
		error,
	} = useCreateUser();

	return (
		<div>
			<Link to="/users/list">
				<Button variant="ghost" size="sm" className="mb-4">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Users
				</Button>
			</Link>

			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Create New User</h1>
				<p className="text-sm text-gray-600 mt-1">
					Add a new user account to the system
				</p>
			</div>

			<div>
				<Card variant="elevated" size="lg">
					<div className="p-6">
						<Formik
							initialValues={initialValues}
							onSubmit={onSubmit}
							enableReinitialize
						>
							{() => (
								<Form>
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

										<Input
											name="email"
											label="Email Address"
											type="email"
											placeholder="user@example.com"
											required
										/>

										<Input
											name="staffId"
											label="Staff"
											type="select"
											required
											options={staffOptions}
										/>

										<Input
											name="roles"
											label="Roles"
											type="select"
											required
											options={roleOptions}
											helperText="Select one or more roles for this user"
										/>

										<Input
											name="password"
											label="Password (Optional)"
											type="password"
											placeholder="Enter password"
										/>
										<Input
											name="repeatPassword"
											label="Repeat Password"
											type="password"
											placeholder="Repeat password"
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
													isCreatingUser ? "Creating User..." : "Create User"
												}
											/>
											<Link to="/users/list">
												<Button type="button" variant="outline">
													Cancel
												</Button>
											</Link>
										</div>
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</Card>
			</div>
		</div>
	);
};
