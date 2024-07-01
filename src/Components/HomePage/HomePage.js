import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:9002/api/members');
        setMembers(response.data);
      } catch (err) {
        setError('Failed to fetch members. Please try again later.');
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="home-container">
      <h2>Registered Members</h2>
      {error && <p className="error-text">{error}</p>}
      <table className="members-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.username}</td>
              <td>{member.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomePage;
