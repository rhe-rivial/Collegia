package com.example.collegia.repository;

import com.example.collegia.entity.AdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<AdminEntity, Long> {
    AdminEntity findByUserId(Long userId);
}
