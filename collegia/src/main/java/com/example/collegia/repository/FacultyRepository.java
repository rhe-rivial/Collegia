package com.example.collegia.repository;

import com.example.collegia.entity.FacultyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FacultyRepository extends JpaRepository<FacultyEntity, Long> {
    List<FacultyEntity> findByDepartment(String department);
}