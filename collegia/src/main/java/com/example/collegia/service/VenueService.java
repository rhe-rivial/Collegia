package com.example.collegia.service;

import com.example.collegia.entity.VenueEntity;
import com.example.collegia.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class VenueService {
    
    @Autowired
    private VenueRepository venueRepository;
    
    public List<VenueEntity> getAllVenues() {
        return venueRepository.findAll();
    }
    
    public Optional<VenueEntity> getVenueById(Long id) {
        return venueRepository.findById(id);
    }
    
    public VenueEntity createVenue(VenueEntity venue) {
        return venueRepository.save(venue);
    }
    
    public VenueEntity updateVenue(Long id, VenueEntity venueDetails) {
        VenueEntity venue = venueRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));
        
        venue.setVenueName(venueDetails.getVenueName());
        venue.setVenueLocation(venueDetails.getVenueLocation());
        venue.setVenueCapacity(venueDetails.getVenueCapacity());
        
        return venueRepository.save(venue);
    }
    
    public void deleteVenue(Long id) {
        VenueEntity venue = venueRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));
        venueRepository.delete(venue);
    }
    
    public List<VenueEntity> getVenuesByLocation(String location) {
        return venueRepository.findByVenueLocationIgnoreCase(location);
    }
    
    public List<VenueEntity> getVenuesByCapacity(int minCapacity) {
        return venueRepository.findByVenueCapacityGreaterThanEqual(minCapacity);
    }
    
    public List<VenueEntity> searchVenuesByName(String name) {
        return venueRepository.findByVenueNameContaining(name);
    }

    public List<VenueEntity> getVenuesByCustodian(Long custodianId) {
        return venueRepository.findByCustodianUserId(custodianId);
    }
}