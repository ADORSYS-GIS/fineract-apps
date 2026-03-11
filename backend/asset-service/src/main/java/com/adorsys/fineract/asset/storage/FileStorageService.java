package com.adorsys.fineract.asset.storage;

import java.io.InputStream;

public interface FileStorageService {

    /**
     * Upload a file to storage.
     *
     * @param folder        logical grouping (e.g., "assets/icons")
     * @param fileName      original file name
     * @param content       file input stream
     * @param contentLength file size in bytes
     * @param contentType   MIME type (e.g., "image/png")
     * @return the storage key (relative path within the bucket)
     */
    String upload(String folder, String fileName, InputStream content, long contentLength, String contentType);

    /**
     * Delete a file by its storage key.
     */
    void delete(String key);

    /**
     * Build the publicly accessible URL for a given storage key.
     */
    String getPublicUrl(String key);
}
