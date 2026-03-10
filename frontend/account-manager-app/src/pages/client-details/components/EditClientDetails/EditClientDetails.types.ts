import { z } from "zod";

export const editClientValidationSchema = z.object({
	firstname: z.string().min(1, "First name is required"),
	lastname: z.string().min(1, "Last name is required"),
	emailAddress: z.string().email("Invalid email address").optional(),
	mobileNo: z.string().min(1, "Mobile number is required"),
});

export const initialValues = {
	firstname: "",
	lastname: "",
	emailAddress: "",
	mobileNo: "",
};
