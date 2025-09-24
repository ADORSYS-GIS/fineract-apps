import { Card, Form, Input, SubmitButton } from "@fineract-apps/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/create/account/loan")({
	component: LoanAccountWizard,
});

function LoanAccountWizard() {
	const [step, setStep] = useState(1);

	// Navigation functions
	const nextStep = () => setStep((prev) => prev + 1);
	const prevStep = () => setStep((prev) => prev - 1);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Create Loan Account</h1>

			<Card className="p-6 space-y-4">
				{/* Step 1: Verify or create client */}
				{step === 1 && (
					<Form
						initialValues={{ clientName: "", idNumber: "", address: "" }}
						onSubmit={nextStep}
					>
						<Input
							name="clientName"
							label="Client Name"
							placeholder="Enter client name"
						/>
						<Input
							name="idNumber"
							label="ID Number"
							placeholder="Enter ID number"
						/>
						<Input
							name="address"
							label="Address"
							placeholder="Enter client address"
						/>
						<SubmitButton label="Next" />
					</Form>
				)}

				{/* Step 2: Select loan product */}
				{step === 2 && (
					<Form initialValues={{ product: "", amount: "" }} onSubmit={nextStep}>
						<Input
							name="product"
							label="Select Loan Product"
							type="select"
							options={[
								{ label: "Personal Loan", value: "personal" },
								{ label: "Business Loan", value: "business" },
								{ label: "Agricultural Loan", value: "agricultural" },
							]}
						/>
						<Input
							name="amount"
							label="Requested Amount"
							type="number"
							placeholder="Enter loan amount"
						/>
						<div className="flex justify-between mt-4">
							<button type="button" onClick={prevStep} className="btn">
								Back
							</button>
							<SubmitButton label="Next" />
						</div>
					</Form>
				)}

				{/* Step 3: Client financial info */}
				{step === 3 && (
					<Form
						initialValues={{ income: "", expenses: "", collateral: "" }}
						onSubmit={nextStep}
					>
						<Input
							name="income"
							label="Monthly Income"
							type="number"
							placeholder="Enter income"
						/>
						<Input
							name="expenses"
							label="Monthly Expenses"
							type="number"
							placeholder="Enter expenses"
						/>
						<Input
							name="collateral"
							label="Collateral / Guarantee"
							placeholder="Enter collateral info"
						/>
						<div className="flex justify-between mt-4">
							<button type="button" onClick={prevStep} className="btn">
								Back
							</button>
							<SubmitButton label="Next" />
						</div>
					</Form>
				)}

				{/* Step 4: Review & Submit */}
				{step === 4 && (
					<div>
						<h2 className="font-semibold text-lg mb-2">
							Step 4: Review & Submit
						</h2>
						<p>
							This is where the summary of client and loan information will be
							displayed.
						</p>
						<div className="flex justify-between mt-4">
							<button onClick={prevStep} className="btn">
								Back
							</button>
							<button
								onClick={() => alert("Loan Account Created!")}
								className="btn btn-primary"
							>
								Submit
							</button>
						</div>
					</div>
				)}
			</Card>
		</div>
	);
}
