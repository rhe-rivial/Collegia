package com.example.collegia.entity;

import jakarta.persistence.*;

@Entity
@PrimaryKeyJoinColumn(name = "userId")
public class CoordinatorEntity extends UserEntity{
    private String affiliation;

    public String getAffiliation() {
        return affiliation;
    }

    public void setAffiliation(String affiliation) {
        this.affiliation = affiliation;
    }
}
