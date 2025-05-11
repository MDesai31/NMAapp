import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { Paper } from '@mui/material';
import { Alert, AlertTitle } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled } from '@mui/material/styles'; // Import styled

// Extend FormControl and override the width.
const FullWidthFormControl = styled(FormControl)({
    width: '20%', // Make the FormControl take full width
    minWidth: '200px', // Ensure it has a minimum width
});

// Helper function to get operation theaters
const getOperationTheaters = () => {
    return [
        { id: 'OT-101', name: 'Operating Theater 101' },
        { id: 'OT-102', name: 'Operating Theater 102' },
        { id: 'OT-103', name: 'Operating Theater 103' },
    ];
};

const ScheduledSurgery = () => {
    const [date, setDate] = useState(null);
    const [surgeonName, setSurgeonName] = useState('');
    const [patientName, setPatientName] = useState('');
    const [surgerySchedule, setSurgerySchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [surgeons, setSurgeons] = useState([]); // For Surgeon dropdown
    const navigate = useNavigate();
    const [operationTheater, setOperationTheater] = useState('');

    // Fetch surgeons for the dropdown
    useEffect(() => {
        const fetchSurgeons = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:9000/api/surgeons'); // Endpoint to fetch surgeons
                if (!response.ok) {
                    throw new Error('Failed to fetch surgeons');
                }
                const data = await response.json();
                setSurgeons(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchSurgeons();
    }, []);

    const handleSearch = async () => {
        setError(null);
        setLoading(true);

        const formattedDate = date ? format(date, 'yyyy-MM-dd') : ''; // Use date-fns format

        try {
            const response = await fetch(
                `http://localhost:9000/api/surgerySchedule?date=${formattedDate}&surgeonName=${surgeonName}&patientName=${patientName}&operationTheater=${operationTheater}`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch surgery schedule.');
            }
            const data = await response.json();
            if (data && data.length > 0) {
                setSurgerySchedule(data);
            }
            else{
                setError("No matching entries found")
            }
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        setSurgerySchedule([]);
    }, [date, surgeonName, patientName, operationTheater]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="p-4 md:p-8">
                <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-gray-800">Scheduled Surgeries</h1>

                <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <DatePicker
                        label="Date"
                        value={date}
                        onChange={setDate}
                        renderInput={(params) => (
                            <TextField {...params} className="w-full sm:w-auto" placeholder="YYYY-MM-DD" />
                        )}
                    />
                     <FullWidthFormControl className="w-full sm:w-auto">
                        <InputLabel id="surgeon-name-label">Surgeon Name</InputLabel>
                        <Select
                            labelId="surgeon-name-label"
                            id="surgeon-name-select"
                            value={surgeonName}
                            onChange={(e) => setSurgeonName(e.target.value)}
                            label="Surgeon Name"
                            
                        >
                            <MenuItem value="">All Surgeons</MenuItem>
                            {surgeons.map((surgeon) => (
                                <MenuItem key={surgeon.Employee_ID} value={surgeon.Name}>
                                    {surgeon.Name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FullWidthFormControl>
                    <TextField
                        label="Patient Name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full sm:w-auto"
                        placeholder="Enter patient name"
                    />
                    <FullWidthFormControl className="w-full sm:w-auto">
                        <InputLabel id="operation-theater-label">Operation Theater</InputLabel>
                        <Select
                            labelId="operation-theater-label"
                            id="operation-theater-select"
                            value={operationTheater}
                            onChange={(e) => setOperationTheater(e.target.value)}
                            label="Operation Theater"
                        >
                            <MenuItem value="">All Theaters</MenuItem>
                            {getOperationTheaters().map((theater) => (
                                <MenuItem key={theater.id} value={theater.id}>
                                    {theater.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FullWidthFormControl>
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

                {loading && <p>Loading surgery schedule...</p>}

                {surgerySchedule && surgerySchedule.length > 0 && (
                    <TableContainer component={Paper} className="max-h-[400px] w-full">
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="font-bold">Surgery ID</TableCell>
                                    <TableCell className="font-bold">Surgery Name</TableCell>
                                    <TableCell className="font-bold">Patient Name</TableCell>
                                    <TableCell className="font-bold">Surgeon Name</TableCell>
                                    <TableCell className="font-bold">Nurse Names</TableCell>
                                    <TableCell className="font-bold">Date</TableCell>
                                    <TableCell className="font-bold">Operation Theatre</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {surgerySchedule.map((surgery) => (
                                    <TableRow key={surgery.Surgery_ID}>
                                        <TableCell>{surgery.Surgery_ID}</TableCell>
                                        <TableCell>{surgery.Name}</TableCell>
                                        <TableCell>{surgery.Patient_Name}</TableCell>
                                        <TableCell>{surgery.Surgeon_Name}</TableCell>
                                        <TableCell>{surgery.Nurse_Names}</TableCell>
                                        <TableCell>{surgery.Date}</TableCell>
                                        <TableCell>{surgery.Operation_theatre}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <div className="mt-4 md:mt-6">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/inpatient')}
                    >
                        Back to In-Patient Management
                    </Button>
                </div>
            </div>
        </LocalizationProvider>
    );
};

export default ScheduledSurgery;