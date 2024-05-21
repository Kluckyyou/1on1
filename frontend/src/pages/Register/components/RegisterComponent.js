// src/pages/Register/components/RegisterComponent.js
import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios'; // Import Axios

const RegisterComponent = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  let navigate = useNavigate();

  useEffect(() => {
    // Real-time validation for username
    if (username && username.length < 3) {
      setErrors(errors => ({ ...errors, username: 'Username must be at least 3 characters.' }));
    } else {
      setErrors(errors => {
        const { username, ...rest } = errors;
        return rest;
      });
    }

    // Real-time validation for email format
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setErrors(errors => ({ ...errors, email: 'Please enter a valid email address.' }));
    } else {
      setErrors(errors => {
        const { email, ...rest } = errors;
        return rest;
      });
    }

    // Real-time validation for password strength
    if (password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) {
      setErrors(errors => ({ ...errors, password: 'Password must be stronger.' }));
    } else {
      setErrors(errors => {
        const { password, ...rest } = errors;
        return rest;
      });
    }

    // Real-time validation for confirm password
    if (confirmPassword && password !== confirmPassword) {
      setErrors(errors => ({ ...errors, confirmPassword: 'Passwords do not match.' }));
    } else {
      setErrors(errors => {
        const { confirmPassword, ...rest } = errors;
        return rest;
      });
    }
  }, [username, email, password, confirmPassword]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const finalErrors = {};
    if (!username.trim()) finalErrors.username = 'Username is required.';
    if (!email.trim()) finalErrors.email = 'Email is required.';
    if (!password.trim()) finalErrors.password = 'Username is required.';
    if (!confirmPassword.trim()) finalErrors.confirmPassword = 'Username is required.';
    if (username && username.length < 3) {
      finalErrors.username = 'Username must be at least 3 characters.';
    }
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      finalErrors.email = 'Please enter a valid email address.';
    }
    if (password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) {
      finalErrors.password = 'Password must be stronger.';
    }
    if (confirmPassword && password !== confirmPassword) {
      finalErrors.confirmPassword = 'Passwords do not match.';
    }
    // Update the state only if there are final errors
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      return; // Prevent form submission if there are errors
    }

    // Clear previous errors if any
    setErrors({});

    try {
        await axios.post('http://localhost:8000/api/account/register/', {
        username: username,
        email: email,
        password: password,
        password2: confirmPassword
      });
      navigate('/login');

    } catch (error) {
        if (error.response && error.response.data.username) {
            // Handle username uniqueness error
            setErrors({ username: "A user with that username already exists." });
        } else {
            // Handle other errors
            setErrors({ form: 'An error occurred. Please try again later.' });
        }
    }
  };

  return (
    <div className="register-frame">
      <h4 className="text-center">New to 1on1?</h4>
      <h2 className="text-center mb-4">Create a new account</h2>
      <form onSubmit={handleSubmit} noValidate>

        {/* Username Input */}
        <div className="form-group mb-3">
          <label htmlFor="username-input" className="form-label">Username:</label>
          <input
            type="text"
            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
            id="username-input"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errors.username && <div className="invalid-feedback">{errors.username}</div>}
        </div>

        {/* Email Input */}
        <div className="form-group mb-3">
          <label htmlFor="email-input" className="form-label">Your Email:</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email-input"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        {/* ... Other fields ... */}

        {/* Password Input */}
        <div className="form-group mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        {/* Confirm Password Input */}
        <div className="form-group mb-3">
          <label htmlFor="confirm-password" className="form-label">Confirm Password:</label>
          <input
            type="password"
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            id="confirm-password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
        </div>

        {/* ... */}

        {/* Submit Button */}
        <div className="form-group text-center">
          <button type="submit" className="btn btn-primary w-50">Sign up</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterComponent;

