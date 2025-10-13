import {
	Button,
	Form,
	FormTitle,
	Input,
	SubmitButton,
} from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import type { FormValues } from "./Allocate.types";

export const AllocateView = ({
	initialValues,
	currencyOptions,
	isLoading,
	onSubmit,
	isSubmitting,
	submitLabel = "Allocate",
	onCancel,
}: {
	initialValues: FormValues;
	currencyOptions: { label: string; value: string }[];
	isLoading: boolean;
	onSubmit: (values: FormValues) => Promise<void> | void;
	isSubmitting: boolean;
	submitLabel?: string;
	onCancel?: () => void;
}) => {
	const navigate = useNavigate();
	return (
		<div className="px-6 py-6">
			<Form<FormValues> initialValues={initialValues} onSubmit={onSubmit}>
				<FormTitle>Allocate Funds</FormTitle>
				<div className="grid grid-cols-1 gap-4">
					<Input
						name="amount"
						label="Amount"
						type="number"
						placeholder="Enter amount"
					/>
					<Input
						name="currencyCode"
						label="Currency"
						type="select"
						disabled={isLoading}
						options={currencyOptions}
					/>
					<Input name="notes" label="Notes" placeholder="Notes (optional)" />
					<Input name="date" label="Transaction date" type="date" />
					<div className="flex flex-col sm:flex-row justify-end gap-3">
						<SubmitButton
							label={isSubmitting ? `${submitLabel}...` : submitLabel}
						/>
						<Button
							variant="outline"
							onClick={() =>
								onCancel ? onCancel() : navigate({ to: "/tellers" })
							}
						>
							Cancel
						</Button>
					</div>
				</div>
			</Form>
		</div>
	);
};
