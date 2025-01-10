import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';


const Signup = ({ handleRegisterClick, onSubmit }) => {
  const { signup, isSigningUp } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
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
    signup(formData); // Send data to the parent component
  };

  return (
    <div className="form-container sign-up">
      <form onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <div className="social-icons">
          <a href="#" className="icon"><i className="fa-brands fa-google"></i></a>
          <a href="#" className="icon"><i className="fa-brands fa-facebook"></i></a>
          <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
          <a href="#" className="icon"><i className="fa-brands fa-linkedin"></i></a>
        </div>
        <span>Use your email for registration</span>
        <input
          type="text"
          name="username"
          placeholder="Name"
          value={formData.username}
          onChange={handleChange}
          style={{ color: 'black' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
