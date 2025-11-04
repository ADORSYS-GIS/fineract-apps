import { format } from "date-fns";
import { z } from "zod";
import { useCreateClientMutation } from "@/hooks/useCreateClientMutation";
import {
	createClientValidationSchema,
	initialValues,
} from "../create-client/CreateClient.types";

export const useCreateAccount = () => {
	const { mutate: createClient, isPending: isCreatingClient } =
		useCreateClientMutation();

	const onSubmit = (values: z.infer<typeof createClientValidationSchema>) => {
		const requestBody = {
			...values,
			officeId: 2,
			legalFormId: 1,
			activationDate: values.active
				? format(new Date(), "dd MMMM yyyy")
				: undefined,
			dateFormat: "dd MMMM yyyy",
			locale: "en",
		};
		createClient({ requestBody });
	};

	return {
		initialValues,
		validationSchema: createClientValidationSchema,
		onSubmit,
		isCreatingClient,
	};
};
