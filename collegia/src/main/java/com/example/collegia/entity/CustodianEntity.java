package com.example.collegia.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@PrimaryKeyJoinColumn(name = "userId")
public class CustodianEntity extends UserEntity {

    private String department;

    @OneToMany(mappedBy = "custodian", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VenueEntity> venues;

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getName() {
        return getFirstName() + " " + getLastName();
    }

    public List<VenueEntity> getVenues() {
        return venues;
    }

    public void setVenues(List<VenueEntity> venues) {
        this.venues = venues;
    }
}
