import React from 'react';
import Sidebar from '../DashboardSidebarComponent';
import '../style.css';
import { Helmet } from 'react-helmet';

const Notifications = () => {
  // You would likely fetch this data from an API in a real app
  const notifications = [
    // ... array of notifications
  ];

  // Add logic to fetch notifications and replace static content as needed

  return (
  <>
  <Helmet>
    <title>Notifications</title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet"/>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"/>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Bungee Shade"/>
  </Helmet>
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <div className="col-md-10 main-content pt-4">
          <h2>Notifications</h2>
          {notifications.map((notification, index) => (
            <div key={index} className="notification-block mb-3 mt-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title font-weight-bold">{notification.title}</h5>
                  <p className="card-text">{notification.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
  );
};

export default Notifications;
