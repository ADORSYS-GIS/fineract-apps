package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.storage.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/admin/files")
@RequiredArgsConstructor
@PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
@Tag(name = "Admin - File Upload", description = "Upload files to object storage")
public class FileUploadController {

    private static final Set<String> ALLOWED_FOLDERS = Set.of(
            "assets/icons", "assets/images", "assets/documents");

    private final FileStorageService fileStorageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a file", description = "Uploads a file to S3/MinIO and returns the storage key and public URL")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "assets/icons") String folder
    ) throws IOException {
        if (!ALLOWED_FOLDERS.contains(folder)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid folder. Allowed: " + ALLOWED_FOLDERS));
        }

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
