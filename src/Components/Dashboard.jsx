import "../styles/Dashboard.css"; 
import SearchBar from "./SearchBar.jsx";
import VenuesGrid from "./VenuesGrid.jsx";
import Navigation from "./Navigation.jsx"; 
import VenueDetails from "./VenueDetails.jsx"; 
import Bookings from "./Bookings.jsx"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./Footer.jsx";

export default function Dashboard() {
  // Temporarily is a router 
  return (
    <Router>
      <SearchBar />
      <Navigation />
      <Routes>
        <Route path="/" element={<VenuesGrid />} />
        <Route path="/:tag" element={<VenuesGrid />} />
        <Route path="/venue/:id" element={<VenueDetails />} /> 
        <Route path="/bookings" element={<Bookings />} /> 
      </Routes>
    </Router>
  );
}
