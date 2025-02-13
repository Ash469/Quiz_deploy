import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './LoginPage.css';


const LoginPage = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const apiUrl = 'http://localhost:5000/login';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('jwtToken', data.token);
        navigate('/start-quiz');
      } else {
        setErrorMessage('Invalid email or password');
        setTimeout(() => {
          setErrorMessage('');
        }, 2000);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000); 
    }
  };

  return (
    <div className="login-page">
    <div className='container'>
      <h2>Login to Your Account</h2>

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <p>
        New user? <Link to="/signup">Create an account</Link>
      </p>
    </div>
    </div>
  );
};

export default LoginPage;

