package com.adorsys.fineract.registration.dto.batch;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BatchRequest {
    private Long requestId;
    private String method;
    private String relativeUrl;
    private List<Header> headers;
    private String body;
    private Long reference;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Header {
        private String name;
        private String value;
    }
}
