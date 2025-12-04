package com.example.collegia.controller;

import com.example.collegia.entity.VenueEntity;
import com.example.collegia.service.VenueService;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.collegia.repository.VenueRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/venues")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
public class VenueController {
    
    @Autowired
    private VenueService venueService;
    @Autowired
    private VenueRepository venueRepository;

    @GetMapping
    public List<VenueEntity> getAllVenues() {
        return venueService.getAllVenues();
    }

    @GetMapping("/custodian/{custodianId}")
    public List<VenueEntity> getVenuesByCustodian(@PathVariable Long custodianId) {
        return venueRepository.findByCustodianUserId(custodianId);
    }

    @GetMapping("/custodian/{custodianId}/venues")
    public List<VenueEntity> getCustodianVenues(@PathVariable Long custodianId) {
        return venueRepository.findByCustodianUserId(custodianId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VenueEntity> getVenueById(@PathVariable Long id) {
        Optional<VenueEntity> venue = venueService.getVenueById(id);
        return venue.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/location/{location}")
    public List<VenueEntity> getVenuesByLocation(@PathVariable String location) {
        return venueService.getVenuesByLocation(location);
    }
    
    @GetMapping("/capacity/{minCapacity}")
    public List<VenueEntity> getVenuesByCapacity(@PathVariable int minCapacity) {
        return venueService.getVenuesByCapacity(minCapacity);
    }
    
    @GetMapping("/search/{name}")
    public List<VenueEntity> searchVenuesByName(@PathVariable String name) {
        return venueService.searchVenuesByName(name);
    }
    
    @PostMapping
    public VenueEntity createVenue(@RequestBody VenueEntity venue) {
        return venueService.createVenue(venue);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<VenueEntity> updateVenue(@PathVariable Long id, @RequestBody VenueEntity venueDetails) {
        try {
            VenueEntity updatedVenue = venueService.updateVenue(id, venueDetails);
            return ResponseEntity.ok(updatedVenue);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVenue(@PathVariable Long id) {
        try {
            venueService.deleteVenue(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

}