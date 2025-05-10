import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { Paper } from '@mui/material';
import { Alert, AlertTitle, AlertDescription } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText} from '@mui/material';


const SchedulePerDoctor = () => {
    const [selectedDoctorName, setSelectedDoctorName] = useState('');
    const [doctorSchedule, setDoctorSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [physicians, setPhysicians] = useState([]); // State to store physicians

    // Fetch the list of physicians on component mount
    useEffect(() => {
        const fetchPhysicians = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:9000/api/physicians'); // New endpoint to fetch physicians
                if (!response.ok) {
                    throw new Error('Failed to fetch physicians.');
                }
                const data = await response.json();
                setPhysicians(data);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'An error occurred while fetching the list of physicians.');
                setLoading(false);
            }
        };
        fetchPhysicians();
    }, []);

    const handleSearch = async () => {
        if (!selectedDoctorName.trim()) {
            setError('Please select a Doctor Name.');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:9000/api/schedule/doctorName/${selectedDoctorName}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setError(`No schedule found for Doctor Name: ${selectedDoctorName}`);
                } else {
                    throw new Error(`Failed to fetch schedule: ${response.status}`);
                }
                setLoading(false);
                return;
            }
            const data = await response.json();
            if (data && data.length > 0) {
                setDoctorSchedule(data);
            }
            else{
                setError(`No schedule found for Doctor Name: ${selectedDoctorName}`);
            }
            setLoading(false);
        } catch (err) {
            setError(err.message || 'An error occurred while fetching the schedule.');
            setLoading(false);
        }
    };

    useEffect(() => {
        setDoctorSchedule([]);
    }, [selectedDoctorName]);

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-gray-800">Doctor Schedule</h1>

            <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <FormControl className="w-full sm:w-auto" error={!!error && !selectedDoctorName}>
                    <InputLabel id="doctor-name-label">Doctor Name</InputLabel>
                    <Select
                        labelId="doctor-name-label"
                        id="doctor-name-select"
                        value={selectedDoctorName}
                        onChange={(e) => setSelectedDoctorName(e.target.value)}
                        label="Doctor Name"
                        
                    >
                        <MenuItem value="">Select a Doctor</MenuItem>
                        {physicians.map((doctor) => (
                            <MenuItem key={doctor.Employee_ID} value={doctor.Name}>
                                {doctor.Name}
                            </MenuItem>
                        ))}
                    </Select>
                    {!!error && !selectedDoctorName && <FormHelperText>Please select a doctor</FormHelperText>}
                </FormControl>
                <Button onClick={handleSearch} variant="contained" disabled={loading} className="w-full sm:w-auto">
                    {loading ? 'Loading...' : 'Search'}
                </Button>
            </div>

            {error && (
                <Alert severity="error" className="mb-4">
                    <AlertTitle>Error</AlertTitle>
                    {/* <AlertDescription>{error}</AlertDescription> */}
                </Alert>
            )}

            {loading && <p>Loading doctor schedule...</p>}

            {doctorSchedule && doctorSchedule.length > 0 && (
                <TableContainer component={Paper} className="max-h-[400px] w-full">
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell className="font-bold">Date</TableCell>
                                <TableCell className="font-bold">Shift Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {doctorSchedule.map((schedule) => (
                                <TableRow key={schedule.shift_date}>
                                    <TableCell>{schedule.shift_date}</TableCell>
                                    <TableCell>{schedule.shift_type}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <div className="mt-4 md:mt-6">
                <Button
                    variant="outlined"
                    onClick={() => navigate('/patient')}
                >
                    Back to Patient Management
                </Button>
            </div>
        </div>
    );
};

export default SchedulePerDoctor;