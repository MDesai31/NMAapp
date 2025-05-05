import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Staff.css'; // Import the CSS file

function StaffManagement() {
const navigate = useNavigate()
  return (
    <div className="staff-management-container">
      <h1 className="page-title">Staff Management</h1>
      <div className="options-grid">
        <button className="option-button" onClick={() => navigate('/addStaff')}>Insert New Staff</button>
        <button className="option-button" onClick={() => navigate('/view_staff')}>View Staff Information</button>
        <button className="option-button">Remove Staff</button>
        <button className="option-button">Schedule job shift</button>
      </div>
    </div>
  );
}

export default StaffManagement;