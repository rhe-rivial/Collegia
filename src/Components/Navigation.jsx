import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "../styles/DashboardRoutes.css"; 

// Navigation tabs
const navItems = [
  { path: '/venues/nge', label: 'NGE', left: '0px', top: '15px', width: '116px', dotLeft: '124px' },
  { path: '/venues/sal', label: 'SAL', left: '152px', top: '15px', width: '66px', dotLeft: '124px' },
  { path: '/venues/gle', label: 'GLE', left: '266px', top: '15px', width: '51px', dotLeft: '238px' },
  { path: '/venues/court', label: 'Court', left: '363px', top: '15px', width: '102px', dotLeft: '335px' },
  { path: '/venues/acad', label: 'ACAD', left: '508px', top: '15px', width: '56px', dotLeft: '480px' },
  { path: '/venues/more', label: 'More', left: '607px', top: '15px', width: '46px', dotLeft: '579px' }
];

function Navigation({ 
  searchQuery, 
  filters, 
  showFilters, 
  onFiltersChange, 
  onFilterToggle 
}) {
  const location = useLocation();
  const [activeIndicatorLeft, setActiveIndicatorLeft] = useState('0px');

//Active indicator is hidden when using search/filter (redundancy)
  useEffect(() => {
    const activeItem = navItems.find(item => location.pathname === item.path) || navItems[0];
    setActiveIndicatorLeft(activeItem.left);
  }, [location.pathname]);

  const handleCapacityChange = (e) => {
    onFiltersChange({
      ...filters,
      capacity: e.target.value
    });
  };

  useEffect(() => {
  if (showFilters) {
    // Hide indicator when filtering
    setActiveIndicatorLeft(null);
  } else {
    const activeItem = navItems.find(item => location.pathname === item.path) || navItems[0];
    setActiveIndicatorLeft(activeItem.left);
  }
}, [location.pathname, showFilters]);

  const handleLocationChange = (e) => {
    onFiltersChange({
      ...filters,
      location: e.target.value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      capacity: "",
      location: ""
    });
  };

  const hasActiveFilters = filters.capacity || filters.location;

  return (
    
    <nav className="nav-container">

      <div className="nav-inner">
        {/* Active indicator line */}
       {!searchQuery && !showFilters && (
        <div className="active-indicator" style={{ left: activeIndicatorLeft }}></div>
        )}

      {/* Only show nav links when not searching and filters dropdown is closed */}
      {!searchQuery && !showFilters && (
        <>
          {navItems.map((item, index) => (
            <div key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={{ left: item.left, top: item.top, width: item.width }}
              >
                {item.label}
              </NavLink>

              {/* Dot separator (hidden for last item) */}
              {index < navItems.length - 1 && (
                <div className="nav-dot" style={{ left: item.dotLeft, top: '23px' }}></div>
              )}
            </div>
          ))}
        </>
      )}


        {/* Filter button/pill */}
      <div className="filter-pill" onClick={onFilterToggle}>
          <div className="filter-icon-container">
            <img src="/icons/filter.png" className="filter-icon" alt="Filter" />
            {hasActiveFilters && <div className="filter-badge"></div>}
          </div>
          <p className="filter-text">Filters</p>
      </div>

        {/* Filter dropdown */}
        {showFilters && (
          <div className="filter-dropdown">
            <div className="filter-header">
              <h3>Filters</h3>
              {hasActiveFilters && (
                <button className="clear-filters" onClick={clearFilters}>
                  Clear All
                </button>
              )}
            </div>
            
            <div className="filter-group">
              <label>Minimum Capacity</label>
              <select value={filters.capacity} onChange={handleCapacityChange}>
                <option value="">Any capacity</option>
                <option value="50">50+ people</option>
                <option value="100">100+ people</option>
                <option value="150">150+ people</option>
                <option value="200">200+ people</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Location Area</label>
              <select value={filters.location} onChange={handleLocationChange}>
                <option value="">All areas</option>
                <option value="NGE">NGE</option>
                <option value="SAL">SAL</option>
                <option value="GLE">GLE</option>
                <option value="Court">Court</option>
                <option value="ACAD">ACAD</option>
                <option value="More">More</option>
              </select>
            </div>

            <div className="active-filters">
              {filters.capacity && (
                <span className="active-filter-tag">
                  Capacity: {filters.capacity}+
                  <button onClick={() => onFiltersChange({...filters, capacity: ""})}>×</button>
                </span>
              )}
              {filters.location && (
                <span className="active-filter-tag">
                  Location: {filters.location}
                  <button onClick={() => onFiltersChange({...filters, location: ""})}>×</button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;