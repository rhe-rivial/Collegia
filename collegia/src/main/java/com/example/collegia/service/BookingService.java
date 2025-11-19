package com.example.collegia.service;

import com.example.collegia.entity.BookingEntity;
import com.example.collegia.entity.UserEntity;
import com.example.collegia.entity.VenueEntity;
import com.example.collegia.repository.BookingRepository;
import com.example.collegia.repository.UserRepository;
import com.example.collegia.repository.VenueRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
        
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private VenueRepository venueRepository;

       public BookingEntity createBooking(BookingEntity booking, Long userId) {
        // Fetch and set user
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        booking.setUser(user);
        
        // Fetch and set venue
        VenueEntity venue = venueRepository.findById(booking.getVenue().getVenueId())
            .orElseThrow(() -> new RuntimeException("Venue not found"));
        booking.setVenue(venue);
        
        // Set default status
        booking.setStatus(false); // pending
        
        return bookingRepository.save(booking);
    }
    
    public List<BookingEntity> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserUserId(userId);
    }
    
    
    public List<BookingEntity> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public Optional<BookingEntity> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }
    
    public BookingEntity createBooking(BookingEntity booking) {
        return bookingRepository.save(booking);
    }
    
    public BookingEntity updateBooking(Long id, BookingEntity bookingDetails) {
        BookingEntity booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        
        booking.setEventName(bookingDetails.getEventName());
        booking.setDate(bookingDetails.getDate());
        booking.setTimeSlot(bookingDetails.getTimeSlot());
        booking.setCapacity(bookingDetails.getCapacity());
        booking.setStatus(bookingDetails.isStatus());
        
        return bookingRepository.save(booking);
    }
    
    public void deleteBooking(Long id) {
        BookingEntity booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        bookingRepository.delete(booking);
    }
    
    public List<BookingEntity> getBookingsByVenue(Long venueId) {
        return bookingRepository.findByVenueVenueId(venueId);
    }
    
    public List<BookingEntity> getBookingsByDate(Date date) {
        return bookingRepository.findByDate(date);
    }
    
    public List<BookingEntity> getBookingsByStatus(boolean status) {
        return bookingRepository.findByStatus(status);
    }
    
    public boolean isVenueAvailable(Long venueId, Date date) {
        List<BookingEntity> bookings = bookingRepository.findByDateAndVenueVenueId(date, venueId);
        return bookings.isEmpty();
    }
}