import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import '../style.css';
import Sidebar from '../DashboardSidebarComponent';
import ContactsList from './components/ContactsList';
import GroupsList from './components/GroupsList';
import ContactModal from './components/ContactModal';
import GroupModal from './components/GroupModal';

const ContactsPage = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [refreshContacts, setRefreshContacts] = useState(false);
  const [refreshGroups, setRefreshGroups] = useState(false);

  const toggleContactModal = () => setShowContactModal(!showContactModal);
  const toggleGroupModal = () => setShowGroupModal(!showGroupModal);
  // Function to be called to refresh the contacts list
  const handleRefreshContacts = () => {
    setRefreshContacts(prev => !prev); // Toggling state to trigger useEffect in ContactsList
  };

  const handleRefreshGroups = () => {
    setRefreshGroups(prev => !prev); // Toggling state to trigger useEffect in ContactsList
  };

  return (
    <>
      <Helmet>
        <title>Contacts</title>
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet"/>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Bungee Shade"/>
      </Helmet>
        <div className="container-fluid">
          <div className="row">
            <Sidebar />
            <div className="col-md-10 main-content">
              <div class="row">
                <ContactsList onAddContactClick={toggleContactModal} refresh={refreshContacts} />
                <GroupsList onAddGroupClick={toggleGroupModal} refresh={refreshGroups} />
              </div>
            </div>
          </div>
          <ContactModal show={showContactModal} onHide={toggleContactModal} onContactAdded={handleRefreshContacts} />
          <GroupModal show={showGroupModal} onHide={toggleGroupModal} onGroupAdded={handleRefreshGroups} />
        </div>
    </>
  );
};

export default ContactsPage;

