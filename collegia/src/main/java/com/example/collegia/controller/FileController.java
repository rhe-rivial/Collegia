package com.example.collegia.controller;

import com.example.collegia.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000")
public class FileController {
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @GetMapping("/uploads/{fileName:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String fileName, 
                                             HttpServletRequest request) {
        try {
            // Get the file path
            Path filePath = fileStorageService.getFileStorageLocation().resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            // Check if file exists
            if (!resource.exists()) {
                System.out.println("❌ File not found: " + fileName);
                return ResponseEntity.notFound().build();
            }
            
            // Try to determine file's content type
            String contentType = null;
            try {
                contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            } catch (IOException ex) {
                System.out.println("⚠️ Could not determine file type for: " + fileName);
            }
            
            // Fallback to default content type
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            System.out.println("✅ Serving file: " + fileName + " with content-type: " + contentType);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(resource);
                    
        } catch (Exception e) {
            System.err.println("❌ Error serving file: " + fileName);
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
}