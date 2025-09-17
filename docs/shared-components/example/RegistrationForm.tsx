// packages/ui/src/components/Form/RegistrationForm.tsx
import React from "react";
import {
	Form,
	FormWarning,
	Input,
	SubmitButton,
} from "../../../packages/ui/src/components/Form"; // index.tsx in same folder
import { ValidationFn } from "../../../packages/ui/src/components/Form/Form.types";

export type RegistrationValues = {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
	dob: string; // yyyy-mm-dd
	acceptTerms: boolean;
};

export interface RegistrationFormProps {
	onSubmit?: (values: RegistrationValues) => void | Promise<void>;
}

/** small helper to compute age from yyyy-mm-dd string */
function ageFromIsoDate(iso: string): number {
	if (!iso) return 0;
	const [y, m, d] = iso.split("-").map((s) => parseInt(s, 10));
	if (!y || !m || !d) return 0;
	const dob = new Date(y, m - 1, d);
	const now = new Date();
	let age = now.getFullYear() - dob.getFullYear();
	const mo = now.getMonth() - dob.getMonth();
	if (mo < 0 || (mo === 0 && now.getDate() < dob.getDate())) age--;
	return age;
}

/** Validation functions typed to accept unknowns from generic Form */
const required: ValidationFn<RegistrationValues> = (v) =>
	!v || (typeof v === "string" && v.trim() === "") ? "Required" : undefined;

const minLength =
	(n: number): ValidationFn<RegistrationValues> =>
	(v) =>
		typeof v === "string" && v.length < n
			? `Must be at least ${n} characters`
			: undefined;

const emailValidator: ValidationFn<RegistrationValues> = (v) => {
	const s = typeof v === "string" ? v : "";
	if (!s) return "Required";
	// OWASP-recommended regex for email validation to prevent ReDoS
	const ok =
		/^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/.test(
			s,
		);
	return ok ? undefined : "Invalid email";
};

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
	onSubmit,
}) => {
	const initialValues: RegistrationValues = {
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		dob: "",
		acceptTerms: false,
	};

	const validationSchema = {
		username: (v: unknown) => required(v as string),
		email: (v: unknown) => emailValidator(v as string),
		password: (v: unknown) => {
			const r = required(v as string);
			if (r) return r;
			return minLength(8)(v as string);
		},
		confirmPassword: (
			v: string | boolean | undefined,
			values?: RegistrationValues,
		) => {
			const r = required(v);
			if (r) return r;
			const pv = values?.password ?? "";
			return v === pv ? undefined : "Passwords must match";
		},
		dob: (v: string | boolean | undefined) => {
			const r = required(v);
			if (r) return r;
			const age = ageFromIsoDate(typeof v === "string" ? v : "");
			return age >= 18 ? undefined : "You must be at least 18 years old";
		},
		acceptTerms: (v: unknown) =>
			v === true ? undefined : "You must accept the terms",
	};

	const handleSubmit = (values: RegistrationValues) => {
		if (onSubmit) return onSubmit(values);
		/* default demo behaviour: log */
		// eslint-disable-next-line no-console
		console.log("Registered:", values);
	};

	return (
		<Form<RegistrationValues>
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={handleSubmit}
			aria-label="registration-form"
		>
			<h2 className="text-2xl font-bold text-green-700 mb-4">Create account</h2>

			<Input
				name="username"
				label="Username"
				helperText="Your public username"
			/>
			<Input
				name="email"
				label="Email"
				type="email"
				helperText="We'll never share your email"
			/>
			<Input
				name="password"
				label="Password"
				type="password"
				helperText="At least 8 characters"
			/>
			<Input
				name="confirmPassword"
				label="Confirm password"
				type="password"
				helperText="Repeat your password"
			/>
			<Input
				name="dob"
				label="Date of birth"
				type="text"
				placeholder="yyyy-mm-dd"
				helperText="Format: yyyy-mm-dd"
			/>
			<Input
				name="acceptTerms"
				type="checkbox"
				label="I accept the terms and conditions"
			/>

			<div className="my-4">
				<FormWarning title="Under 18 requires approval">
					This account registration will require approval if the applicant is
					under 18.
				</FormWarning>
			</div>

			<div className="mt-6 flex justify-end">
				<SubmitButton label="Register" />
			</div>
		</Form>
	);
};

export default RegistrationForm;
