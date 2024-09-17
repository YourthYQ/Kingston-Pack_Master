import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css'; // Specific styles for the navbar
import logo from '../assets/images/010.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  // Helper function to determine active link class
  const setActiveClass = ({ isActive }) => (isActive ? 'nav-link current_tab' : 'nav-link');

  return (
    <nav className="navbar">
      <div className="container">
        <div className="row w-100 align-items-center">
          {/* Logo Section */}
          <div className="col-md-4 col-6">
            <div className="logo">
              <img src={logo} alt="logo"></img>
            </div>
          </div>
          <div className="col-md-4 col-6 d-flex justify-content-center">
            <div className="nav-links">
              <NavLink className={setActiveClass} to="/">Home</NavLink>
              <NavLink className={setActiveClass} to="/services">Services</NavLink>
              <NavLink className={setActiveClass} to="/about">About</NavLink>
              {/*<NavLink className={setActiveClass} to="/main">Main</NavLink>*/}
            </div>
          </div>
          <div className="col-md-4 d-none d-md-flex justify-content-end">
            <div className="contact">
              <NavLink className="cta-c" to="#">
                Contact us →
              </NavLink>
            </div>
          </div>
        </div>
      </div>    
    </nav>
  );
};

export default Navbar;