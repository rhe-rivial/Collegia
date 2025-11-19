    package com.example.collegia.entity;

import jakarta.persistence.*;

import java.sql.Time;
import java.util.Date;

@Entity
public class BookingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;
    private String eventName;
    private Date date;
    private Time timeSlot;
    private boolean status;
    private int capacity;

    @ManyToOne
    @JoinColumn(name = "custodianID")
    private CustodianEntity custodian;

    @ManyToOne
    @JoinColumn(name = "venueID")
    private VenueEntity venue;

    public Long getBookingId() {
        return bookingId;
    }


    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Time getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(Time timeSlot) {
        this.timeSlot = timeSlot;
    }

    public CustodianEntity getCustodian() {
        return custodian;
    }

    public void setCustodian(CustodianEntity custodian) {
        this.custodian = custodian;
    }

    public VenueEntity getVenue() {
        return venue;
    }

    public void setVenue(VenueEntity venue) {
        this.venue = venue;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }
}
