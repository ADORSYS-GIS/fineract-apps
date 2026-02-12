import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useCreateClientMutation } from "@/hooks/useCreateClientMutation";
import { fineractApi } from "@/services/api";
import {
	type CreateClientForm,
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
		const officeId = offices?.[0]?.id;
		if (!officeId) {
			toast.error("No office found to assign the client to.");
			return;
		}

		const isPerson = values.legalFormId === "1";

		const requestBody = {
			officeId,
			legalFormId: Number(values.legalFormId),
			emailAddress: values.emailAddress,
			mobileNo: values.mobileNo,
			active: values.active,
			activationDate: values.active
				? format(new Date(), "dd MMMM yyyy")
				: undefined,
			dateFormat: "dd MMMM yyyy",
			locale: "en",
			...(isPerson
				? { firstname: values.firstname, lastname: values.lastname }
				: { fullname: values.fullname }),
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
