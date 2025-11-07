import { ApiError } from "@fineract-apps/fineract-api";
import { toast } from "react-hot-toast";

type FineractError = {
	response: {
		data: {
			errors: {
				defaultUserMessage: string;
				userMessageGlobalisationCode: string;
				args: { value: string }[];
			}[];
		};
	};
};

const errorMap: { [key: string]: (args: { value: string }[]) => string } = {
	"error.msg.loan.expecteddisbursal.should.be.on.or.after.approval.date": (
		args,
	) =>
		`The approval date cannot be after the expected disbursement date. Please select a date on or before ${args[1].value}.`,
};

export function useErrorHandler() {
	const handleFineractError = (error: FineractError) => {
		const firstError = error.response.data.errors[0];
		const mappedError = errorMap[firstError.userMessageGlobalisationCode];

		if (mappedError) {
			toast.error(mappedError(firstError.args));
		} else {
			toast.error(firstError.defaultUserMessage);
		}
	};

	const handleError = (error: unknown) => {
		if (error instanceof ApiError) {
			handleFineractError(error as unknown as FineractError);
		} else {
			toast.error("An unexpected error occurred.");
		}
	};

	return { handleError };
}
