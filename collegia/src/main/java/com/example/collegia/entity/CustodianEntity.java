package com.example.collegia.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class CustodianEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long custodianId;
    private String firstName;
    private String lastName;
    private String department;
    private String email;

    @OneToMany(mappedBy = "custodian", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VenueEntity> venueList;

    public Long getCustodianId() {
        return custodianId;
    }

    public void setCustodianId(Long custodianId) {
        this.custodianId = custodianId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
