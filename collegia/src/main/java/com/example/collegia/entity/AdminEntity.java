package com.example.collegia.entity;

import jakarta.persistence.*;

@Entity
@PrimaryKeyJoinColumn(name = "userId")
public class AdminEntity extends UserEntity {

    private String adminCode;

    public AdminEntity() {}

    public AdminEntity(String adminCode) {
        this.adminCode = adminCode;
    }

    public String getAdminCode() {
        return adminCode;
    }

    public void setAdminCode(String adminCode) {
        this.adminCode = adminCode;
    }
}
