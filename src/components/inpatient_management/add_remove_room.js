import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Button, Paper, Typography, CircularProgress,
    Table, TableHead, TableBody, TableRow, TableCell,
    MenuItem, Select, InputLabel, FormControl
} from '@mui/material';

const AddRemoveRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [patientRoom, setPatientRoom] = useState(null);
    const [roomHistory, setRoomHistory] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [loading, setLoading] = useState(true);
    const [deletingIndex, setDeletingIndex] = useState(null);
    const [assigning, setAssigning] = useState(false);

    const fetchPatientRoom = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:9000/api/inpatients/${id}`);
            if (!res.ok) throw new Error('Failed to fetch patient details');
            const data = await res.json();
            setPatientRoom(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const fetchPatientRoomHistory = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:9000/api/inpatients/${id}/room`);
            const data = await res.json();

            if (!data || (Array.isArray(data) && data.length === 0)) {
                setRoomHistory([]);
                return [];
            }

            const history = Array.isArray(data) ? data : [data];
            setRoomHistory(history);
            return history;
        } catch (err) {
            console.error(err);
            setRoomHistory([]);
            return [];
        }
    }, [id]);

    const fetchAvailableRooms = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:9000/api/rooms`);
            const data = await res.json();
            const available = data.filter(r => r.Is_Available);
            setAvailableRooms(available);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const handleDeleteRoom = async (Room_No, Bed_No, Wing, index) => {
        setDeletingIndex(index);
        try {
            const response = await fetch(`http://localhost:9000/api/inpatients/${id}/room`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Room_No, Bed_No, Wing }),
            });

            if (!response.ok) throw new Error('Delete failed');

            const updatedHistory = await fetchPatientRoomHistory();
            if (updatedHistory.length === 0) {
                setRoomHistory([]);
            }

            await fetchPatientRoom();
            await fetchAvailableRooms();
        } catch (err) {
            alert('Failed to delete room.');
        } finally {
            setDeletingIndex(null);
        }
    };

    const handleAssignRoom = async () => {
        if (!selectedRoom) return;
        const [Room_No, Bed_No, Wing] = selectedRoom.split('|');
        setAssigning(true);
        try {
            const res = await fetch(`http://localhost:9000/api/inpatients/${id}/addroom`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Room_No, Bed_No, Wing }),
            });
            if (!res.ok) throw new Error('Failed to assign room');

            await fetchPatientRoomHistory();
            await fetchAvailableRooms();
            await fetchPatientRoom();
            setSelectedRoom('');
        } catch (err) {
            alert('Room assignment failed.');
        } finally {
            setAssigning(false);
        }
    };

    useEffect(() => {
        fetchPatientRoom();
        fetchPatientRoomHistory();
        fetchAvailableRooms();
    }, [fetchPatientRoom, fetchPatientRoomHistory, fetchAvailableRooms]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><CircularProgress /></div>;
    }

    if (!patientRoom) {
        return <div className="p-4"><Typography color="error">Inpatient details not found.</Typography></div>;
    }
    const formattedDate = new Date(patientRoom.Date_of_birth).toISOString().split('T')[0];

    return (
        <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Paper elevation={3} className="p-6">
                <Typography variant="h5">Patient Details</Typography><br />
                <Typography><strong>Patient Name :</strong> {patientRoom.PatientName}</Typography>
                <Typography><strong>Gender :</strong> {patientRoom.Gender}</Typography>
                <Typography><strong>Date_of_birth :</strong> {formattedDate}</Typography>
                <Typography><strong>Address :</strong> {patientRoom.Address}</Typography>
                <Typography><strong>Phone_Number:</strong> {patientRoom.Phone_Number}</Typography>
                <br /><br />
            </Paper>

            {/* Room History */}
            <Paper elevation={3} className="p-6"> 
                <Typography variant="h6" className="mb-4">Current Room and Bed Allotment</Typography>
                {roomHistory.length > 0 ? (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Room No</TableCell>
                                <TableCell>Bed No</TableCell>
                                <TableCell>Wing</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {roomHistory.map((room, index) => (
                                <TableRow key={index}>
                                    <TableCell>{room.Room_No}</TableCell>
                                    <TableCell>{room.Bed_No}</TableCell>
                                    <TableCell>{room.Wing}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            disabled={deletingIndex === index}
                                            onClick={() => handleDeleteRoom(room.Room_No, room.Bed_No, room.Wing, index)}
                                        >
                                            {deletingIndex === index ? 'Deleting...' : 'Delete'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Typography>No rooms allocated yet.</Typography>
                )}
            </Paper>

            {/* Room Assignment */}
            <Paper elevation={3} className="p-6 col-span-1">
            <br></br><br></br> <Typography variant="h6" className="mb-4">Assign New Room</Typography>
                <FormControl fullWidth className="mb-4">
                    <InputLabel>Select Room</InputLabel>
                    <Select
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        label="Select Room"
                    >
                        {availableRooms.map((room, idx) => (
                            <MenuItem
                                key={`${room.Room_No}-${room.Bed_No}-${room.Wing}-${idx}`}
                                value={`${room.Room_No}|${room.Bed_No}|${room.Wing}`}
                            >
                                Room {room.Room_No} - Bed {room.Bed_No} ({room.Wing})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAssignRoom}
                    disabled={!selectedRoom || assigning}
                >
                    {assigning ? 'Assigning...' : 'Assign Room'}
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

export default AddRemoveRoom;
