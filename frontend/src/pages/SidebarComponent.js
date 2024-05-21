// src/pages/Login/components/SidebarComponent.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarComponent = () => {
  return (
    <nav className="col-md-2 d-none d-md-block sidebar">
      <div className="logo">
        <h1>1on1</h1>
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            to="/login"
          >
            Login
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            to="/register"
          >
            Sign up
          </NavLink>
        </li>
      </ul>

      <footer className="sidebar-footer">
        <p>Copyright &#169; 2024 by 1on1</p>
      </footer>
    </nav>
  );
};

export default SidebarComponent;

