import { z } from "zod";

export const createClientValidationSchema = z
	.object({
		legalFormId: z.enum(["1", "2"]),
		firstname: z.string().optional(),
		lastname: z.string().optional(),
		fullname: z.string().optional(),
		emailAddress: z
			.string()
			.email("Invalid email address")
			.optional()
			.or(z.literal("")),
		mobileNo: z.string().optional(),
		activationDate: z.string().optional(),
		active: z.boolean(),
	})
	.refine(
		(data) =>
			data.legalFormId !== "1" ||
			(!!data.firstname?.trim() && !!data.lastname?.trim()),
		{
			message: "First name and last name are required for a person",
			path: ["firstname"],
		},
	)
	.refine((data) => data.legalFormId !== "2" || !!data.fullname?.trim(), {
		message: "Entity name is required",
		path: ["fullname"],
	});

export type CreateClientForm = z.infer<typeof createClientValidationSchema>;

export const initialValues: CreateClientForm = {
	legalFormId: "1",
	firstname: "",
	lastname: "",
	fullname: "",
	emailAddress: "",
	mobileNo: "",
	activationDate: new Date().toISOString().split("T")[0],
	active: false,
};
