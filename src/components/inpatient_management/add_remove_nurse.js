import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Button, Paper, Typography, CircularProgress,
    Table, TableHead, TableBody, TableRow, TableCell,
    MenuItem, Select, InputLabel, FormControl
} from '@mui/material';

const AddRemoveNurse = () => {
    const { id } = useParams(); // patient ID
    const navigate = useNavigate();

    const [patient, setPatient] = useState(null);
    const [assignedNurses, setAssignedNurses] = useState([]);
    const [availableNurses, setAvailableNurses] = useState([]);
    const [selectedNurse, setSelectedNurse] = useState('');
    const [loading, setLoading] = useState(true);
    const [deletingIndex, setDeletingIndex] = useState(null);
    const [assigning, setAssigning] = useState(false);

    const fetchPatientDetails = useCallback(async () => {
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

    const fetchAssignedNurses = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:9000/api/inpatients/${id}/nurses`);
            const data = await res.json();
            setAssignedNurses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setAssignedNurses([]);
        }
    }, [id]);

    const fetchAvailableNurses = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:9000/api/nurses`);
            const data = await res.json();

            // Ensure data is always an array
            setAvailableNurses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setAvailableNurses([]); // fallback to empty array
        }
    }, []);

    const handleRemoveNurse = async (nurseId, index) => {
        setDeletingIndex(index);
        try {
            const res = await fetch(`http://localhost:9000/api/inpatients/${id}/deletenurse`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Nurse_ID: nurseId }),
            });

            if (!res.ok) throw new Error('Remove failed');

            await fetchAssignedNurses();
            await fetchAvailableNurses();
        } catch (err) {
            alert('Failed to remove nurse.');
        } finally {
            setDeletingIndex(null);
        }
    };

    const handleAssignNurse = async () => {
        if (!selectedNurse) return;
        setAssigning(true);
        try {
            const res = await fetch(`http://localhost:9000/api/inpatients/${id}/addnurse`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Nurse_ID: selectedNurse }),
            });

            if (!res.ok) throw new Error('Failed to assign nurse');

            await fetchAssignedNurses();
            await fetchAvailableNurses();
            setSelectedNurse('');
        } catch (err) {
            alert('Nurse assignment failed.');
        } finally {
            setAssigning(false);
        }
    };

    useEffect(() => {
        fetchPatientDetails();
        fetchAssignedNurses();
        fetchAvailableNurses();
    }, [fetchPatientDetails, fetchAssignedNurses, fetchAvailableNurses]);

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

            {/* Nurse History */}
            <Paper elevation={3} className="p-6">
                
                <Typography variant="h6" className="mb-4">Assigned Nurses</Typography>
                {assignedNurses.length > 0 ? (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nurse ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Grade</TableCell>
                                <TableCell>YOE</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {assignedNurses.map((nurse, index) => (
                                <TableRow key={nurse.Nurse_ID}>
                                    <TableCell>{nurse.Nurse_ID}</TableCell>
                                    <TableCell>{nurse.Name}</TableCell>
                                    <TableCell>{nurse.Grade}</TableCell>
                                    <TableCell>{nurse.YOE}</TableCell>

                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            disabled={deletingIndex === index}
                                            onClick={() => handleRemoveNurse(nurse.Nurse_ID, index)}
                                        >
                                            {deletingIndex === index ? 'Removing...' : 'Remove'}
                                        </Button> 
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Typography>No nurses assigned yet.</Typography>
                )} <br></br><br></br>
            </Paper> 

            {/* Assign Nurse */}
            <Paper elevation={3} className="p-6 col-span-1">
        
                <Typography variant="h6" className="mb-4">Assign New Nurse</Typography>
                <FormControl fullWidth className="mb-4">
                    <InputLabel>Select Nurse</InputLabel>
                    <Select
                        value={selectedNurse}
                        onChange={(e) => setSelectedNurse(e.target.value)}
                        label="Select Nurse"
                    >
                        {Array.isArray(availableNurses) && availableNurses.map((nurse) => (
                            <MenuItem
                                key={nurse.Nurse_ID}
                                value={nurse.Nurse_ID}
                            >
                               (Name: {nurse.Name} ) (ID: {nurse.Nurse_ID}) (AvailableSlot: {nurse.AvailableSlot}))
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAssignNurse}
                    disabled={!selectedNurse || assigning}
                >
                    {assigning ? 'Assigning...' : 'Assign Nurse'}
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

export default AddRemoveNurse;
