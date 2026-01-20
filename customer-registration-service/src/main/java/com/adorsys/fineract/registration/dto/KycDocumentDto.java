package com.adorsys.fineract.registration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycDocumentDto {
    private String id;
    private String type;
    private String fileName;
    private String mimeType;
    private String url;
    private String uploadedAt;
}
