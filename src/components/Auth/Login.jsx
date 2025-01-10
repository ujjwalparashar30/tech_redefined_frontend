import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';

const Login = ({ handleLoginClick }) => {
  const { login, isLoggingIn } = useAuthStore(); // Assuming you have a login method in your store
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData); // Send data to your login handler
  };

  return (
    <div className="form-container sign-in">
      <form onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        <div className="social-icons">
          <a href="#" className="icon"><i className="fa-brands fa-google"></i></a>
          <a href="#" className="icon"><i className="fa-brands fa-facebook"></i></a>
          <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
          <a href="#" className="icon"><i className="fa-brands fa-linkedin"></i></a>
        </div>
        <span>Use your username and password</span>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          style={{ color: 'black' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={{ color: 'black' }}
        />
        <a href="#">Forgot your password?</a>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Login;
