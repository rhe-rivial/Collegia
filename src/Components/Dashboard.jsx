import "../styles/Dashboard.css"; 
import SearchBar from "./SearchBar.jsx";
import VenuesGrid from "./VenuesGrid.jsx";
import Navigation from "./Navigation.jsx"; 
import VenueDetails from "./VenueDetails.jsx"; 
import Bookings from "./Bookings.jsx"; 
import BookingForm from "./BookingForm.jsx";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    capacity: "",
    location: ""
  });

  return (
    <>
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterToggle={() => setShowFilters(!showFilters)}
      />
      <Navigation 
        searchQuery={searchQuery}
        filters={filters}
        showFilters={showFilters}
        onFiltersChange={setFilters}
        onFilterToggle={() => setShowFilters(!showFilters)}
      />

        <Routes>
        {/* Default page: /venues */}
        <Route index element={
          <VenuesGrid 
            searchQuery={searchQuery}
            filters={filters}
            showFilters={showFilters}       // <-- add this
          />
        } />

        {/* Filter categories: /venues/nge, /venues/sal, etc */}
        <Route path=":tag" element={
          <VenuesGrid 
            searchQuery={searchQuery}
            filters={filters}
            showFilters={showFilters}       // <-- add this
          />
        } />

        {/* Venue details page */}
        <Route path="venue/:id" element={<VenueDetails />} />
        <Route path="venue/:id/BookingForm" element={<BookingForm />} />
      </Routes>
    </>
  );
}