import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Paper,
    Typography,
    CircularProgress,
    MenuItem,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const shiftOptions = ['Day', 'Evening', 'Night', 'On Call', 'Off Duty'];

const EditAddShift = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [staff, setStaff] = useState(null);
    const [newShift, setNewShift] = useState('Day'); // Set default shift to 'Day'
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [shiftHistory, setShiftHistory] = useState([]);

    const fetchStaff = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:9000/api/staff/${id}`);
            if (!response.ok) throw new Error('Staff not found');
            const data = await response.json();
            setStaff(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch staff info.');
            setLoading(false);
        }
    }, [id]);

    const fetchShiftHistory = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:9000/api/staff/${id}/getshift-schedule`);
            if (!response.ok) throw new Error('Failed to fetch shift history');
            const data = await response.json();
            setShiftHistory(data);
        } catch (err) {
            console.error(err);
            alert('Could not fetch shift history.');
        }
    }, [id]);

    useEffect(() => {
        fetchStaff();
        fetchShiftHistory();
    }, [fetchStaff, fetchShiftHistory]); // Add dependencies here

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`http://localhost:9000/api/staff/${id}/Addshift-schedule`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shift_type: newShift,
                    shift_date: selectedDate.toISOString().split('T')[0],
                }),
            });

            if (!response.ok) throw new Error('Failed to save shift');

            alert('Shift added successfully!');
            fetchShiftHistory(); // Fetch shift history after saving
        } catch (err) {
            console.error(err);
            alert('Error saving shift.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (!staff) {
        return (
            <div className="p-4">
                <Typography color="error">Staff not found.</Typography>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Paper elevation={3} className="p-6">
                <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
                    Staff Information
                </Typography>
                <Typography><strong>Name:</strong> {staff.Name}</Typography>
                <Typography><strong>Employee ID:</strong> {staff.Employee_ID}</Typography>
                <Typography><strong>SSN:</strong> {staff.SSN}</Typography>
                <Typography><strong>Gender:</strong> {staff.Gender}</Typography>
                <Typography><strong>Address:</strong> {staff.Address}</Typography>
                <Typography><strong>Phone Number:</strong> {staff.Phone_Number}</Typography>
                <Typography><strong>Personnel Type:</strong> {staff.Personnel_Type}</Typography>
                <Typography><strong>Chief of Staff:</strong> {staff.Is_Chief_Of_Staff ? 'Yes' : 'No'}</Typography>
                <br></br>
                <Typography variant="h6" className="mt-6 mb-2 font-semibold text-gray-800">
                  <b> Add Shift  </b> <br></br>
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Select Date"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} fullWidth margin="normal" />
                        )}
                    />
                </LocalizationProvider>

                <TextField
                    select
                    label="Select Job Shift"
                    value={newShift}
                    onChange={(e) => setNewShift(e.target.value)}
                    margin="normal"
                    size="small"
                >
                    {shiftOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>

                <Typography className="mt-4">
                    <strong>Selected Date:</strong> {selectedDate.toDateString()}
                </Typography>
                <Typography>
                    <strong>Selected Shift:</strong> {newShift || 'N/A'}
                </Typography>

                <div className="flex gap-4 mt-4">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Shift'}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/view_staff')}>
                        Cancel
                    </Button>
                </div>
            </Paper>
            
            <Paper elevation={3} className="p-6 mt-6">
                <Typography variant="h6" className="mb-4 font-semibold text-gray-800">
                    Shift History
                </Typography>
                {shiftHistory.length > 0 ? (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Shift Date</TableCell>
                                <TableCell>Shift Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {shiftHistory.map((staff_shifts, index) => (
                                <TableRow key={index}>
                                    <TableCell>{new Date(staff_shifts.shift_date).toLocaleDateString()}</TableCell>
                                    <TableCell>{staff_shifts.shift_type}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Typography>No shifts scheduled yet.</Typography>
                )}
            </Paper>

            <div className="mt-4 md:mt-6">
                            <Button variant="outlined" onClick={() => navigate('/staff')}>
                                Back to Staff Management
                            </Button>
                        </div>
        </div>

        
    );
};

export default EditAddShift;
