package com.adorsys.fineract.registration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycDocumentUploadResponse {

    /**
     * Fineract document ID
     */
    private String documentId;

    /**
     * Type of document uploaded (id_front, id_back, selfie_with_id)
     */
    private String documentType;

    /**
     * Upload status
     */
    private String status;

    /**
     * Timestamp of when the document was uploaded
     */
    private Instant uploadedAt;

    /**
     * Original file name
     */
    private String fileName;

    /**
     * MIME type of the uploaded file
     */
    private String mimeType;
}
