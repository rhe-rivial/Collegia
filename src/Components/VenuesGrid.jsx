import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from './UserContext';
import VenuesCard from "./VenuesCard.jsx";
import "../styles/VenuesCard.css";


export default function VenuesGrid({ searchQuery, showFilters, filters, onOpenLoginModal }) {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const path = location.pathname.split("/").pop();
  const currentTag = path.toUpperCase() === "VENUES" || path === "" ? "NGE" : path.toUpperCase();

useEffect(() => {
  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/venues');
      
      if (response.ok) {
        const venuesData = await response.json();
        
        // DEDUPLICATE HERE - Add this critical step
        const uniqueVenues = [...new Map(venuesData.map(venue => [venue.venueId, venue])).values()];
        
        // Get favorites from localStorage for current user
        let favorites = [];
        if (user?.userId) {
          favorites = favoritesStorage.getFavorites(user.userId);
        }
        
        const venuesWithFavorites = uniqueVenues.map(venue => ({
          ...venue,
          isFavorite: favorites.includes(venue.venueId.toString())
        }));
        
        setVenues(venuesWithFavorites);
      } else {
        console.error('Failed to fetch venues, status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchVenues();
}, []); // Empty dependency array - runs only once

  // Handle favorite toggle using localStorage 
  const handleFavoriteToggle = (venueId) => {
    if (!user) {
      if (onOpenLoginModal) {
        onOpenLoginModal();
      }
      return;
    }

    const venueIdStr = venueId.toString();
    
    // Get current favorites for user
    const currentFavorites = favoritesStorage.getFavorites(user.userId);
    
    // Check if venue is currently favorite
    const isCurrentlyFavorite = currentFavorites.includes(venueIdStr);
    const newFavorites = isCurrentlyFavorite
      ? currentFavorites.filter(id => id !== venueIdStr)
      : [...currentFavorites, venueIdStr];
    
    // Save to localStorage
    favoritesStorage.saveFavorites(user.userId, newFavorites);
    
    // Update local state
    setVenues(prevVenues =>
      prevVenues.map(venue =>
        venue.venueId === venueId
          ? { ...venue, isFavorite: !venue.isFavorite }
          : venue
      )
    );
    
    // notify VenueDetails about the change
    window.dispatchEvent(new CustomEvent('favoritesUpdated', {
      detail: {
        userId: user.userId,
        venueId: venueIdStr,
        isFavorite: !isCurrentlyFavorite
      }
    }));
  };

  const knownAreas = ["NGE", "SAL", "GLE", "Court", "ACAD"];

  const filteredVenues = venues.filter((venue) => {
    // Only apply category filter when NOT searching and NOT showing filters
    console.log("VENUE:", venue.venueName, "| LOCATION:", `"${venue.venueLocation}"`);

    const loc = venue.venueLocation?.trim().toUpperCase() || "";
    const knownAreas = ["NGE", "SAL", "GLE", "COURT", "ACAD"];

    let categoryMatch = true;

    if (!searchQuery && !showFilters && currentTag !== "VENUES") {
      if (currentTag === "MORE") {
        categoryMatch = !knownAreas.includes(loc);
      } else {
        categoryMatch = loc === currentTag;
      }
    }

    // Search filter
    const searchMatch =
      !searchQuery ||
      venue.venueName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.venueLocation?.toLowerCase().includes(searchQuery.toLowerCase());

    // Capacity filter
    const capacityMatch =
      !filters.capacity || venue.venueCapacity >= parseInt(filters.capacity);

    let locationFilterMatch = true;

    if (filters.location && filters.location !== "More") {
      locationFilterMatch = loc === filters.location.toUpperCase();
    }

    if (filters.location === "More") {
      locationFilterMatch = !knownAreas.map(a => a.toUpperCase()).includes(loc);
    }

    return categoryMatch && searchMatch && capacityMatch && locationFilterMatch;
  });

  const venuesGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "60px",
    paddingTop: "40px",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    marginBottom: "100px",
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading venues...</p>
      </div>
    );
  }

  return (
    <>
      {(searchQuery || filters.capacity || filters.location) && (
        <div className="results-info">
          <p>
            Showing {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
            {filters.location && ` in ${filters.location}`}
            {filters.capacity && ` with ${filters.capacity}+ capacity`}
          </p>
        </div>
      )}

       <div style={venuesGridStyle}>
        {filteredVenues.length > 0 ? (
          filteredVenues.map((venue) => (
            <VenuesCard
              key={venue.venueId}
              id={venue.venueId}
              title={venue.venueName}
              image={venue.image || "/images/Dining-room.jpg"}
              isFavorite={venue.isFavorite || false}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))
        ) : (
          <div className="no-results">
            <p>
              {(!searchQuery && !showFilters)
                ? `No venues found for "${currentTag}"`
                : "No venues match your search or filters"}
            </p>
            {(searchQuery || filters.capacity || filters.location) && (
              <p>Try adjusting your search or filters</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}


// LocalStorage favorites manager
export const favoritesStorage = {
  // Get favorites for current user
  getFavorites: (userId) => {
    try {
      const key = `favorites_${userId}`;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error reading favorites from localStorage:', error);
      return [];
    }
  },

  // Save favorites for current user
  saveFavorites: (userId, favorites) => {
    try {
      const key = `favorites_${userId}`;
      localStorage.setItem(key, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  },

  // Toggle favorite for user
  toggleFavorite: (userId, venueId) => {
    try {
      const currentFavorites = favoritesStorage.getFavorites(userId);
      const venueIdStr = venueId.toString();
      
      let newFavorites;
      if (currentFavorites.includes(venueIdStr)) {
        newFavorites = currentFavorites.filter(id => id !== venueIdStr);
      } else {
        newFavorites = [...currentFavorites, venueIdStr];
      }
      
      favoritesStorage.saveFavorites(userId, newFavorites);
      
      // Return both new favorites and the state
      return {
        newFavorites,
        isFavorite: newFavorites.includes(venueIdStr)
      };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return {
        newFavorites: favoritesStorage.getFavorites(userId),
        isFavorite: false
      };
    }
  },

  // Check if venue is favorite for user
  isFavorite: (userId, venueId) => {
    try {
      const favorites = favoritesStorage.getFavorites(userId);
      return favorites.includes(venueId.toString());
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  }
};