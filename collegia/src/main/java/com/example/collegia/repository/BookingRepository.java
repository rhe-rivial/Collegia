
package com.example.collegia.repository;

import com.example.collegia.entity.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Date;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, Long> {
    List<BookingEntity> findByVenueVenueId(Long venueId);
    List<BookingEntity> findByDate(Date date);
    List<BookingEntity> findByStatus(boolean status);
    List<BookingEntity> findByDateAndVenueVenueId(Date date, Long venueId);
    List<BookingEntity> findByUserUserId(Long userId); 
}