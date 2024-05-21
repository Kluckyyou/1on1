import React, { useState, useEffect }  from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ContactsList = ({ onAddContactClick, refresh }) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const token = localStorage.getItem('token'); // Retrieve the bearer token from local storage
      try {
        const response = await axios.get('http://localhost:8000/api/account/contacts', { // Adjust the URL to match your backend endpoint
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setContacts(response.data); // Set the contacts directly with response.data
      } catch (error) {
        console.error("Could not fetch contacts", error);
      }
    };

    fetchContacts();
  }, [refresh]);

  const deleteContact = async (id) => {
    const token = localStorage.getItem('token'); // Retrieve the bearer token from local storage
    try {
      // Use backticks for string interpolation
      await axios.delete(`http://localhost:8000/api/account/contacts/delete/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // If successful, update the contacts state
      setContacts(contacts.filter(contact => contact.id !== id));
    } catch (error) {
      console.error("Could not delete contact", error);
    }
  };

  return (
    <div className="col-md-6">
      <h3>Contacts</h3>
      <button type="button" className="btn btn-primary btn-block mb-3" onClick={onAddContactClick}>
        Add Contacts
      </button>
      <div className="list-group contact-list">
        {contacts.map(contact => (
          <div key={contact.id} className="list-group-item list-group-item-action flex-column align-items-start mb-2 rounded">
            <Link to={`/contact-detail/${contact.id}`} style={{ color: 'inherit', textDecoration: 'none', display: 'block', position: 'relative' }}>
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1 font-weight-bold">{contact.username}</h5>
              </div>
              <p className="mb-1">{contact.email}</p>
            </Link>
            <button className="btn btn-danger btn-sm" style={{ position: 'absolute', right: '10px', top: '10px' }} onClick={() => deleteContact(contact.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsList;
