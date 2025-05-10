import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Staff.css'; // Import the CSS file

function StaffManagement() {
const navigate = useNavigate()
  return (
    <div className="staff-management-container">
      <h1 className="page-title">Staff Management</h1>
      <div className="options-grid">
        <button className="option-button" onClick={() => navigate('/addStaff')}>Add New Staff</button>
        <button className="option-button" onClick={() => navigate('/view_staff')}>View-Modify Staff Information</button>
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

export default StaffManagement;