import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Patient.css'; // Import the CSS file

function PatientManagement() {
const navigate = useNavigate()
  return (
    <div className="patient-management-container">
      <h1 className="page-title">Patient Management</h1>
      <div className="options-grid">
        <button className="option-button">Insert New Patient</button>
        <button className="option-button" onClick={() => navigate('/view_patient')}>View Patient Information</button>
        <button className="option-button">Schedule an Appointment</button>
        <button className="option-button">Check Previous Diagnoses</button>
        <button className="option-button">View Schedule per Doctor</button>
        <button className="option-button">View Schedule per Day</button>
      </div>
    </div>
  );
}

export default PatientManagement;