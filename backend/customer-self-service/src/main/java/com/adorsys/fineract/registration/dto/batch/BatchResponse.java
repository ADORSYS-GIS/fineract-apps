package main.java.com.adorsys.fineract.registration.dto.batch;

import java.util.List;
import lombok.Data;

@Data
public class BatchResponse {
    private Long requestId;
    private int statusCode;
    private List<Header> headers;
    private String body;

    @Data
    public static class Header {
        private String name;
        private String value;
    }
}
