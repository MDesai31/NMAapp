import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import Home from './components/home';
import PatientManagement from './components/patient';
import ViewPatients from './components/patient_management/view_patient';
import StaffManagement from './components/staff';
import ViewStaffs from './components/staff_management/view_staff';
import EditAddShift from './components/staff_management/editAddShift'; // Ensure this import is added
import AddStaff from './components/staff_management/addStaff';
import InsertPatient from './components/patient_management/insert_patient';
import PreviousDiagnosis from './components/patient_management/previous_diagnosis';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to='/home' replace/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/patient' element={<PatientManagement />} />
        <Route path='/view_patient' element={<ViewPatients />} />
        <Route path='/staff' element={<StaffManagement />} />
        <Route path='/view_staff' element={<ViewStaffs />} />
        <Route path="/editAddShift/:id" element={<EditAddShift />} />
        <Route path='/addStaff' element={<AddStaff />} />


        <Route path='/insert_patient' element={<InsertPatient />} />
        <Route path='/previous_diagnosis' element={<PreviousDiagnosis />} />
      </Routes>
    </Router>
  );
};

export default App;