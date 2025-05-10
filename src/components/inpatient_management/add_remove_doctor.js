import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Button, Paper, Typography, CircularProgress,
    Table, TableHead, TableBody, TableRow, TableCell,
    MenuItem, Select, InputLabel, FormControl
} from '@mui/material';

const AddRemoveDoctor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [patient, setPatient] = useState(null);
    const [doctorHistory, setDoctorHistory] = useState([]);
    const [availableDoctors, setAvailableDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [loading, setLoading] = useState(true);
    const [deletingIndex, setDeletingIndex] = useState(null);
    const [assigning, setAssigning] = useState(false);

    // Fetch patient details
    const fetchPatient = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:9000/api/inpatients/${id}`);
            const data = await res.json();
            setPatient(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    // Fetch doctor assignment history
    const fetchDoctorHistory = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:9000/api/inpatients/${id}/doctor`);
            const data = await res.json();
            setDoctorHistory(Array.isArray(data) ? data : [data]);
        } catch (err) {
            console.error(err);
            setDoctorHistory([]);
        }
    }, [id]);

    // Fetch list of available doctors
    const fetchAvailableDoctors = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:9000/api/doctors`);
            const data = await res.json();
            setAvailableDoctors(data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    // Remove doctor from patient
    const handleRemoveDoctor = async (Primary_Physician_ID, index) => {
        setDeletingIndex(index);
        try {
            const response = await fetch(`http://localhost:9000/api/inpatients/${id}/removedoctor`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Primary_Physician_ID }),
            });
            if (!response.ok) throw new Error('Failed to remove doctor');
            await fetchDoctorHistory();
            await fetchPatient();
        } catch (err) {
            alert('Failed to remove doctor.');
        } finally {
            setDeletingIndex(null);
        }
    };

    // Assign new doctor
    const handleAssignDoctor = async () => {
        if (!selectedDoctor) return;
        setAssigning(true);
        try {
            const res = await fetch(`http://localhost:9000/api/inpatients/${id}/adddoctor`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Primary_Physician_ID: selectedDoctor }),
            });
            if (!res.ok) throw new Error('Failed to assign doctor');
            await fetchDoctorHistory();
            await fetchPatient();
            setSelectedDoctor('');
        } catch (err) {
            alert('Doctor assignment failed.');
        } finally {
            setAssigning(false);
        }
    };

    useEffect(() => {
        fetchPatient();
        fetchDoctorHistory();
        fetchAvailableDoctors();
    }, [fetchPatient, fetchDoctorHistory, fetchAvailableDoctors]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><CircularProgress /></div>;
    }

    if (!patient) {
        return <div className="p-4"><Typography color="error">Inpatient details not found.</Typography></div>;
    }
    const formattedDate = new Date(patient.Date_of_birth).toISOString().split('T')[0];

    return (
        <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Paper elevation={3} className="p-6">
                <Typography variant="h5">Patient Details</Typography><br />
                <Typography><strong>Patient Name :</strong> {patient.PatientName}</Typography>
                <Typography><strong>Gender :</strong> {patient.Gender}</Typography>
                <Typography><strong>Date_of_birth :</strong> {formattedDate}</Typography>
                <Typography><strong>Address :</strong> {patient.Address}</Typography>
                <Typography><strong>Phone_Number:</strong> {patient.Phone_Number}</Typography>
                <br /><br />
            </Paper>

            <Paper elevation={3} className="p-6">
                <Typography variant="h6" className="mb-4">Assigned Doctors</Typography>
                {doctorHistory.length > 0 ? (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Physician ID</TableCell>
                                <TableCell>Physician Name</TableCell>
                                <TableCell>Physician phone_number</TableCell>
                                <TableCell>Physician Specialty</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {doctorHistory.map((doc, index) => (
                                <TableRow key={index}>
                                    <TableCell>{doc.Primary_Physician_ID}</TableCell>
                                    <TableCell>{doc.Name}</TableCell>
                                    <TableCell>{doc.phone_number}</TableCell>
                                    <TableCell>{doc.Specialty}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            disabled={deletingIndex === index}
                                            onClick={() => handleRemoveDoctor(doc.Primary_Physician_ID, index)}
                                        >
                                            {deletingIndex === index ? 'Removing...' : 'Remove'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Typography>No doctor assigned yet.</Typography>
                )}
            </Paper>

            <Paper elevation={3} className="p-6 col-span-1">
                <Typography variant="h6" className="mb-4">Assign New Doctor</Typography>
                <FormControl fullWidth className="mb-4">
                    <InputLabel>Select Doctor</InputLabel>
                    <Select
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        label="Select Doctor"
                    >
                        {availableDoctors.map((doc, idx) => (
                            <MenuItem key={idx} value={doc.Physician_ID}>
                            (Name: {doc.Name} ) (ID: {doc.Physician_ID}) (AvailableSlot: {doc.AvailableSlot}) (Specialities: {doc.Specialty})

                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#4CAF50',
                        '&:hover': { backgroundColor: '#43A047' }
                    }}
                    onClick={handleAssignDoctor}
                    disabled={!selectedDoctor || assigning}
                >
                    {assigning ? 'Assigning...' : 'Assign Doctor'}
                </Button>
            </Paper>

            <div className="col-span-full mt-4">
                <Button variant="outlined" onClick={() => navigate('/view_inpatient')}>
                    Back to InPatient Management
                </Button>
            </div>
        </div>
    );
};

export default AddRemoveDoctor;
