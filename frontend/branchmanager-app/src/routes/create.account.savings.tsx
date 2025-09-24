import { Card, Form, Input, SubmitButton } from "@fineract-apps/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/create/account/savings")({
	component: SavingsAccountWizard,
});

function SavingsAccountWizard() {
	const [step, setStep] = useState(1);

	// Function to go to next step
	const nextStep = () => setStep((prev) => prev + 1);
	const prevStep = () => setStep((prev) => prev - 1);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Create Savings Account</h1>

			<Card className="p-6 space-y-4">
				{step === 1 && (
					<Form
						initialValues={{ clientName: "", idNumber: "", address: "" }}
						onSubmit={nextStep} // moves to next step when submitted
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

				{step === 2 && (
					<Form initialValues={{ product: "" }} onSubmit={nextStep}>
						<Input
							name="product"
							label="Select Product"
							type="select"
							options={[
								{ label: "Standard Savings", value: "standard" },
								{ label: "Term Account", value: "term" },
							]}
						/>
						<div className="flex justify-between mt-4">
							<SubmitButton label="Next" />
						</div>
					</Form>
				)}

				{step === 3 && (
					<Form initialValues={{ initialDeposit: "" }} onSubmit={nextStep}>
						<Input
							name="initialDeposit"
							label="Initial Deposit"
							type="number"
							placeholder="Enter initial deposit"
						/>
						<div className="flex justify-between mt-4">
							<button type="button" onClick={prevStep} className="btn">
								Back
							</button>
							<SubmitButton label="Next" />
						</div>
					</Form>
				)}

				{step === 4 && (
					<div>
						<h2 className="font-semibold text-lg mb-2">
							Step 4: Review & Submit
						</h2>
						<p>This is where you would display the summary of entered data.</p>
						<div className="flex justify-between mt-4">
							<button onClick={prevStep} className="btn">
								Back
							</button>
							<button
								onClick={() => alert("Account Created!")}
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
