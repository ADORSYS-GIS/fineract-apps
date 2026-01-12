import { Button } from "@fineract-apps/ui";
import { ArrowLeft, X } from "lucide-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useCaptureImage } from "./useCaptureImage";

export const CaptureImage: FC<{
	isOpen: boolean;
	onClose: () => void;
	onCapture: (file: File) => void;
}> = ({ isOpen, onClose, onCapture }) => {
	const {
		videoRef,
		canvasRef,
		capturedImage,
		handleCapture,
		handleRetake,
		handleClose,
	} = useCaptureImage(isOpen);
	const { t } = useTranslation();

	const handleUpload = async () => {
		if (capturedImage) {
			const response = await fetch(capturedImage);
			const blob = await response.blob();
			const file = new File([blob], "capture.png", { type: "image/png" });
			onCapture(file);
			handleClose(onClose);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="relative bg-white rounded-lg shadow-lg w-full max-w-md">
				<button
					type="button"
					className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hidden md:block"
					onClick={() => handleClose(onClose)}
				>
					<X className="w-6 h-6" />
				</button>
				<header className="p-4 flex items-center border-b">
					<Button variant="ghost" onClick={() => handleClose(onClose)}>
						<ArrowLeft className="h-6 w-6" />
					</Button>
					<h1 className="text-xl font-semibold ml-4">
						{t("captureImage.title")}
					</h1>
				</header>
				<main className="p-4">
					<div className="flex flex-col items-center">
						{capturedImage ? (
							<img
								src={capturedImage}
								alt="Captured"
								className="w-full h-auto"
							/>
						) : (
							<video ref={videoRef} autoPlay className="w-full h-auto">
								<track kind="captions" />
							</video>
						)}
						<canvas ref={canvasRef} className="hidden" />
						<div className="mt-4 flex space-x-4">
							{capturedImage ? (
								<>
									<Button onClick={handleRetake}>
										{t("captureImage.retakeButton")}
									</Button>
									<Button onClick={handleUpload}>
										{t("captureImage.uploadButton")}
									</Button>
								</>
							) : (
								<Button onClick={handleCapture}>
									{t("captureImage.captureButton")}
								</Button>
							)}
							<Button variant="secondary" onClick={() => handleClose(onClose)}>
								{t("common.cancel")}
							</Button>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};
