import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupModal = ({ show, onHide, onGroupAdded }) => {
  const [groupName, setGroupName] = useState('');
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);

  // Fetch contacts when the modal is opened
  useEffect(() => {
    if (show) {
      const fetchContacts = async () => {
        const token = localStorage.getItem('token'); // Replace with your token retrieval method
        try {
          const response = await axios.get('http://localhost:8000/api/account/contacts', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setContacts(response.data); // Assume response.data is an array of contacts
        } catch (error) {
          console.error("Could not fetch contacts", error);
        }
      };

      fetchContacts();
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Replace with your token retrieval method

    // Prepare the data to send in the POST request
    const dataToSend = {
      name: groupName,
      members: selectedContacts.map(contact => contact.username) // Assuming you only need to send the IDs
    };

    try {
      const response = await axios.post(
        'http://localhost:8000/api/account/group/create/', // Replace with your actual backend endpoint
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 201) {
        // The group was successfully created
        console.log('Group created:', response.data);
        setGroupName('');
        setSelectedContacts([]);
        onGroupAdded();
        onHide();
      } else {
        console.error('Failed to create group:', response.status, response.data);
      }
    } catch (error) {
      console.error('There was an error creating the group:', error);
    }
  };

  const handleSelectContact = (contact) => {
    setSelectedContacts([...selectedContacts, contact]);
    // Remove the selected contact from the contacts list
    setContacts(contacts.filter(c => c.id !== contact.id));
  };

  const handleRemoveContact = (contact) => {
    // Add the removed contact back to the contacts list
    setContacts([...contacts, contact]);
    // Remove the contact from the selected contacts
    setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id));
  };

  if (!show) return null;

  return (
    <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addGroupModalLabel">Add New Group</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onHide}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="group-name">Group Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="group-name"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="member-search">Add Members</label>
                <input
                  type="search"
                  className="form-control"
                  id="member-search"
                  placeholder="Search for contacts..."
                  // Implement search functionality as needed
                />
              </div>

              <div id="search-results" className="list-group overflow-auto" style={{ maxHeight: '150px' }}>
                {contacts.map(contact => (
                  <button
                    key={contact.id}
                    type="button"
                    className="list-group-item list-group-item-action"
                    onClick={() => handleSelectContact(contact)}
                  >
                    {contact.username}
                  </button>
                ))}
              </div>

              <div className="form-group mt-3">
                <label>Contacts Added</label>
                <div id="contacts-added" className="border p-2" style={{ minHeight: '50px' }}>
                  {selectedContacts.map(contact => (
                    <div key={contact.id} className="d-flex justify-content-between align-items-center p-1">
                      {contact.username}
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveContact(contact)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onHide}>Close</button>
                <button type="submit" className="btn btn-primary">Create Group</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupModal;

