import { useCallback, useEffect, useRef, useState } from "react";

export const useCaptureImage = (isOpen: boolean) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const [capturedImage, setCapturedImage] = useState<string | null>(null);

	const stopStream = useCallback(() => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		}
	}, []);

	const startStream = useCallback(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			streamRef.current = stream;
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}
		} catch (err) {
			console.error("Error accessing camera:", err);
		}
	}, []);

	useEffect(() => {
		if (isOpen) {
			startStream();
		} else {
			stopStream();
			setCapturedImage(null);
		}

		return () => {
			stopStream();
		};
	}, [isOpen, startStream, stopStream]);

	const handleCapture = () => {
		if (videoRef.current && canvasRef.current) {
			const context = canvasRef.current.getContext("2d");
			if (context) {
				canvasRef.current.width = videoRef.current.videoWidth;
				canvasRef.current.height = videoRef.current.videoHeight;
				context.drawImage(
					videoRef.current,
					0,
					0,
					videoRef.current.videoWidth,
					videoRef.current.videoHeight,
				);
				const dataUrl = canvasRef.current.toDataURL("image/png");
				setCapturedImage(dataUrl);
			}
		}
	};

	const handleRetake = () => {
		setCapturedImage(null);
		startStream();
	};

	const handleClose = (onClose: () => void) => {
		stopStream();
		setCapturedImage(null);
		onClose();
	};

	return {
		videoRef,
		canvasRef,
		capturedImage,
		handleCapture,
		handleRetake,
		handleClose,
		setCapturedImage,
	};
};
