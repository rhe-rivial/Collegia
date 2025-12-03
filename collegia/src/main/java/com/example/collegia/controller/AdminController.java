package com.example.collegia.controller;

import com.example.collegia.entity.AdminEntity;
import com.example.collegia.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/create")
    public AdminEntity createAdmin(@RequestBody AdminEntity adminEntity) {
        return adminService.createAdmin(adminEntity);
    }

    @GetMapping("/{userId}")
    public AdminEntity getAdmin(@PathVariable Long userId) {
        return adminService.getAdminById(userId);
    }

    @GetMapping("/all")
    public List<AdminEntity> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    @PutMapping("/update/{userId}")
    public AdminEntity updateAdmin(@PathVariable Long userId, @RequestBody AdminEntity adminEntity) {
        return adminService.updateAdmin(userId, adminEntity);
    }

    @DeleteMapping("/delete/{userId}")
    public String deleteAdmin(@PathVariable Long userId) {
        adminService.deleteAdmin(userId);
        return "Admin removed successfully!";
    }
}
