package com.adorsys.fineract.asset.storage;

import com.adorsys.fineract.asset.exception.AssetException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.ByteArrayInputStream;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class S3FileStorageServiceTest {

    @Mock
    private S3Client s3Client;

    private StorageProperties properties;
    private S3FileStorageService service;

    @BeforeEach
    void setUp() {
        properties = new StorageProperties();
        properties.setBucket("test-bucket");
        properties.setPublicBaseUrl("http://localhost:9000/test-bucket");
        properties.setMaxFileSize(5 * 1024 * 1024);
        properties.setAllowedContentTypes(Set.of("image/jpeg", "image/png", "image/webp", "image/svg+xml"));
        service = new S3FileStorageService(s3Client, properties);
    }

    @Test
    void upload_shouldPutObjectAndReturnKey() {
        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
                .thenReturn(PutObjectResponse.builder().build());

        // PNG magic bytes: \x89PNG\r\n\x1a\n
        byte[] content = new byte[]{(byte)0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00};
        String key = service.upload("assets/icons", "logo.png",
                new ByteArrayInputStream(content), content.length, "image/png");

        assertThat(key).startsWith("assets/icons/").endsWith("-logo.png");

        ArgumentCaptor<PutObjectRequest> captor = ArgumentCaptor.forClass(PutObjectRequest.class);
        verify(s3Client).putObject(captor.capture(), any(RequestBody.class));
        assertThat(captor.getValue().bucket()).isEqualTo("test-bucket");
        assertThat(captor.getValue().contentType()).isEqualTo("image/png");
    }

    @Test
    void upload_shouldSanitizeFileName() {
        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
                .thenReturn(PutObjectResponse.builder().build());

        byte[] content = new byte[]{(byte)0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00};
        String key = service.upload("icons", "my file (1).png",
                new ByteArrayInputStream(content), content.length, "image/png");

        assertThat(key).contains("my_file__1_.png");
    }

    @Test
    void upload_shouldRejectExcessiveFileSize() {
        properties.setMaxFileSize(100);
        byte[] content = new byte[200];

        assertThatThrownBy(() -> service.upload("icons", "big.png",
                new ByteArrayInputStream(content), content.length, "image/png"))
                .isInstanceOf(AssetException.class)
                .hasMessageContaining("exceeds maximum");

        verifyNoInteractions(s3Client);
    }

    @Test
    void upload_shouldRejectDisallowedContentType() {
        byte[] content = "data".getBytes();

        assertThatThrownBy(() -> service.upload("icons", "doc.pdf",
                new ByteArrayInputStream(content), content.length, "application/pdf"))
                .isInstanceOf(AssetException.class)
                .hasMessageContaining("not allowed");

        verifyNoInteractions(s3Client);
    }

    @Test
    void delete_shouldCallS3DeleteObject() {
        service.delete("assets/icons/abc-logo.png");

        ArgumentCaptor<DeleteObjectRequest> captor = ArgumentCaptor.forClass(DeleteObjectRequest.class);
        verify(s3Client).deleteObject(captor.capture());
        assertThat(captor.getValue().bucket()).isEqualTo("test-bucket");
        assertThat(captor.getValue().key()).isEqualTo("assets/icons/abc-logo.png");
    }

    @Test
    void delete_shouldNotThrowOnFailure() {
        doThrow(new RuntimeException("S3 error")).when(s3Client).deleteObject(any(DeleteObjectRequest.class));

        assertThatCode(() -> service.delete("assets/icons/abc-logo.png"))
                .doesNotThrowAnyException();
    }

    @Test
    void getPublicUrl_shouldBuildUrlFromBaseAndKey() {
        String url = service.getPublicUrl("assets/icons/abc-logo.png");
        assertThat(url).isEqualTo("http://localhost:9000/test-bucket/assets/icons/abc-logo.png");
    }

    @Test
    void getPublicUrl_shouldHandleTrailingSlash() {
        properties.setPublicBaseUrl("http://localhost:9000/test-bucket/");
        String url = service.getPublicUrl("assets/icons/abc-logo.png");
        assertThat(url).isEqualTo("http://localhost:9000/test-bucket/assets/icons/abc-logo.png");
    }

    @Test
    void getPublicUrl_shouldReturnKeyWhenNoBaseUrl() {
        properties.setPublicBaseUrl("");
        String url = service.getPublicUrl("assets/icons/abc-logo.png");
        assertThat(url).isEqualTo("assets/icons/abc-logo.png");
    }
}
