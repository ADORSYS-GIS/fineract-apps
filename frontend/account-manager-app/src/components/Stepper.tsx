import React from "react";

interface StepperProps {
	steps: { label: string }[];
	activeStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, activeStep }) => {
	const getStepStyle = (index: number) => {
		if (index === activeStep) return "bg-blue-500 text-white";
		if (index < activeStep) return "bg-green-500 text-white";
		return "bg-gray-300 text-gray-600";
	};

	return (
		<div className="relative">
			<progress
				className="absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]"
				aria-label="Step progress"
				value={activeStep + 1}
				max={steps.length}
			/>
			<div className="flex items-center justify-center">
				{steps.map((step, index) => (
					<React.Fragment key={step.label}>
						<div className="flex items-center">
							<div
								className={`flex items-center justify-center w-8 h-8 rounded-full ${getStepStyle(
									index,
								)}`}
								aria-current={index === activeStep ? "step" : undefined}
							>
								{index < activeStep ? "✔" : index + 1}
							</div>
							<div
								className={`ml-2 ${
									index === activeStep ? "text-blue-500" : "text-gray-600"
								}`}
							>
								{step.label}
							</div>
						</div>
						{index < steps.length - 1 && (
							<div className="flex-auto border-t-2 border-gray-300 mx-4" />
						)}
					</React.Fragment>
				))}
			</div>
		</div>
	);
};
