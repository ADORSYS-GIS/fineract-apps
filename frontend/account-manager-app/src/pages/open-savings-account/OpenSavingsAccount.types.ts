import { z } from "zod";

export const openSavingsAccountValidationSchema = z.object({
	productId: z.string().min(1, "Product is required"),
	submittedOnDate: z.string().min(1, "Submitted on date is required"),
});

export const initialValues = {
	productId: "",
	submittedOnDate: "",
};
