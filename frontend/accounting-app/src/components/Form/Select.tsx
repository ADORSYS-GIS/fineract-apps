import { forwardRef } from "react";

interface Option {
	value: string;
	label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	error?: string;
	helperText?: string;
	options: Option[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ label, error, helperText, options, className = "", ...props }, ref) => {
		return (
			<div className="w-full">
				{label && (
					<label className="block text-sm font-medium text-gray-700 mb-1">
						{label}
					</label>
				)}
				<select
					ref={ref}
					className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 ${
						error
							? "border-red-500 focus:ring-red-500"
							: "border-gray-300 focus:ring-blue-500"
					} ${className}`}
					{...props}
				>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
				{helperText && !error && (
					<p className="mt-1 text-sm text-gray-500">{helperText}</p>
				)}
			</div>
		);
	},
);

Select.displayName = "Select";
