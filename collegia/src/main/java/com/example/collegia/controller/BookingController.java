package com.example.collegia.controller;

import com.example.collegia.entity.BookingEntity;
import com.example.collegia.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    @GetMapping
    public List<BookingEntity> getAllBookings() {
        return bookingService.getAllBookings();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BookingEntity> getBookingById(@PathVariable Long id) {
        Optional<BookingEntity> booking = bookingService.getBookingById(id);
        return booking.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/venue/{venueId}")
    public List<BookingEntity> getBookingsByVenue(@PathVariable Long venueId) {
        return bookingService.getBookingsByVenue(venueId);
    }
    
    @GetMapping("/date/{date}")
    public List<BookingEntity> getBookingsByDate(@PathVariable Date date) {
        return bookingService.getBookingsByDate(date);
    }
    
    @GetMapping("/status/{status}")
    public List<BookingEntity> getBookingsByStatus(@PathVariable boolean status) {
        return bookingService.getBookingsByStatus(status);
    }
    
    @GetMapping("/availability/{venueId}/{date}")
    public boolean checkVenueAvailability(@PathVariable Long venueId, @PathVariable Date date) {
        return bookingService.isVenueAvailable(venueId, date);
    }
    
    @PostMapping
    public BookingEntity createBooking(@RequestBody BookingEntity booking) {
        return bookingService.createBooking(booking);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<BookingEntity> updateBooking(@PathVariable Long id, @RequestBody BookingEntity bookingDetails) {
        try {
            BookingEntity updatedBooking = bookingService.updateBooking(id, bookingDetails);
            return ResponseEntity.ok(updatedBooking);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}