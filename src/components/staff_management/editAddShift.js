import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Paper,
    Typography,
    CircularProgress,
    MenuItem,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const shiftOptions = ['Day', 'Evening', 'Night', 'On Call', 'Off Duty'];

const EditAddShift = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [staff, setStaff] = useState(null);
    const [newShift, setNewShift] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await fetch(`http://localhost:9000/api/staffs/${id}`);
                if (!response.ok) throw new Error('Staff not found');
                const data = await response.json();
                setStaff(data);
                setNewShift(data.Job_Shift || '');
                setLoading(false);
            } catch (err) {
                console.error(err);
                alert('Failed to fetch staff info.');
                setLoading(false);
            }
        };
        fetchStaff();
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`http://localhost:9000/api/staffs/${id}/shift`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Job_Shift: newShift,
                    Date: selectedDate.toISOString().split('T')[0], // Optional: adapt if backend expects this
                }),
            });

            if (!response.ok) throw new Error('Failed to update shift');

            alert('Shift updated successfully!');
            navigate('/view_staff');
        } catch (err) {
            console.error(err);
            alert('Error updating shift.');
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
        <div className="p-4 md:p-8">
            <Paper elevation={3} className="p-6">
                <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
                    Staff Details for {staff.Name} <br /><br />
                </Typography>

                <Typography><strong>Employee ID:</strong> {staff.Employee_ID}</Typography>
                <Typography><strong>SSN:</strong> {staff.SSN}</Typography>
                <Typography><strong>Gender:</strong> {staff.Gender}</Typography>
                <Typography><strong>Address:</strong> {staff.Address}</Typography>
                <Typography><strong>Phone Number:</strong> {staff.Phone_Number}</Typography>
                <Typography><strong>Personnel Type:</strong> {staff.Personnel_Type}</Typography>
                <Typography><strong>Chief of Staff:</strong> {staff.Is_Chief_Of_Staff ? 'Yes' : 'No'}</Typography>
                <Typography className="mb-4"><strong>Current Job Shift:</strong> {staff.Job_Shift || 'N/A'}</Typography>

                <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
                    <br /><br />Edit/Add Shift for {staff.Name}<br /><br />
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
                    label="New Job Shift"
                    value={newShift}
                    onChange={(e) => setNewShift(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    fullWidth
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
        </div>
    );
};

export default EditAddShift;
