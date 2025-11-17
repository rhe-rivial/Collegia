package com.example.collegia.entity;

import jakarta.persistence.*;

@Entity
@PrimaryKeyJoinColumn(name = "userId")
public class StudentEntity extends UserEntity{
    private String course;
    private String organization;

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }
}