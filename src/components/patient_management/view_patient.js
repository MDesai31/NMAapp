import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { Paper } from '@mui/material'; // For the table container
import { Button } from '@mui/material';

const ViewPatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:9000/api/patients');
                // if (!response.ok) {
                //     throw new Error(`Failed to fetch patients: ${response.status}`);
                // }
                const data = await response.json();
                console.log(data)
                setPatients(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                alert('Error!');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                Loading patient data...
            </div>
        );
    }

    // if (error) {
    //     return (
    //         <div className="flex items-center justify-center h-screen">
    //             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-lg" role="alert">
    //                 <strong className="font-bold">Error: </strong>
    //                 <span className="block sm:inline">{error}</span>
    //             </div>
    //         </div>
    //     );
    // }

    if (!patients || patients.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div  className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-lg" role="alert">
                    <strong className="font-bold">No Patients Found! </strong>
                    <span className="block sm:inline">There are no patients in the database.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-gray-800">
                Patient Information
            </h1>
            <TableContainer component={Paper} className="max-h-[400px] w-full">
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell className="w-[80px] md:w-[100px] font-bold">Patient ID</TableCell>
                            <TableCell className="font-bold">Name</TableCell>
                            <TableCell className="md:w-[80px] md:w-[100px] font-bold">Gender</TableCell>
                            <TableCell className="md:w-[150px] font-bold">Date of Birth</TableCell>
                            <TableCell className="font-bold">Address</TableCell>
                            <TableCell className="md:w-[150px] font-bold">Phone Number</TableCell>
                            <TableCell className="md:w-[120px] font-bold">SSN</TableCell>
                            <TableCell className="md:w-[150px] font-bold">Consultation Req.</TableCell>
                            <TableCell className="md:w-[150px] font-bold">Hospitalization Req.</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((patient) => (
                            <TableRow key={patient.Patient_ID}>
                                <TableCell>{patient.Patient_ID}</TableCell>
                                <TableCell>{patient.Name}</TableCell>
                                <TableCell>{patient.Gender}</TableCell>
                                <TableCell>{patient.Date_of_birth}</TableCell>
                                <TableCell>{patient.Address}</TableCell>
                                <TableCell>{patient.Phone_Number}</TableCell>
                                <TableCell>{patient.SSN}</TableCell>
                                <TableCell>{patient.Consultation_Req ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{patient.Hospitalization_Req ? 'Yes' : 'No'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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

export default ViewPatients;