import React, { useState } from 'react';
import axios from 'axios';

const ContactModal = ({ show, onHide, onContactAdded }) => {
  // Since we only need the username, we can use a simple string state
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve the bearer token from local storage
    setError('');
    try {
      const response = await axios.post(
        'http://localhost:8000/api/account/contacts/add/', // Replace with your actual backend endpoint
        { username }, // We're sending just the username in the body of the request
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Check for successful status code, axios uses the property 'status'
      if (response.status === 201) {
        setUsername(''); // Reset username input
        onContactAdded();
        onHide(); // Hide the modal after successful addition
      } else {
        // If the status code is not successful, log the status and response data
        setError(error.response.data || 'Failed to add contact. Please try again.');
      }
    } catch (error) {
      setError(error.response.data || 'Failed to add contact. Please try again.');
    }
  };

  if (!show) return null;

  return (
    <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addContactModalLabel">Add New Contact</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onHide}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="contact-username">Username</label>
                <input
                  type="text"
                  className={`form-control ${error ? 'is-invalid' : ''}`}
                  id="contact-username"
                  name="username"
                  value={username}
                  onChange={handleChange}
                  required
                />
                {error && <div className="invalid-feedback">{error}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onHide}>Close</button>
                {/* Set the type to 'submit' to trigger the form submission */}
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;