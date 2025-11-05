import {
	Button,
	Card,
	Form,
	FormTitle,
	Input,
	SubmitButton,
} from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { Formik } from "formik";
import { ArrowLeft } from "lucide-react";
import { useEditUser } from "./useEditUser";

export const EditUserView = () => {
	const {
		initialValues,
		officeOptions,
		staffOptions,
		roleOptions,
		isUpdatingUser,
		onSubmit,
		user,
		error,
	} = useEditUser();

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<Link to="/users/$userId" params={{ userId: user.id!.toString() }}>
				<Button variant="ghost" size="sm" className="mb-4">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to User Details
				</Button>
			</Link>

			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Edit User</h1>
				<p className="text-sm text-gray-600 mt-1">
					Update the details of {user.username}
				</p>
			</div>

			<div className="max-w-3xl">
				<Card variant="elevated" size="lg">
					<div className="p-6">
						<Formik
							initialValues={initialValues}
							onSubmit={onSubmit}
							enableReinitialize
						>
							{({ handleSubmit }) => (
								<Form onSubmit={() => handleSubmit()}>
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
											disabled
											helperText="Username cannot be changed"
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
											name="officeId"
											label="Office"
											type="select"
											required
											options={officeOptions}
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

										<div className="pt-4 flex items-center gap-3">
											<SubmitButton
												label={
													isUpdatingUser ? "Updating User..." : "Update User"
												}
											/>
											<Link
												to="/users/$userId"
												params={{ userId: user.id!.toString() }}
											>
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
