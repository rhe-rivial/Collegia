package com.example.collegia.service;

import com.example.collegia.entity.AdminEntity;
import com.example.collegia.repository.AdminRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public AdminEntity createAdmin(AdminEntity adminEntity) {
        return adminRepository.save(adminEntity);
    }

    public AdminEntity getAdminById(Long userId) {
        return adminRepository.findById(userId).orElse(null);
    }

    public List<AdminEntity> getAllAdmins() {
        return adminRepository.findAll();
    }

    public AdminEntity updateAdmin(Long userId, AdminEntity adminData) {
        AdminEntity existing = adminRepository.findById(userId).orElse(null);

        if (existing != null) {
            existing.setAdminCode(adminData.getAdminCode());
            return adminRepository.save(existing);
        }

        return null;
    }

    public void deleteAdmin(Long userId) {
        adminRepository.deleteById(userId);
    }
}
