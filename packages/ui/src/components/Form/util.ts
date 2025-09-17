// packages/ui/src/components/Form/util.ts

/**
 * Simple classNames helper.
 */
export function cx(...parts: Array<string | false | null | undefined>) {
	return parts.filter(Boolean).join(" ");
}

/**
 * Generates Tailwind CSS classes for form inputs based on their state.
 * @param size - The size of the input (sm, md, lg).
 * @param variant - The visual variant of the input (outlined, filled, standard).
 * @param error - The error message string, if any.
 * @param touched - Whether the input has been touched by the user.
 * @returns A string of CSS classes.
 */
export function getInputClasses(
	size: "sm" | "md" | "lg",
	variant: "outlined" | "filled" | "standard",
	error?: string,
	touched?: boolean,
): string {
	const baseClasses =
		"block w-full rounded-md border px-3 focus:outline-none focus:ring-2";

	const sizeClasses = {
		sm: "text-sm py-1",
		md: "text-base py-2",
		lg: "text-lg py-3",
	};

	const variantClasses = {
		outlined: "bg-white border-green-200 focus:ring-green-300",
		filled: "bg-green-50 border-green-200 focus:ring-green-300",
		standard: "border-transparent focus:ring-0",
	};

	const errorClasses =
		error && touched ? "border-red-400 focus:ring-red-200" : "";

	return cx(
		baseClasses,
		sizeClasses[size],
		variantClasses[variant],
		errorClasses,
	);
}
