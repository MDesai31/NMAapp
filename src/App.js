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
import InPatientManagement from './components/inpatient';
import ViewRoom from './components/inpatient_management/view_room';
import ViewInpatient from './components/inpatient_management/view_inpatient';
import AddRemoveRoom from './components/inpatient_management/add_remove_room';
import AddRemoveNurse from './components/inpatient_management/add_remove_nurse';
import AddRemoveDoctor from './components/inpatient_management/add_remove_doctor';

import SchedulePerDay from './components/patient_management/schedule_per_day';
import SchedulePerDoctor from './components/patient_management/schedule_per_doctor';
import ScheduleAppointment from './components/patient_management/schedule_appointment';
import ScheduledSurgery from './components/inpatient_management/scheduled_surgery';

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
        <Route path='/inpatient' element={<InPatientManagement />} />
        <Route path='/view_room' element={<ViewRoom />} />
        <Route path='/view_inpatient' element={<ViewInpatient />} />
        <Route path='/add_remove_room/:id' element={<AddRemoveRoom />} />
        <Route path='/add_remove_nurse/:id' element={<AddRemoveNurse />} />
        <Route path='/add_remove_doctor/:id' element={<AddRemoveDoctor />} />


        <Route path='/insert_patient' element={<InsertPatient />} />
        <Route path='/previous_diagnosis' element={<PreviousDiagnosis />} />
        <Route path='/schedule_per_day' element={<SchedulePerDay />} />
        <Route path='/schedule_per_doctor' element={<SchedulePerDoctor />} />
        <Route path='/schedule_appointment' element={<ScheduleAppointment />} />
        <Route path='/scheduled_surgery' element={<ScheduledSurgery />} />
      </Routes>
    </Router>
  );
};

export default App;