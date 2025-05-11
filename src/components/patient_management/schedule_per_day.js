import React, { useState, useEffect} from 'react';
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
import { Alert, AlertTitle} from '@mui/material';

const SchedulePerDay = () => {
    const [date, setDate] = useState('');
    const [physicianSchedule, setPhysicianSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!date.trim()) {
            setError('Please enter a date.');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:9000/api/schedule/physicians/${date}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setError(`No physicians found scheduled for ${date}`);
                } else {
                    throw new Error(`Failed to fetch schedule: ${response.status}`);
                }
                setLoading(false);
                return;
            }
            const data = await response.json();
            if (data && data.length > 0) {
                setPhysicianSchedule(data);
            }
             else{
                  setError(`No physicians found scheduled for ${date}`);
            }
            setLoading(false);
        } catch (err) {
            setError(err.message || 'An error occurred while fetching the schedule.');
            setLoading(false);
        }
    };

    useEffect(() => {
        setPhysicianSchedule([]);
    }, [date]);

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-gray-800">Physician Schedule</h1>

            <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <TextField
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full sm:w-auto"
                    InputLabelProps={{ shrink: true }}
                    placeholder="YYYY-MM-DD"
                />
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

            {loading && <p>Loading physician schedule...</p>}

            {physicianSchedule && physicianSchedule.length > 0 && (
                <TableContainer component={Paper} className="max-h-[400px] w-full">
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell className="font-bold">Physician ID</TableCell>
                                <TableCell className="font-bold">Physician Name</TableCell>
                                <TableCell className="font-bold">Shift Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {physicianSchedule.map((schedule) => (
                                <TableRow key={schedule.Employee_ID}>
                                    <TableCell>{schedule.Employee_ID}</TableCell>
                                    <TableCell>{schedule.Name}</TableCell>
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

export default SchedulePerDay;