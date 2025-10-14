import { Button } from "@fineract-apps/ui";
import { ArrowLeft } from "lucide-react";
import { FC } from "react";
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
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 z-40 bg-black/40"
				onClick={() => handleClose(onClose)}
			/>

			{/* Bottom Sheet */}
			<div
				className="fixed inset-x-0 bottom-0 z-50 flex justify-center"
				onClick={() => handleClose(onClose)}
			>
				<div
					className="bg-white rounded-t-2xl w-full max-w-md shadow-lg"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Drag handle */}
					<div className="flex justify-center pt-4">
						<div className="w-12 h-1.5 bg-gray-300 rounded-full" />
					</div>

					<header className="p-4 flex items-center">
						<Button variant="ghost" onClick={() => handleClose(onClose)}>
							<ArrowLeft className="h-6 w-6" />
						</Button>
						<h1 className="text-xl font-semibold ml-4">Capture Image</h1>
					</header>
					<main className="p-4 pt-0">
						<div className="flex flex-col items-center">
							{capturedImage ? (
								<img
									src={capturedImage}
									alt="Captured"
									className="w-full h-auto rounded-lg"
								/>
							) : (
								<video
									ref={videoRef}
									autoPlay
									className="w-full h-auto rounded-lg"
								/>
							)}
							<canvas ref={canvasRef} className="hidden" />
							<div className="mt-4 flex w-full space-x-4">
								{capturedImage ? (
									<>
										<Button
											onClick={handleRetake}
											variant="outline"
											className="w-full"
										>
											Retake
										</Button>
										<Button onClick={handleUpload} className="w-full">
											Upload
										</Button>
									</>
								) : (
									<Button onClick={handleCapture} className="w-full">
										Capture
									</Button>
								)}
							</div>
						</div>
					</main>
				</div>
			</div>
		</>
	);
};
