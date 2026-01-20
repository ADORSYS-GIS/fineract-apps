import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button, Card } from "@fineract-apps/ui";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useKycSubmission,
  useApproveKyc,
  useRejectKyc,
  useRequestKycInfo,
} from "@/hooks/useKycReviews";
import { ApprovalModal } from "./components/ApprovalModal";
import { RejectionModal } from "./components/RejectionModal";
import { RequestInfoModal } from "./components/RequestInfoModal";

interface KycReviewDetailProps {
  externalId: string;
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();

  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    info_requested: "bg-blue-100 text-blue-800",
  };

  const statusLabels: Record<string, string> = {
    pending: t("kycReviews.pending"),
    approved: t("kycReviews.approved"),
    rejected: t("kycReviews.rejected"),
    info_requested: t("kycReviews.infoRequested"),
  };

  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}
    >
      {statusLabels[status] || status}
    </span>
  );
}

export function KycReviewDetail({ externalId }: KycReviewDetailProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);

  const { data: submission, isLoading } = useKycSubmission(externalId);
  const approveMutation = useApproveKyc();
  const rejectMutation = useRejectKyc();
  const requestInfoMutation = useRequestKycInfo();

  const handleApprove = async (newTier: number, notes?: string) => {
    try {
      await approveMutation.mutateAsync({
        externalId,
        request: { newTier, notes },
      });
      toast.success(t("kycReviews.toast.approveSuccess"));
      setShowApprovalModal(false);
      navigate({ to: "/kyc-reviews" });
    } catch {
      toast.error(t("kycReviews.toast.error"));
    }
  };

  const handleReject = async (reason: string, notes?: string) => {
    try {
      await rejectMutation.mutateAsync({
        externalId,
        request: { reason, notes },
      });
      toast.success(t("kycReviews.toast.rejectSuccess"));
      setShowRejectionModal(false);
      navigate({ to: "/kyc-reviews" });
    } catch {
      toast.error(t("kycReviews.toast.error"));
    }
  };

  const handleRequestInfo = async (message: string) => {
    try {
      await requestInfoMutation.mutateAsync({
        externalId,
        request: { message },
      });
      toast.success(t("kycReviews.toast.requestInfoSuccess"));
      setShowRequestInfoModal(false);
    } catch {
      toast.error(t("kycReviews.toast.error"));
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">{t("kycReviews.loading")}</div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">Submission not found</div>
      </div>
    );
  }

  const isPending = submission.kycStatus === "pending";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate({ to: "/kyc-reviews" })}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t("kycReviews.back")}
          </Button>
          <h1 className="text-2xl font-bold">{t("kycReviews.submissionDetails")}</h1>
        </div>
        {isPending && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowRequestInfoModal(true)}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              {t("kycReviews.requestInfo")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowRejectionModal(true)}
            >
              <XCircle className="w-4 h-4 mr-1" />
              {t("kycReviews.reject")}
            </Button>
            <Button onClick={() => setShowApprovalModal(true)}>
              <CheckCircle className="w-4 h-4 mr-1" />
              {t("kycReviews.approve")}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card>
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">{t("kycReviews.customerInfo")}</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">{t("kycReviews.firstName")}</label>
                <p className="font-medium">{submission.firstName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">{t("kycReviews.lastName")}</label>
                <p className="font-medium">{submission.lastName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">{t("kycReviews.email")}</label>
                <p className="font-medium">{submission.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">{t("kycReviews.phone")}</label>
                <p className="font-medium">{submission.phoneNumber || "-"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">{t("kycReviews.dateOfBirth")}</label>
                <p className="font-medium">
                  {submission.dateOfBirth
                    ? new Date(submission.dateOfBirth).toLocaleDateString()
                    : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">{t("kycReviews.nationality")}</label>
                <p className="font-medium">{submission.nationality || "-"}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">{t("kycReviews.currentTier")}</label>
                  <p className="font-medium">
                    <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                      Tier {submission.kycTier}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">{t("kycReviews.kycStatus")}</label>
                  <p className="mt-1">
                    <StatusBadge status={submission.kycStatus} />
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">{t("kycReviews.submittedAt")}</label>
                  <p className="font-medium">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                </div>
                {submission.reviewedAt && (
                  <div>
                    <label className="text-sm text-gray-500">Reviewed At</label>
                    <p className="font-medium">
                      {new Date(submission.reviewedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {submission.rejectionReason && (
              <div className="pt-4 border-t">
                <label className="text-sm text-gray-500">Rejection Reason</label>
                <p className="font-medium text-red-600">{submission.rejectionReason}</p>
                {submission.reviewNotes && (
                  <>
                    <label className="text-sm text-gray-500 mt-2 block">Review Notes</label>
                    <p className="text-gray-700">{submission.reviewNotes}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Documents */}
        <Card>
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">{t("kycReviews.documents")}</h2>
          </div>
          <div className="p-4">
            {submission.documents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {t("kycReviews.noDocuments")}
              </p>
            ) : (
              <div className="space-y-3">
                {submission.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-gray-400" />
                      <div>
                        <p className="font-medium">{doc.fileName}</p>
                        <p className="text-sm text-gray-500">
                          {doc.type} - {doc.mimeType}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(doc.uploadedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(doc.url, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = doc.url;
                          link.download = doc.fileName;
                          link.click();
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Modals */}
      <ApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onConfirm={handleApprove}
        isLoading={approveMutation.isPending}
        currentTier={submission.kycTier}
      />

      <RejectionModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onConfirm={handleReject}
        isLoading={rejectMutation.isPending}
      />

      <RequestInfoModal
        isOpen={showRequestInfoModal}
        onClose={() => setShowRequestInfoModal(false)}
        onConfirm={handleRequestInfo}
        isLoading={requestInfoMutation.isPending}
      />
    </div>
  );
}
