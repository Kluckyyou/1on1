import React from 'react';

const TopBar = () => {
  return (
    <nav className="navbar top-bar top-bar-item">
      <div className="collapse navbar-collapse top-bar-item d-md-block" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto top-bar-item">
          <li className="nav-item">
            <a className="nav-link top-bar-button toggle-sidebar-button"><i className="fas fa-bars"></i></a>
            <a className="nav-link top-bar-button toggle-schedule-button">Schedule</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default TopBar;
