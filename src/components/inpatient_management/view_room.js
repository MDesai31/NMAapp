import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, FormControlLabel, Checkbox
} from '@mui/material';

const ViewRooms = () => {
    const [Rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:9000/api/rooms');
                const data = await response.json();
                setRooms(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load Room details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredRooms = showOnlyAvailable
        ? Rooms.filter(room => room.Is_Available)
        : Rooms;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg font-semibold">Loading room data...</div>
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

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2 md:mb-0">
                    Room Availability
                </h1>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={showOnlyAvailable}
                            onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Show Only Available Rooms"
                />
            </div>

            <TableContainer component={Paper} className="max-h-[400px] w-full">
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell className="w-[80px] font-bold">Wing</TableCell>
                            <TableCell className="font-bold">Bed_No</TableCell>
                            <TableCell className="font-bold">Room_No</TableCell>
                            <TableCell className="font-bold">Is_Available</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRooms.map((Room_Arrangement, index) => (
                            <TableRow
                                key={`${Room_Arrangement.Wing}-${Room_Arrangement.Bed_No}-${Room_Arrangement.Room_No}-${index}`}
                            >
                                <TableCell>{Room_Arrangement.Wing}</TableCell>
                                <TableCell>{Room_Arrangement.Bed_No}</TableCell>
                                <TableCell>{Room_Arrangement.Room_No}</TableCell>
                                <TableCell>{Room_Arrangement.Is_Available ? 'Yes' : 'No'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="mt-4 md:mt-6">
                <Button variant="outlined" onClick={() => navigate('/inpatient')}>
                    Back to In Patient Management
                </Button>
            </div>
        </div>
    );
};

export default ViewRooms;
