import { Button } from "@fineract-apps/ui";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { FC } from "react";
import { AssetDetailsStep } from "./steps/AssetDetailsStep";
import { PricingStep } from "./steps/PricingStep";
import { ReviewStep } from "./steps/ReviewStep";
import { SelectCompanyStep } from "./steps/SelectCompanyStep";
import { SupplyStep } from "./steps/SupplyStep";
import { useCreateAsset } from "./useCreateAsset";

export const CreateAssetView: FC<ReturnType<typeof useCreateAsset>> = (
	props,
) => {
	const {
		currentStep,
		steps,
		formData,
		updateFormData,
		nextStep,
		prevStep,
		handleSubmit,
		isSubmitting,
		clients,
		isLoadingClients,
	} = props;

	const renderStep = () => {
		switch (currentStep) {
			case 0:
				return (
					<SelectCompanyStep
						formData={formData}
						updateFormData={updateFormData}
						clients={clients}
						isLoadingClients={isLoadingClients}
					/>
				);
			case 1:
				return (
					<AssetDetailsStep
						formData={formData}
						updateFormData={updateFormData}
					/>
				);
			case 2:
				return (
					<PricingStep formData={formData} updateFormData={updateFormData} />
				);
			case 3:
				return (
					<SupplyStep formData={formData} updateFormData={updateFormData} />
				);
			case 4:
				return <ReviewStep formData={formData} />;
			default:
				return null;
		}
	};

	const isLastStep = currentStep === steps.length - 1;

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
				<h1 className="text-2xl font-bold text-gray-800 mb-6">
					Create New Asset
				</h1>

				{/* Stepper */}
				<div className="mb-8">
					<div className="flex items-center justify-between">
						{steps.map((step, index) => (
							<div key={step} className="flex items-center">
								<div
									className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
										index < currentStep
											? "bg-green-600 text-white"
											: index === currentStep
												? "bg-blue-600 text-white"
												: "bg-gray-200 text-gray-500"
									}`}
								>
									{index < currentStep ? (
										<Check className="h-4 w-4" />
									) : (
										index + 1
									)}
								</div>
								{index < steps.length - 1 && (
									<div
										className={`hidden sm:block w-12 md:w-20 h-0.5 mx-1 ${
											index < currentStep ? "bg-green-600" : "bg-gray-200"
										}`}
									/>
								)}
							</div>
						))}
					</div>
					<div className="flex justify-between mt-2">
						{steps.map((step, index) => (
							<span
								key={step}
								className={`text-xs hidden sm:block ${
									index === currentStep
										? "text-blue-600 font-medium"
										: "text-gray-400"
								}`}
							>
								{step}
							</span>
						))}
					</div>
				</div>

				{/* Step Content */}
				<div className="bg-white rounded-lg shadow p-6 mb-6">
					{renderStep()}
				</div>

				{/* Navigation */}
				<div className="flex justify-between">
					<Button
						variant="outline"
						onClick={prevStep}
						disabled={currentStep === 0}
						className="flex items-center gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						Previous
					</Button>

					{isLastStep ? (
						<Button
							onClick={handleSubmit}
							disabled={isSubmitting}
							className="flex items-center gap-2"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								<>
									<Check className="h-4 w-4" />
									Create Asset
								</>
							)}
						</Button>
					) : (
						<Button onClick={nextStep} className="flex items-center gap-2">
							Next
							<ArrowRight className="h-4 w-4" />
						</Button>
					)}
				</div>
			</main>
		</div>
	);
};
