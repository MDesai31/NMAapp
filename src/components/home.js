import React from 'react';
import './Home.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate()
    return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Newark Medical Associates</h1>
      <div className="options-container">
        <button className="option-button" onClick={() => navigate('/patient')}>Patient Management</button>
        <button className="option-button">In-patient Management</button>
        <button className="option-button">Clinic Staff Management</button>
      </div>
    </div>
  );
}

export default Home;