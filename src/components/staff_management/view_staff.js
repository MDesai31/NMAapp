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

const ViewStaffs = () => {
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:9000/api/staffs');
                const data = await response.json();
                setStaffs(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load staff data. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const uniqueTypes = useMemo(() => [...new Set(staffs.map(s => s.Personnel_Type))], [staffs]);

    const filteredStaffs = useMemo(() => {
        return selectedType
            ? staffs.filter(s => s.Personnel_Type === selectedType)
            : staffs;
    }, [staffs, selectedType]);

    const handleEditShift = (staffs) => {
        navigate(`/editAddShift/${staffs.Employee_ID}`);
    };

    const handleRemove = async (employeeId) => {
        console.log('🔍 Attempting to delete staff with Employee_ID:', employeeId);

        if (!window.confirm('Are you sure you want to delete this staff member?')) return;

        try {
            const response = await fetch(`http://localhost:9000/api/removestaff/${employeeId}`, {
                method: 'DELETE',
            });
            console.log('📡 Server responded with status:', response.status);

            if (response.ok) {
                setStaffs(prev => prev.filter(s => s.Employee_ID !== employeeId));
            } else {
                alert('Failed to delete staff member.');
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting staff member.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                Loading staff data...
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

    if (!staffs || staffs.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-lg" role="alert">
                    <strong className="font-bold">No Staff Found! </strong>
                    <span className="block sm:inline">There are no staffs in the database.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            {/* Header and filter row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2 md:mb-0">
                    Staff Information
                </h1>

                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="staff-type-label">Filter by Staff Type</InputLabel>
                    <Select
                        labelId="staff-type-label"
                        value={selectedType}
                        label="Filter by Staff Type"
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <MenuItem value="">All Types</MenuItem>
                        {uniqueTypes.map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <TableContainer component={Paper} className="max-h-[400px] w-full">
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell className="w-[80px] font-bold">Employee_ID</TableCell>
                            <TableCell className="font-bold">Name</TableCell>
                            <TableCell className="font-bold">Gender</TableCell>
                            <TableCell className="font-bold">Address</TableCell>
                            <TableCell className="font-bold">Phone Number</TableCell>
                            <TableCell className="font-bold">SSN</TableCell>
                            <TableCell className="font-bold">Personnel_Type</TableCell>
                            <TableCell className="font-bold">Is_Chief_Of_Staff</TableCell>
                            <TableCell className="font-bold">Job_Shift</TableCell>
                            <TableCell className="font-bold">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStaffs.map((personnel) => (
                            <TableRow key={personnel.Employee_ID}>
                                <TableCell>{personnel.Employee_ID}</TableCell>
                                <TableCell>{personnel.Name}</TableCell>
                                <TableCell>{personnel.Gender}</TableCell>
                                <TableCell>{personnel.Address}</TableCell>
                                <TableCell>{personnel.Phone_Number}</TableCell>
                                <TableCell>{personnel.SSN}</TableCell>
                                <TableCell>{personnel.Personnel_Type}</TableCell>
                                <TableCell>{personnel.Is_Chief_Of_Staff ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{personnel.Job_Shift}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1 md:flex-row md:gap-2">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => handleEditShift(personnel)}
                                        >
                                            Edit/Add Shift
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => handleRemove(personnel.Employee_ID)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="mt-4 md:mt-6">
                <Button variant="outlined" onClick={() => navigate('/staff')}>
                    Back to Staff Management
                </Button>
            </div>
        </div>
    );
};

export default ViewStaffs;
