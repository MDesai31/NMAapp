import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';

const ViewInpatients = () => {
    const [inpatients, setInpatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPatientName, setSelectedPatientName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:9000/api/inpatients');
                const data = await response.json();
                setInpatients(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load InPatients data. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEditRoom = (inpatient) => {
        navigate(`/add_remove_room/${inpatient.Patient_ID}`);
    };
    const handleEditDoctor = (inpatient) => {
        navigate(`/add_remove_doctor/${inpatient.Patient_ID}`);
    };
    const handleEditNurse = (inpatient) => {
        navigate(`/add_remove_nurse/${inpatient.Patient_ID}`);
    };

    // 🔍 Memoized filter logic
    const filteredInpatients = useMemo(() => {
        if (!selectedPatientName) return inpatients;
        return inpatients.filter((i) => i.PatientName === selectedPatientName);
    }, [selectedPatientName, inpatients]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                Loading inpatients data...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-lg" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    if (!inpatients || inpatients.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-lg" role="alert">
                    <strong className="font-bold">No inpatients Found! </strong>
                    <span className="block sm:inline">There are no inpatients in the database.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            {/* Header and filter row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2 md:mb-0">
                    Inpatient Information
                </h1>

                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="inpatient-filter-label">Filter by Patient Name</InputLabel>
                    <Select
                        labelId="inpatient-filter-label"
                        value={selectedPatientName}
                        label="Filter by Patient Name"
                        onChange={(e) => setSelectedPatientName(e.target.value)}
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        {inpatients.map((patient) => (
                            <MenuItem key={patient.PatientName} value={patient.PatientName}>
                                {patient.PatientName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <TableContainer component={Paper} className="max-h-[400px] w-full">
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell className="font-bold">PatientName</TableCell>
                            <TableCell className="font-bold">PhysicianName</TableCell>
                            <TableCell className="font-bold">NurseName</TableCell>
                            <TableCell className="font-bold">Admission_Date</TableCell>
                            <TableCell className="font-bold">Nursing_Unit</TableCell>
                            <TableCell className="font-bold">Room_No</TableCell>
                            <TableCell className="font-bold">Bed_No</TableCell>
                            <TableCell className="font-bold">Wing</TableCell>
                            <TableCell className="font-bold">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
    {filteredInpatients.map((inpatient) => {
        const formattedDate = new Date(inpatient.Admission_Date).toISOString().split('T')[0];

        return (
            <TableRow key={inpatient.PatientName}>
                <TableCell>{inpatient.PatientName}</TableCell>
                <TableCell>{inpatient.PhysicianName}</TableCell>
                <TableCell>{inpatient.NurseName}</TableCell>
                <TableCell>{formattedDate}</TableCell>
                <TableCell>{inpatient.Nursing_Unit}</TableCell>
                <TableCell>{inpatient.Room_No}</TableCell>
                <TableCell>{inpatient.Bed_No}</TableCell>
                <TableCell>{inpatient.Wing}</TableCell>
                <TableCell>
                    <div className="flex flex-col gap-1 md:flex-row md:gap-2">
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ backgroundColor: '#FFF9C4', color: 'black' }}
                            onClick={() => handleEditRoom(inpatient)}
                        >
                            Add/Remove Room
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ backgroundColor: '#4CAF50', color: 'black' }}
                            onClick={() => handleEditDoctor(inpatient)}
                        >
                            Add/Remove Doctor
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ backgroundColor: 'orange', color: 'black' }}
                            onClick={() => handleEditNurse(inpatient)}
                        >
                            Add/Remove Nurse
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
        );
    })}
</TableBody>
                </Table>
            </TableContainer>

            <div className="mt-4 md:mt-6">
                <Button variant="outlined" onClick={() => navigate('/inpatient')}>
                    Back to Inpatient Management
                </Button>
            </div>
        </div>
    );
};

export default ViewInpatients;
