import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "../styles/DashboardRoutes.css"; 

// Navigation data configuration
const navItems = [
  { path: '/nge', label: 'NGE', left: '0px', top: '15px', width: '116px', dotLeft: '124px' },
  { path: '/sal', label: 'SAL', left: '152px', top: '15px', width: '66px', dotLeft: '124px' },
  { path: '/gle', label: 'GLE', left: '266px', top: '15px', width: '51px', dotLeft: '238px' },
  { path: '/court', label: 'Court', left: '363px', top: '15px', width: '102px', dotLeft: '335px' },
  { path: '/acad', label: 'ACAD', left: '508px', top: '15px', width: '56px', dotLeft: '480px' },
  { path: '/more', label: 'More', left: '607px', top: '15px', width: '46px', dotLeft: '579px' }
];

// Navigation Component
function Navigation() {
  const location = useLocation();
  const [activeIndicatorLeft, setActiveIndicatorLeft] = useState('0px');

  // Update active indicator position based on current route
  useEffect(() => {
    const activeItem = navItems.find(item => location.pathname === item.path) || navItems[0];
    setActiveIndicatorLeft(activeItem.left);
  }, [location.pathname]);

  return (
    <nav className="nav-container">
      <div className="nav-inner">

        {/* Active indicator line */}
        <div className="active-indicator" style={{ left: activeIndicatorLeft }}></div>
        
        {/* Navigation links */}
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
            {index < navItems.length && (
              <div className="nav-dot" style={{ left: item.dotLeft, top: '23px' }}></div>
            )}
          </div>
        ))}

        {/* Filter button/pill */}
        <div className="filter-pill">
          <div className="filter-icon-container">
            <img src="/icons/filter.png" className="filter-icon" alt="Filter" />
          </div>
          <p className="filter-text">Filters</p>
        </div>

      </div>
    </nav>
  );
}

export default Navigation;
