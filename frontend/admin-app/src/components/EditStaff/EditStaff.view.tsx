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
import { toFormikValidationSchema } from "zod-formik-adapter";
import { staffFormSchema } from "@/components/StaffForm/staffFormSchema";
import { useEditStaff } from "./useEditStaff";

export const EditStaffView = () => {
	const {
		initialValues,
		officeOptions,
		isEditingStaff,
		isLoadingStaff,
		onSubmit,
		error,
	} = useEditStaff();

	if (isLoadingStaff) {
		return (
			<Card variant="elevated">
				<div className="p-8 text-center text-gray-500">Loading staff...</div>
			</Card>
		);
	}

	return (
		<div>
			<Link to="/staff/list">
				<Button variant="ghost" size="sm" className="mb-4">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Staff
				</Button>
			</Link>

			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Edit Staff</h1>
				<p className="text-sm text-gray-600 mt-1">
					Update the details of the staff member
				</p>
			</div>

			<div className="max-w-3xl mx-auto">
				<Card variant="elevated" size="lg">
					<div className="p-6">
						<Formik
							initialValues={initialValues}
							onSubmit={onSubmit}
							validationSchema={toFormikValidationSchema(staffFormSchema)}
							enableReinitialize
						>
							{() => (
								<Form>
									<FormTitle>Staff Information</FormTitle>

									{error && (
										<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
											{error}
										</div>
									)}

									<div className="space-y-4">
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
											name="mobileNo"
											label="Phone Number (Optional)"
											type="text"
											placeholder="+1234567890"
										/>

										<Input
											name="officeId"
											label="Office"
											type="select"
											required
											options={officeOptions}
										/>

										<Input
											name="joiningDate"
											label="Joining Date"
											type="date"
											required
										/>

										<Input
											name="isLoanOfficer"
											label="Is Loan Officer"
											type="checkbox"
										/>

										<Input name="isActive" label="Is Active" type="checkbox" />

										<div className="pt-4 flex items-center gap-3">
											<SubmitButton
												label={
													isEditingStaff ? "Updating Staff..." : "Update Staff"
												}
											/>
											<Link to="/staff/list">
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
