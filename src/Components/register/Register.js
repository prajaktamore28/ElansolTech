import React,{ useState }  from "react";
import "./Register.css"


import axios from 'axios';


const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    reenterPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [matchError, setMatchError] = useState('');
  const [emailError, setEmailError] = useState(''); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'password') {
      validatePassword(value);
    }

    if (name === 'reenterPassword') {
      checkPasswordsMatch(formData.password, value);
    }
    if (name === 'email') {
      validateEmail(value);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format.');
    } else {
      setEmailError('');
    }
  };
  const validatePassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      setPasswordError('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
    } else {
      setPasswordError('');
    }
  };

  const checkPasswordsMatch = (password, reenterPassword) => {
    if (password !== reenterPassword) {
      setMatchError('Passwords do not match.');
    } else {
      setMatchError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (passwordError || matchError) {
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:9002/api/register', formData);
      setSuccess(response.data.message)
      if (response.data.message === 'Email already exists') {
        setError('Email already exists. Please use a different email.');
      } else {
        setSuccess('Registration successful!');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="registration-form" type="POST  ">
        <div className="form-group">
          <label>Username:</label>
          <input 
            type="text" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            className={passwordError ? 'error-border' : ''}
            required 
          />
          {passwordError && <p className="error-text">{passwordError}</p>}
        </div>
        <div className="form-group">
          <label>Re-enter Password:</label>
          <input 
            type="password" 
            name="reenterPassword" 
            value={formData.reenterPassword} 
            onChange={handleChange} 
            className={matchError ? 'error-border' : ''}
            required 
          />
          {matchError && <p className="error-text">{matchError}</p>}
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}
    </div>
  );
};

export default Register;


