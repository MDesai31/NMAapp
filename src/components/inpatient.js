import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Inpatient.css'; // Import the CSS file

function InPatientManagement() {
const navigate = useNavigate()
  return (
    <div className="inpatient-management-container">
      <h1 className="page-title">InPatient Management</h1>
      <div className="options-grid">
        <button className="option-button" onClick={() => navigate('/view_room')}>View Room Details</button>
        <button className="option-button">View scheduled surgery per patient</button>
      </div>

      <div className="mt-4 md:mt-6">
        <button
          variant="outlined"
          onClick={() => navigate('/home')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default InPatientManagement;