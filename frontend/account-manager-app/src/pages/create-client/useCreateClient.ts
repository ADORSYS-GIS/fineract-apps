import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { z } from "zod";
import { useCreateClientMutation } from "@/hooks/useCreateClientMutation";
import { fineractApi } from "@/services/api";
import {
	createClientValidationSchema,
	initialValues,
} from "./CreateClient.types";

export const useCreateClient = () => {
	const { data: offices, isLoading: isFetchingOffices } = useQuery({
		queryKey: ["offices"],
		queryFn: () => fineractApi.offices.getV1Offices(),
	});

	const { mutate: createClient, isPending: isCreatingClient } =
		useCreateClientMutation();

	const onSubmit = (values: z.infer<typeof createClientValidationSchema>) => {
		const officeId = offices?.[1]?.id;
		if (!officeId) {
			toast.error("No office found to assign the client to.");
			return;
		}
		const requestBody = {
			...values,
			officeId,
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
		isCreatingClient: isCreatingClient || isFetchingOffices,
	};
};
