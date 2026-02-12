package com.adorsys.fineract.registration.service;

import com.adorsys.fineract.registration.dto.*;
import com.adorsys.fineract.registration.exception.RegistrationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for KYC review operations by staff.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KycReviewService {

    private final KeycloakService keycloakService;
    private final FineractService fineractService;

    /**
     * Get statistics for KYC reviews.
     */
    public KycStatsResponse getStats() {
        // In production, these would come from a database
        // For now, we calculate from Keycloak users
        List<UserRepresentation> allUsers = keycloakService.getUsersByGroup("self-service-customers");

        long pendingCount = allUsers.stream()
            .filter(u -> "pending".equals(getKycStatus(u)))
            .count();

        long approvedToday = allUsers.stream()
            .filter(u -> "approved".equals(getKycStatus(u)))
            .filter(u -> isToday(getReviewedAt(u)))
            .count();

        long rejectedToday = allUsers.stream()
            .filter(u -> "rejected".equals(getKycStatus(u)))
            .filter(u -> isToday(getReviewedAt(u)))
            .count();

        return KycStatsResponse.builder()
            .pendingCount((int) pendingCount)
            .approvedToday((int) approvedToday)
            .rejectedToday((int) rejectedToday)
            .avgReviewTimeMinutes(15) // Placeholder
            .build();
    }

    /**
     * Get list of KYC submissions.
     */
    public KycSubmissionsResponse getSubmissions(String status, String search, int page, int limit) {
        List<UserRepresentation> allUsers = keycloakService.getUsersByGroup("self-service-customers");

        // Filter by status
        if (status != null && !status.isEmpty()) {
            allUsers = allUsers.stream()
                .filter(u -> status.equals(getKycStatus(u)))
                .collect(Collectors.toList());
        }

        // Filter by search
        if (search != null && !search.isEmpty()) {
            String searchLower = search.toLowerCase();
            allUsers = allUsers.stream()
                .filter(u -> matchesSearch(u, searchLower))
                .collect(Collectors.toList());
        }

        // Sort by creation date (most recent first)
        allUsers.sort((a, b) -> Long.compare(
            b.getCreatedTimestamp() != null ? b.getCreatedTimestamp() : 0,
            a.getCreatedTimestamp() != null ? a.getCreatedTimestamp() : 0
        ));

        // Paginate
        int total = allUsers.size();
        int start = (page - 1) * limit;
        int end = Math.min(start + limit, total);

        List<KycSubmissionSummary> items = allUsers.subList(
            Math.max(0, start),
            Math.max(0, end)
        ).stream()
            .map(this::toSummary)
            .collect(Collectors.toList());

        return KycSubmissionsResponse.builder()
            .items(items)
            .total(total)
            .page(page)
            .pageSize(limit)
            .build();
    }

    /**
     * Get a single KYC submission.
     */
    public KycSubmissionDetailResponse getSubmission(String externalId) {
        Optional<UserRepresentation> userOpt = keycloakService.getUserByExternalId(externalId);

        if (userOpt.isEmpty()) {
            throw new RegistrationException("NOT_FOUND", "Submission not found", "externalId");
        }

        UserRepresentation user = userOpt.get();
        Map<String, List<String>> attrs = user.getAttributes() != null
            ? user.getAttributes()
            : Collections.emptyMap();

        // Get documents from Fineract
        List<KycDocumentDto> documents = convertToDocumentDtos(
            fineractService.getClientDocumentsByExternalId(externalId)
        );

        return KycSubmissionDetailResponse.builder()
            .externalId(externalId)
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .phoneNumber(getAttr(attrs, "phone_number"))
            .dateOfBirth(getAttr(attrs, "date_of_birth"))
            .nationality(getAttr(attrs, "nationality"))
            .kycTier(getAttrInt(attrs, "kyc_tier", 1))
            .kycStatus(getAttr(attrs, "kyc_status", "pending"))
            .documents(documents)
            .submittedAt(user.getCreatedTimestamp() != null
                ? Instant.ofEpochMilli(user.getCreatedTimestamp()).toString()
                : null)
            .reviewedAt(getAttr(attrs, "kyc_reviewed_at"))
            .reviewedBy(getAttr(attrs, "kyc_reviewed_by"))
            .rejectionReason(getAttr(attrs, "kyc_rejection_reason"))
            .reviewNotes(getAttr(attrs, "kyc_review_notes"))
            .build();
    }

    /**
     * Approve a KYC submission.
     */
    public void approveKyc(String externalId, KycApprovalRequest request,
                           String reviewerId, String reviewerName) {
        Optional<UserRepresentation> userOpt = keycloakService.getUserByExternalId(externalId);

        if (userOpt.isEmpty()) {
            throw new RegistrationException("NOT_FOUND", "Submission not found", "externalId");
        }

        // Update Keycloak user attributes
        Map<String, List<String>> updates = new HashMap<>();
        updates.put("kyc_tier", List.of(String.valueOf(request.getNewTier())));
        updates.put("kyc_status", List.of("approved"));
        updates.put("kyc_reviewed_at", List.of(Instant.now().toString()));
        updates.put("kyc_reviewed_by", List.of(reviewerName));
        if (request.getNotes() != null) {
            updates.put("kyc_review_notes", List.of(request.getNotes()));
        }

        keycloakService.updateUserAttributes(userOpt.get().getId(), updates);

        log.info("KYC approved: externalId={}, newTier={}", externalId, request.getNewTier());

    }

    /**
     * Reject a KYC submission.
     */
    public void rejectKyc(String externalId, KycRejectionRequest request,
                          String reviewerId, String reviewerName) {
        Optional<UserRepresentation> userOpt = keycloakService.getUserByExternalId(externalId);

        if (userOpt.isEmpty()) {
            throw new RegistrationException("NOT_FOUND", "Submission not found", "externalId");
        }

        // Update Keycloak user attributes
        Map<String, List<String>> updates = new HashMap<>();
        updates.put("kyc_status", List.of("rejected"));
        updates.put("kyc_rejection_reason", List.of(request.getReason()));
        updates.put("kyc_reviewed_at", List.of(Instant.now().toString()));
        updates.put("kyc_reviewed_by", List.of(reviewerName));
        if (request.getNotes() != null) {
            updates.put("kyc_review_notes", List.of(request.getNotes()));
        }

        keycloakService.updateUserAttributes(userOpt.get().getId(), updates);

        log.info("KYC rejected: externalId={}, reason={}", externalId, request.getReason());
    }

    /**
     * Request more information from customer.
     */
    public void requestMoreInfo(String externalId, KycRequestInfoRequest request, String reviewerId) {
        Optional<UserRepresentation> userOpt = keycloakService.getUserByExternalId(externalId);

        if (userOpt.isEmpty()) {
            throw new RegistrationException("NOT_FOUND", "Submission not found", "externalId");
        }

        Map<String, List<String>> updates = new HashMap<>();
        updates.put("kyc_status", List.of("more_info_required"));
        updates.put("kyc_info_request", List.of(request.getMessage()));
        updates.put("kyc_info_requested_at", List.of(Instant.now().toString()));

        keycloakService.updateUserAttributes(userOpt.get().getId(), updates);

        log.info("More info requested: externalId={}", externalId);

        // TODO: Send email notification to customer
    }

    private KycSubmissionSummary toSummary(UserRepresentation user) {
        Map<String, List<String>> attrs = user.getAttributes() != null
            ? user.getAttributes()
            : Collections.emptyMap();

        return KycSubmissionSummary.builder()
            .externalId(getAttr(attrs, "fineract_external_id"))
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .phoneNumber(getAttr(attrs, "phone_number"))
            .kycTier(getAttrInt(attrs, "kyc_tier", 1))
            .kycStatus(getAttr(attrs, "kyc_status", "pending"))
            .submittedAt(user.getCreatedTimestamp() != null
                ? Instant.ofEpochMilli(user.getCreatedTimestamp()).toString()
                : null)
            .build();
    }

    private boolean matchesSearch(UserRepresentation user, String search) {
        if (user.getFirstName() != null && user.getFirstName().toLowerCase().contains(search)) {
            return true;
        }
        if (user.getLastName() != null && user.getLastName().toLowerCase().contains(search)) {
            return true;
        }
        if (user.getEmail() != null && user.getEmail().toLowerCase().contains(search)) {
            return true;
        }
        Map<String, List<String>> attrs = user.getAttributes();
        if (attrs != null) {
            String externalId = getAttr(attrs, "fineract_external_id");
            if (externalId != null && externalId.toLowerCase().contains(search)) {
                return true;
            }
        }
        return false;
    }

    private String getKycStatus(UserRepresentation user) {
        if (user.getAttributes() == null) return "pending";
        return getAttr(user.getAttributes(), "kyc_status", "pending");
    }

    private String getReviewedAt(UserRepresentation user) {
        if (user.getAttributes() == null) return null;
        return getAttr(user.getAttributes(), "kyc_reviewed_at");
    }

    private boolean isToday(String timestamp) {
        if (timestamp == null) return false;
        try {
            Instant instant = Instant.parse(timestamp);
            Instant today = Instant.now().truncatedTo(java.time.temporal.ChronoUnit.DAYS);
            return instant.isAfter(today);
        } catch (Exception e) {
            return false;
        }
    }

    private String getAttr(Map<String, List<String>> attrs, String key) {
        return getAttr(attrs, key, null);
    }

    private String getAttr(Map<String, List<String>> attrs, String key, String defaultValue) {
        if (attrs == null || !attrs.containsKey(key)) return defaultValue;
        List<String> values = attrs.get(key);
        if (values == null || values.isEmpty()) return defaultValue;
        return values.get(0);
    }

    private int getAttrInt(Map<String, List<String>> attrs, String key, int defaultValue) {
        String value = getAttr(attrs, key);
        if (value == null) return defaultValue;
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    private List<KycDocumentDto> convertToDocumentDtos(List<Map<String, Object>> documents) {
        return documents.stream()
            .map(doc -> KycDocumentDto.builder()
                .id(String.valueOf(doc.get("id")))
                .type(String.valueOf(doc.getOrDefault("type", "document")))
                .fileName(String.valueOf(doc.getOrDefault("name", "Unknown")))
                .mimeType(String.valueOf(doc.getOrDefault("type", "application/octet-stream")))
                .url(buildDocumentUrl(doc))
                .uploadedAt(String.valueOf(doc.getOrDefault("createdDate", "")))
                .build())
            .collect(Collectors.toList());
    }

    private String buildDocumentUrl(Map<String, Object> doc) {
        // Build the URL to download the document from Fineract
        Object parentEntityId = doc.get("parentEntityId");
        Object id = doc.get("id");
        return String.format("/api/v1/clients/%s/documents/%s/attachment", parentEntityId, id);
    }
}
