import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AccountForm = () => {
  const [userDetails, setUserDetails] = useState({
    first_name: '',
    last_name: '',
    email: '',
    avatar: '',
    username: ''
  });
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8000/api/account/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUserDetails({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
          avatar: response.data.avatar,
          username: response.data.username
        });
        // Adjust avatarPreview to use the complete path including the server URL if necessary
        setAvatarPreview('http://localhost:8000' + response.data.avatar);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchData();
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result); // Set the preview URL from FileReader
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('first_name', userDetails.first_name);
    formData.append('last_name', userDetails.last_name);
    formData.append('email', userDetails.email);
    formData.append('username', userDetails.username);
    if (event.target.profilePic.files.length > 0) {
      formData.append('avatar', event.target.profilePic.files[0]);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:8000/api/account/profile/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Profile updated successfully!');
      // Update avatar in userDetails to reflect the newly uploaded avatar
      setUserDetails(prev => ({ ...prev, avatar: avatarPreview }));
      window.location.replace("/account")
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  return (
    <div className="account">
      <form className="mt-4" encType="multipart/form-data" onSubmit={handleUpdate}>
        {/* Profile Picture Input */}
        <div className="form-group-pic text-center">
          <label htmlFor="profilePicInput" className="profile-pic-label">
            <img src={avatarPreview || '/path/to/default/avatar.jpg'} alt="Profile" className="profile-pic" />
            <span className="change-text">Change</span>
          </label>
          <input
            type="file"
            id="profilePicInput"
            name="profilePic"
            className="d-none"
            onChange={handleFileSelect}
          />
        </div>

        {/* First Name Input */}
        <div className="form-group mb-4">
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            className="form-control"
            id="first_name"
            name="first_name"
            value={userDetails.first_name}
            onChange={e => setUserDetails({...userDetails, first_name: e.target.value})}
          />
        </div>

        {/* Last Name Input */}
        <div className="form-group mb-4">
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            className="form-control"
            id="last_name"
            name="last_name"
            value={userDetails.last_name}
            onChange={e => setUserDetails({...userDetails, last_name: e.target.value})}
          />
        </div>

        {/* Email Input */}
        <div className="form-group mb-4">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={userDetails.email}
            onChange={e => setUserDetails({...userDetails, email: e.target.value})}
            required
          />
        </div>

        <div className="form-group text-center mt-5">
          <button type="submit" className="btn btn-primary w-50">Update</button>
        </div>
      </form>
    </div>
  );
};

export default AccountForm;

