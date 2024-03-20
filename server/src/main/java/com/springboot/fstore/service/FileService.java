package com.springboot.fstore.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    String uploadFile(MultipartFile file);
    byte[] downloadFile(String fileName);
    String deleteFile(String fileName);

}
