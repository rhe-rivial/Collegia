import "../styles/Dashboard.css"; 

import SearchBar from "./SearchBar.jsx";
import VenuesGrid from "./VenuesGrid.jsx";
import Navigation from "./Navigation.jsx"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./Footer.jsx";

export default function Dashboard() {
  return (
 
    <Router>
      <SearchBar />
      <Navigation />
      <Routes>
        <Route path="/:tag" element={<VenuesGrid />} />
        <Route path="/" element={<VenuesGrid />} />
      </Routes>
    </Router>
   
  );
}
