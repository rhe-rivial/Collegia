import "../styles/Dashboard.css"; 
import SearchBar from "./SearchBar.jsx";
import VenuesGrid from "./VenuesGrid.jsx";
import Navigation from "./Navigation.jsx"; 
import VenueDetails from "./VenueDetails.jsx"; 
import Bookings from "./Bookings.jsx"; 
import { Routes, Route } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      <SearchBar />
      <Navigation />

      <Routes>

        {/* Default page: /venues */}
        <Route index element={<VenuesGrid />} />

        {/* Filter categories: /venues/nge, /venues/sal, etc */}
        <Route path=":tag" element={<VenuesGrid />} />

        {/* Venue details page: /venues/venue/12 */}
        <Route path="venue/:id" element={<VenueDetails />} />

        {/* Bookings: /venues/bookings */}
        <Route path="bookings" element={<Bookings />} />

      </Routes>
    </>
  );
}
