import React from 'react';
import { Helmet } from 'react-helmet';
import SidebarComponent from '../DashboardSidebarComponent';
import TopbarComponent from './components/TopbarComponent';
import MainComponent from './components/MainComponent';
import '../style.css';

const DashboardPage = () => {
  return (
      <>
        <Helmet>
            <title>Dashboard</title>
            <link
              href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
              rel="stylesheet"
            />
            <link
              rel="stylesheet"
              href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
            />
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
            />
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css?family=Bungee Shade"
            />
        </Helmet>
        <div className="container-fluid">
          <div className="row">
            <SidebarComponent />
            <TopbarComponent />
            <MainComponent />
          </div>
        </div>
      </>
  );
};

export default DashboardPage;