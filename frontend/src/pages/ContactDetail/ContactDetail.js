import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../DashboardSidebarComponent';
import { Helmet } from 'react-helmet';
import '../style.css'; // Make sure this path is correct for your CSS file


const ContactDetail = () => {
  const { contactId } = useParams(); // This hooks into the router params
  const [contact, setContact] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    avatar: ''
  });

  useEffect(() => {
    const fetchContact = async () => {
      const token = localStorage.getItem('token'); // Replace with your token retrieval method
      try {
        const response = await axios.get(`http://localhost:8000/api/account/contacts/${contactId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setContact(response.data); // Assuming the API returns contact data directly
      } catch (error) {
        console.error("Could not fetch contact", error);
      }
    };

    fetchContact();
  }, [contactId]); // Re-run this effect if the contactId changes

  return (
    <>
    <Helmet>
        <title>Contacts Detail</title>
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet"/>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Bungee Shade"/>
    </Helmet>
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <div className="col-md-10 mt-4">
            <Link to="/contacts" className="btn btn-primary ml-3">Back to Contacts</Link>
            <div className="container h-100">
              <div className="row justify-content-center h-100">
                <div className="col-12 col-md-8 col-lg-6">
                  <div className="account mt-4">
                    <div className="form-group-pic text-center">
                      <img src={'http://localhost:8000' + contact.avatar} alt="Profile" className="profile-pic" />
                    </div>
                    <div className="text-center">
                      <h4>First Name: {contact.first_name}</h4>
                      <h4>Last Name: {contact.last_name}</h4>
                      <h4>Email: {contact.email}</h4>
                      <h4>Username: {contact.username}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactDetail;
