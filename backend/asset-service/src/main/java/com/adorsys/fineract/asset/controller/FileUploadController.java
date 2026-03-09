package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.storage.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/admin/files")
@RequiredArgsConstructor
@Tag(name = "Admin - File Upload", description = "Upload files to object storage")
public class FileUploadController {

    private final FileStorageService fileStorageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a file", description = "Uploads a file to S3/MinIO and returns the storage key and public URL")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "assets/icons") String folder
    ) throws IOException {
        String key = fileStorageService.upload(
                folder,
                file.getOriginalFilename(),
                file.getInputStream(),
                file.getSize(),
                file.getContentType()
        );
        String url = fileStorageService.getPublicUrl(key);
        return ResponseEntity.ok(Map.of("key", key, "url", url));
    }
}
