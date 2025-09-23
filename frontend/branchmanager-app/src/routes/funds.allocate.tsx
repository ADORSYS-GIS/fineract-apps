import { Button, Card, Form, Input } from "@fineract-apps/ui";
import { createFileRoute } from "@tanstack/react-router";

type AllocateValues = {
	teller: string;
	amount: number | string;
	notes?: string;
};

function AllocateFundsPage() {
	const initialValues: AllocateValues = { teller: "", amount: "", notes: "" };

	return (
		<div className="px-6 py-6">
			<header className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900">
					Teller Fund Management
				</h1>
				<p className="text-gray-500 mt-1">
					Allocate and settle funds for your tellers.
				</p>
			</header>

			<div className="grid grid-cols-1 gap-6 max-w-3xl">
				<Card>
					<h2 className="text-xl font-bold text-gray-800 mb-4">
						Allocate Funds
					</h2>
					<Form<AllocateValues>
						initialValues={initialValues}
						onSubmit={() => {
							/* wire later */
						}}
						className="bg-transparent shadow-none p-0"
					>
						<Input
							name="teller"
							label="Teller"
							type="select"
							options={[
								{ label: "Select Teller", value: "" },
								{ label: "John Doe", value: "john" },
								{ label: "Jane Smith", value: "jane" },
							]}
						/>
						<Input
							name="amount"
							label="Amount"
							type="number"
							placeholder="0.00"
						/>
						<Input
							name="notes"
							label="Notes"
							type="textarea"
							placeholder="Add optional notes..."
						/>
						<div className="flex justify-end pt-2">
							<Button type="submit">Allocate Funds</Button>
						</div>
					</Form>
				</Card>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/funds/allocate")({
	component: AllocateFundsPage,
});
