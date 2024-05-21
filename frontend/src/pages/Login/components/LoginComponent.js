// src/pages/Login/components/LoginComponent.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios

const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Clear any existing errors

    try {
        const response = await axios.post('http://localhost:8000/api/token/', {
        username: username,
        password: password,
      });
      // Save the token to localStorage or another secure place
      const token = response.data.access; // Adjust based on your actual response structure
      localStorage.setItem('token', token); // Save the token
      navigate('/dashboard');
     }
    catch (error) {
      setErrorMessage('Either your password or username is incorrect');
    }
  };

  return (
    <>


      <div className="login-frame">
        <h2 className="text-center mb-4">Login to your account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-5">
            <label htmlFor="username-input" className="form-label">Your Username:</label>
            <input
              type="username"
              className="form-control"
              id="username-input"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-5">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>

          <div className="form-group text-center">
            <button type="submit" className="btn btn-primary w-50">Login</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginComponent;
