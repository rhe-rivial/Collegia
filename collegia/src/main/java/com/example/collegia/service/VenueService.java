package com.example.collegia.service;

import com.example.collegia.entity.VenueEntity;
import com.example.collegia.dto.VenueDTO;
import com.example.collegia.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VenueService {
    
    @Autowired
    private VenueRepository venueRepository;
    
    public List<VenueEntity> getAllVenues() {
        return venueRepository.findAll();
    }
    
    public List<VenueDTO> getAllVenuesAsDTO() {
        List<VenueEntity> venues = venueRepository.findAll();
        return venues.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public Optional<VenueEntity> getVenueById(Long id) {
        return venueRepository.findById(id);
    }
    
    public Optional<VenueDTO> getVenueByIdAsDTO(Long id) {
        return venueRepository.findById(id)
            .map(this::convertToDTO);
    }
    
    private VenueDTO convertToDTO(VenueEntity venue) {
        VenueDTO dto = new VenueDTO();
        dto.setVenueId(venue.getVenueId());
        dto.setVenueName(venue.getVenueName());
        dto.setVenueLocation(venue.getVenueLocation());
        dto.setVenueCapacity(venue.getVenueCapacity());
        dto.setImage(venue.getImage());
        dto.setDescription(venue.getDescription());
        dto.setAmenities(venue.getAmenities());
        dto.setGalleryImages(venue.getGalleryImages());
        
        if (venue.getCustodian() != null) {
            dto.setCustodianId(venue.getCustodian().getUserId());
            dto.setCustodianName(venue.getCustodian().getName());
        }
        
        return dto;
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