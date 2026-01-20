import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import { Upload, X, Camera, FileText, Check, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/kyc/upload")({
  component: KycUploadPage,
});

type DocumentType = "id_front" | "id_back" | "selfie_with_id";

interface UploadedFile {
  type: DocumentType;
  file: File;
  preview: string;
}

function KycUploadPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeUpload, setActiveUpload] = useState<DocumentType | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentTypes: { type: DocumentType; icon: React.ReactNode }[] = [
    { type: "id_front", icon: <FileText className="w-6 h-6" /> },
    { type: "id_back", icon: <FileText className="w-6 h-6" /> },
    { type: "selfie_with_id", icon: <Camera className="w-6 h-6" /> },
  ];

  const handleFileSelect = (type: DocumentType) => {
    setActiveUpload(type);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUpload) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const newFile: UploadedFile = {
        type: activeUpload,
        file,
        preview: reader.result as string,
      };

      setUploadedFiles((prev) => {
        // Remove existing file of same type
        const filtered = prev.filter((f) => f.type !== activeUpload);
        return [...filtered, newFile];
      });
      setError(null);
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = "";
    setActiveUpload(null);
  };

  const removeFile = (type: DocumentType) => {
    setUploadedFiles((prev) => prev.filter((f) => f.type !== type));
  };

  const getUploadedFile = (type: DocumentType) => {
    return uploadedFiles.find((f) => f.type === type);
  };

  const handleSubmit = async () => {
    if (uploadedFiles.length !== 3) {
      setError("Please upload all required documents");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append(file.type, file.file);
      });

      // In a real app, this would call the KYC upload API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (err) {
      setError(t("errors.generic"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Documents Submitted
          </h2>
          <p className="text-gray-500 mb-6">
            Your documents are being reviewed. This usually takes 1-2 business days.
          </p>
          <a href="/self-service/kyc" className="btn-primary inline-block">
            {t("common.back")} to KYC Status
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate({ to: "/kyc" })}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("kyc.upload")}</h1>
          <p className="text-gray-500 mt-1">Upload your documents to verify your identity</p>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Document Upload Cards */}
      <div className="space-y-4">
        {documentTypes.map(({ type, icon }) => {
          const uploaded = getUploadedFile(type);
          return (
            <div key={type} className="card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                  {icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {t(`kyc.documents.${type}`)}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{t("kyc.maxSize")}</p>

                  {uploaded ? (
                    <div className="mt-4 relative">
                      <img
                        src={uploaded.preview}
                        alt={type}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeFile(type)}
                        className="absolute top-2 right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleFileSelect(type)}
                      className="mt-4 w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">{t("kyc.uploadHint")}</p>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Upload Progress</span>
          <span className="text-sm font-medium text-gray-900">
            {uploadedFiles.length} / 3 documents
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(uploadedFiles.length / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="btn-primary w-full py-3 text-lg"
        disabled={isSubmitting || uploadedFiles.length !== 3}
      >
        {isSubmitting ? t("common.loading") : t("common.submit")}
      </button>
    </div>
  );
}
