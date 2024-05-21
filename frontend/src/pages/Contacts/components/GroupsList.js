import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupsList = ({ onAddGroupClick, refresh }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const token = localStorage.getItem('token'); // Retrieve the bearer token from local storage
      try {
        const response = await axios.get('http://localhost:8000/api/account/group/', { // Adjust the URL to match your backend endpoint
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setGroups(response.data); // Set the groups with the response data
      } catch (error) {
        console.error("Could not fetch groups", error);
      }
    };

    fetchGroups();
  }, [refresh]);

  const deleteGroup = async (id) => {
    const token = localStorage.getItem('token'); // Retrieve the bearer token from local storage
    try {
      await axios.delete(`http://localhost:8000/api/account/group/${id}/delete`, { // Adjust the URL to match your backend endpoint
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setGroups(groups.filter(group => group.id !== id)); // Remove the group from the state
    } catch (error) {
      console.error("Could not delete group", error);
    }
  };

  return (
    <div className="col-md-6">
      <h3>Groups</h3>
      <button type="button" className="btn btn-primary btn-block mb-3" onClick={onAddGroupClick}>
        Add Group
      </button>
      <div className="list-group group-list">
        {groups.map(group => (
          <div key={group.id} className="list-group-item flex-column align-items-start mb-2 rounded">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1 font-weight-bold">{group.name}</h5>
              <button className="btn btn-danger btn-sm" onClick={() => deleteGroup(group.id)}>Delete</button>
            </div>
            <ul className="list-unstyled">
              {group.members.map((member, index) => (
                // Index is used here due to potential non-unique member names. It's better to have unique keys if possible.
                <li key={index}>{member}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsList;

