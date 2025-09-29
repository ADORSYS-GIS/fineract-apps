import { GetClientsPageItemsResponse } from "@fineract-apps/fineract-api";
import { z } from "zod";

export const activateClientValidationSchema = z.object({
	activationDate: z.string().min(1, "Activation date is required"),
});

export type ActivateClientForm = z.infer<typeof activateClientValidationSchema>;

export const initialValues: ActivateClientForm = {
	activationDate: "",
};

export type ActivateClientProps = {
	client: GetClientsPageItemsResponse;
	onClose: () => void;
};
