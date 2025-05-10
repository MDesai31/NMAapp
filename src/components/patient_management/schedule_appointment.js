import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
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
import { DateFnsUtils } from '@mui/lab'; // Import the DateFns adapter
import { format } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled } from '@mui/material/styles'; // Import styled

// Extend FormControl and override the width.
const FullWidthFormControl = styled(FormControl)({
    width: '20%', // Make the FormControl take full width
    minWidth: '200px', // Ensure it has a minimum width
});

const ScheduleAppointment = () => {
    const [patientName, setPatientName] = useState('');
    const [patientExists, setPatientExists] = useState(null);
    const [date, setDate] = useState(null); // Changed type to Date
    const [shiftType, setShiftType] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [physicians, setPhysicians] = useState([]);
    const [selectedPhysicianName, setSelectedPhysicianName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch physicians
        useEffect(() => {
        const fetchPhysicians = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:9000/api/physicians');
                if (!response.ok) {
                    throw new Error('Failed to fetch physicians');
                }
                const data = await response.json();
                setPhysicians(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchPhysicians();
    }, []);

    const checkPatient = async () => {
        if (!patientName.trim()) {
            setError('Please enter a patient name to check.');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:9000/api/checkPatient/${patientName}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setPatientExists(false);
                    setError(`Patient "${patientName}" not found.  Please add the patient.`);
                }
                else {
                    throw new Error("Error checking patient")
                }

            } else {
                setPatientExists(true);
            }
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleDateChange = (newDate) => { // Changed parameter type
        setDate(newDate);
    };

      const handleShiftTypeChange = (event) => {
        setShiftType(event.target.value);
    };

    const fetchAvailableSlots = async () => {
        if (!date || !shiftType || !selectedPhysicianName) {
            setError('Please select a date, shift type and physician.');
            return;
        }
        setError(null);
        setLoading(true);

        const formattedDate =  date.toISOString().split('T')[0]; // Format the date using toISOString()
        //const formattedDate = format(date, 'yyyy-MM-dd'); // Format the date  //Removed

        try {
            const response = await fetch(
                `http://localhost:9000/api/appointments/slots?date=${formattedDate}&shiftType=${shiftType}&physicianName=${selectedPhysicianName}`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch available slots.');
            }
            const data = await response.json();
            console.log(data)
            setAvailableSlots(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

      const handleScheduleAppointment = async () => {
        if (selectedSlot === null) {
            setError('Please select a time slot.');
            return;
        }
        // console.log(selectedSlot)
        setError(null);
        setLoading(true);
        const formattedDate = date.toISOString().split('T')[0]; // Format the date using toISOString()
       // const formattedDate = format(date, 'yyyy-MM-dd');
        try {
            const response = await fetch('http://localhost:9000/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patientName,
                    date: formattedDate,
                    shiftType,
                    timeSlot: selectedSlot,
                    physicianName: selectedPhysicianName
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to schedule appointment.');
            }
            setLoading(false);
            alert('Appointment scheduled successfully!'); // Basic feedback
            navigate('/patient'); // Redirect
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
      if (patientExists === false) {
        navigate('/insert_patient');
      }
    }, [patientExists, navigate]);


    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="p-4 md:p-8">
                <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-gray-800">Schedule Appointment</h1>

                <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <TextField
                        label="Patient Name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full sm:w-auto"
                        placeholder="Enter patient name"
                        disabled={loading}
                    />
                    <Button onClick={checkPatient} variant="contained" disabled={loading} className="w-full sm:w-auto">
                        {loading ? 'Checking...' : 'Check Patient'}
                    </Button>
                </div>

                {patientExists === false && (
                    <Alert severity="error" className="mb-4">
                        <AlertTitle>Patient Not Found</AlertTitle>
                        {/* <AlertDescription>
                            {`Patient "${patientName}" does not exist. Please insert the patient first.`}
                        </AlertDescription> */}
                    </Alert>
                )}

                {patientExists === true && (
                    <>
                        <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <FullWidthFormControl className="w-full sm:w-auto">
                                <InputLabel id="physician-name-label">Physician Name</InputLabel>
                                <Select
                                    labelId="physician-name-label"
                                    id="physician-name-select"
                                    value={selectedPhysicianName}
                                    onChange={(e) => setSelectedPhysicianName(e.target.value)}
                                    label="Physician Name"
                                    disabled={loading}

                                >
                                    <MenuItem value="">Select a Physician</MenuItem>
                                    {physicians.map((doctor) => (
                                        <MenuItem key={doctor.Employee_ID} value={doctor.Name}>
                                            {doctor.Name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FullWidthFormControl>
                            <FullWidthFormControl className="w-full sm:w-auto">
                                <InputLabel id="shift-type-label">Shift Type</InputLabel>
                                <Select
                                    labelId="shift-type-label"
                                    id="shift-type-select"
                                    value={shiftType}
                                    onChange={handleShiftTypeChange}
                                    label="Shift Type"
                                    disabled={loading}
                                >
                                    <MenuItem value="">Select Shift</MenuItem>
                                    <MenuItem value="Day">Day</MenuItem>
                                    <MenuItem value="Night">Night</MenuItem>
                                </Select>
                            </FullWidthFormControl>
                            <DatePicker
                                label="Date"
                                value={date}
                                onChange={handleDateChange}
                                renderInput={(params) => (
                                    <TextField {...params} className="w-full sm:w-auto" disabled={loading} />
                                )}
                            />
                            <Button onClick={fetchAvailableSlots} variant="contained" disabled={loading} className="w-full sm:w-auto">
                                {loading ? 'Loading...' : 'Check Slots'}
                            </Button>
                        </div>

                        {error && (
                            <Alert severity="error" className="mb-4">
                                <AlertTitle>Error</AlertTitle>
                                {/* <AlertDescription>{error}</AlertDescription> */}
                            </Alert>
                        )}

                        {availableSlots && availableSlots.length > 0 && (
                            <TableContainer component={Paper} className="max-h-[400px] w-full mb-4">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="font-bold">Time</TableCell>
                                            <TableCell className="font-bold">Slot</TableCell>
                                            <TableCell className="font-bold">Available</TableCell>
                                            <TableCell className="font-bold">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {availableSlots.map((slot) => (
                                            <TableRow key={slot.slot_number}>
                                                <TableCell>{slot.time}</TableCell>
                                                <TableCell>{slot.slot_number}</TableCell>
                                                <TableCell>{slot.available ? 'Yes' : 'No'}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outlined"
                                                        disabled={!slot.available || loading}
                                                        onClick={() => setSelectedSlot(slot.slot_number)}
                                                    >
                                                        {slot.available ? 'Select' : 'Unavailable'}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                        {availableSlots && availableSlots.length > 0 && (
                        <Button onClick={handleScheduleAppointment} variant="contained" disabled={loading || selectedSlot === null} className="w-full sm:w-auto">
                            {loading ? 'Scheduling...' : 'Schedule Appointment'}
                        </Button>
                        )}
                    </>
                )}
            </div>
        </LocalizationProvider>
    );
};

export default ScheduleAppointment;