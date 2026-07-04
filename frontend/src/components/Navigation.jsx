import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navigation() {
  const location = useLocation();
  const [showSalesMenu, setShowSalesMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/dashboard">
            <span className="brand-text">💊 PharmaCare</span>
          </Link>
        </div>

        <div className="nav-links">
          <Link to="/dashboard" className={`nav-link ${isActive("/dashboard")}`}>
            <span>Dashboard</span>
          </Link>
          <Link to="/inventory" className={`nav-link ${isActive("/inventory")}`}>
            <span>Inventory</span>
          </Link>
          
          <div 
            className={`nav-dropdown ${showSalesMenu ? 'open' : ''}`}
            onMouseEnter={() => setShowSalesMenu(true)}
            onMouseLeave={() => setShowSalesMenu(false)}
          >
            <button className="nav-link dropdown-btn">
              <span>Sales & Billing</span>
            </button>
            <div className="dropdown-menu">
              <Link to="/customers" className="dropdown-item">👥 Customers</Link>
              <Link to="/invoices" className="dropdown-item">📄 Invoices</Link>
              <Link to="/sales-history" className="dropdown-item">📊 Sales History</Link>
            </div>
          </div>

          <Link to="/expiry-alerts" className={`nav-link ${isActive("/expiry-alerts")}`}>
            <span>Expiry Alerts</span>
          </Link>
        </div>

        <div className="nav-actions">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;