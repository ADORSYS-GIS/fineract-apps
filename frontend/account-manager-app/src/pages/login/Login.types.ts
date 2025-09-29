import { PostAuthenticationRequest } from "@fineract-apps/fineract-api";
import { z } from "zod";

export const loginSchema = z.object({
	username: z.string().min(1, "Username is required"),
	password: z.string().min(1, "Password is required"),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const initialValues: PostAuthenticationRequest = {
	username: "",
	password: "",
};
