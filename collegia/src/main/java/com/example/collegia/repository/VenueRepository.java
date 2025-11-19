package com.example.collegia.repository;

import com.example.collegia.entity.VenueEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VenueRepository extends JpaRepository<VenueEntity, Long> {
    List<VenueEntity> findByVenueLocationContaining(String location);
    List<VenueEntity> findByVenueCapacityGreaterThanEqual(int capacity);
    List<VenueEntity> findByVenueNameContaining(String name);
    List<VenueEntity> findByVenueLocationIgnoreCase(String location);
}