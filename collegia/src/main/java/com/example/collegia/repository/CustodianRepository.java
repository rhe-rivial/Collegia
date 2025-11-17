package com.example.collegia.repository;

import com.example.collegia.entity.CustodianEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CustodianRepository extends JpaRepository<CustodianEntity, Long> {
    List<CustodianEntity> findByDepartment(String department);
    List<CustodianEntity> findByEmail(String email);
}