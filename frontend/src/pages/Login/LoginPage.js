// src/pages/Login/LoginPage.js
import React from 'react';
import { Helmet } from 'react-helmet';
import LoginComponent from './components/LoginComponent';
import SidebarComponent from '../SidebarComponent';
import '../style.css';

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Login Page</title>
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Bungee Shade" />
      </Helmet>
    <div className="container-fluid">
      <div className="row">
        <SidebarComponent />
        <div className="col-md-10">
          <div className="container h-100">
            <div className="row justify-content-center h-100">
              <div className="col-12 col-md-8 col-lg-6">
                <LoginComponent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
