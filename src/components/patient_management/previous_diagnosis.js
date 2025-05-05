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
import { Alert, AlertTitle} from '@mui/material'; // Import Alert for error display

const PreviousDiagnosis = () => {
    const [patientName, setPatientName] = useState('');
    const [diagnoses, setDiagnoses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const handleSearch = async () => {
        setError(null); // Clear any previous error
        if (!patientName.trim()) {
            setError('Please enter a patient name.');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:9000/api/diagnoses/${patientName}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setError(`No diagnoses found for patient: ${patientName}`);
                }
                else {
                  throw new Error(`Failed to fetch diagnoses: ${response.status}`);
                }
                setLoading(false);
                return;
            }
            const data = await response.json();
            if (data && data.length > 0){
              setDiagnoses(data);
            }
            else{
              setError(`No diagnoses found for patient: ${patientName}`);
            }

            setLoading(false);
        } catch (err) {
            setError(err.message || 'An error occurred while fetching diagnoses.');
            setLoading(false);
        }
    };

    useEffect(() => {
        // Clear diagnoses when component loads or patientName changes
        setDiagnoses([]);
    }, [patientName]);

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-gray-800">Previous Diagnoses</h1>

            <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <TextField
                    label="Patient Name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full sm:w-auto"
                    placeholder="Enter patient name"
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

            {loading && <p>Loading diagnoses...</p>}

            {diagnoses && diagnoses.length > 0 && (
                <TableContainer component={Paper} className="max-h-[400px] w-full">
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell className="font-bold">Illness Description</TableCell>
                                <TableCell className="font-bold">HDL</TableCell>
                                <TableCell className="font-bold">LDL</TableCell>
                                <TableCell className="font-bold">Triglyceride</TableCell>
                                 <TableCell className="font-bold">Heart Risk Category</TableCell>
                                <TableCell className="font-bold">Cholesterol/HDL Ratio</TableCell>
                                <TableCell className="font-bold">Total Cholesterol</TableCell>
                                <TableCell className="font-bold">Blood Type</TableCell>
                                <TableCell className="font-bold">Blood Sugar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {diagnoses.map((diagnosis) => (
                                <TableRow key={diagnosis.illnessDescription}>
                                    <TableCell>{diagnosis.illnessDescription}</TableCell>
                                    <TableCell>{diagnosis.HDL}</TableCell>
                                    <TableCell>{diagnosis.LDL}</TableCell>
                                    <TableCell>{diagnosis.Triglyceride}</TableCell>
                                    <TableCell>{diagnosis.Heart_Risk_Category}</TableCell>
                                    <TableCell>{diagnosis.Cholesterol_HDL_Ratio}</TableCell>
                                    <TableCell>{diagnosis.Total_Cholesterol}</TableCell>
                                    <TableCell>{diagnosis.Blood_Type}</TableCell>
                                    <TableCell>{diagnosis.Blood_Sugar}</TableCell>
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

export default PreviousDiagnosis;