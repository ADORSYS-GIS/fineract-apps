import { ApiError, RegistrationService } from "@fineract-apps/fineract-api";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { RegistrationFormValues } from "@/pages/registration/register.types";

export const useRegistration = () => {
	const mutation = useMutation<
		Awaited<ReturnType<typeof RegistrationService.postApiRegistrationRegister>>,
		ApiError,
		RegistrationFormValues
	>({
		mutationFn: (data: RegistrationFormValues) => {
			const requestBody = {
				...data,
				dateOfBirth: format(new Date(data.dateOfBirth), "yyyy-MM-dd"),
				dateFormat: "yyyy-MM-dd",
				locale: "en",
			};
			return RegistrationService.postApiRegistrationRegister({
				requestBody,
			});
		},
	});

	const { error, ...rest } = mutation;
	const errorBody = error?.body as {
		developerMessage?: string;
		errors?: { defaultUserMessage?: string }[];
	};
	const detailedMessage = errorBody?.errors?.[0]?.defaultUserMessage;
	const developerMessage =
		detailedMessage ?? errorBody?.developerMessage ?? error?.message;
	const registrationError = developerMessage
		? { message: developerMessage }
		: null;

	return { ...rest, error: registrationError };
};
