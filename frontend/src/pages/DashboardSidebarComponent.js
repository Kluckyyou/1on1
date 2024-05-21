import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  let navigate = useNavigate();

  useEffect(() => {
    // Function to fetch user data
    const fetchUserData = async () => {
      try {
        // Assume the token is stored in localStorage, replace with your token retrieval method
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/account/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Assuming the response contains the username field in the user object
        setUsername(response.data.username); // Update state with username
        setAvatar('http://localhost:8000' + response.data.avatar);
      } catch (error) {
        console.error('Error fetching user data', error);
        // Handle error, e.g., redirect to login if the token is invalid
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the authentication token
    navigate('/login'); // Redirect to the login page
  };

  return (
    <nav className="col-md-2 d-none d-md-block sidebar">
      <div className="logo-dashboard">
        <h1>1on1</h1>
      </div>
      <div className="sidebar-header">
        <img src={avatar} alt="Profile" width="100" height="100" />
        <p>Welcome, {username}</p>
      </div>
      <ul className="nav flex-column">
        <li className="nav-item"><a className="nav-link new-meeting-btn green-color" href="new_meeting.html">New Meeting</a></li>
        <li className="nav-item">
        <NavLink
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            to="/dashboard"
          >
            Dashboard
        </NavLink>
        </li>
        <li className="nav-item">
        <NavLink
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            to="/notifications"
          >
            Notifications
          </NavLink>
        </li>
        <li className="nav-item"><a className="nav-link" href="#">Meetings</a></li>
        <li className="nav-item">
        <NavLink
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            to="/account"
          >
            Account
          </NavLink>
        </li>
        <li className="nav-item">
        <NavLink
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            to="/contacts"
          >
            Contacts
        </NavLink>
        </li>
        <li className="nav-item"><button className="logout-button" onClick={handleLogout}>Log Out</button></li>
      </ul>
      <footer className="sidebar-footer">
        <p>Copyright © 2024 by 1on1</p>
      </footer>
    </nav>
  );
};

export default Sidebar;
