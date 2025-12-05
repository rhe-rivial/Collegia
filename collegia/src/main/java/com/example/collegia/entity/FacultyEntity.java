package com.example.collegia.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@PrimaryKeyJoinColumn(name = "userId")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class FacultyEntity extends UserEntity{
    private String department;

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
