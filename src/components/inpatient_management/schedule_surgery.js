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
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { Alert, AlertTitle } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled } from '@mui/material/styles'; // Import styled
import dayjs from 'dayjs';

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
        { id: 'OT-104', name: 'Operating Theater 104' },
    ];
};

const ScheduleSurgery = () => {
    const [patientName, setPatientName] = useState('');
    const [surgeryType, setSurgeryType] = useState('');
    const [surgeon, setSurgeon] = useState('');
    const [date, setDate] = useState(dayjs());
    const [operationTheater, setOperationTheater] = useState('');
    const [patients, setPatients] = useState([]);
    const [surgeons, setSurgeons] = useState([]);
    const [availableNurses, setAvailableNurses] = useState([]);
    const [selectedNurses, setSelectedNurses] = useState([]);
    const [surgerySkills, setSurgerySkills] = useState([]);
    const [surgeonSkills, setSurgeonSkills] = useState([]);
    const [nurseSkills, setNurseSkills] = useState([]);
    const [inPatients, setInPatients] = useState([]); // Added state for in-patients
    const [numberOfNursesRequired, setNumberOfNursesRequired] = useState(1); // Track required nurses
    const [showAdditionalFields, setShowAdditionalFields] = useState(false); // Control visibility


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const surgeryTypeOptions = [
        { id: 1, name: 'Appendectomy', nursesRequired: 3 },
        { id: 2, name: 'Knee Arthroscopy', nursesRequired: 2 },
        { id: 3, name: 'Cataract Surgery', nursesRequired: 4 },
        { id: 4, name: 'Coronary Artery Bypass Grafting', nursesRequired: 3 },
        { id: 5, name: 'Hip Replacement', nursesRequired: 2 },
        { id: 6, name: 'Tonsillectomy', nursesRequired: 4 },
        { id: 7, name: 'Hernia Repair', nursesRequired: 3 },
        { id: 8, name: 'Laparoscopic Gallbladder Surgery', nursesRequired: 2 },
        { id: 9, name: 'Spinal Fusion', nursesRequired: 4 },
        { id: 10, name: 'Mastectomy', nursesRequired: 3 },
    ];

    // Fetch patients
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:9000/api/patients');
                if (!response.ok) {
                    throw new Error('Failed to fetch patients');
                }
                const data = await response.json();
                setPatients(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    // Fetch surgeons
    useEffect(() => {
        const fetchSurgeons = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:9000/api/surgeons');
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

    useEffect(() => {
        const fetchSurgerySkills = async () => {
            try {
                const response = await fetch('http://localhost:9000/api/surgery-skills');
                if (!response.ok) {
                    throw new Error('Failed to fetch surgery skills');
                }
                const data = await response.json();
                // console.log(data)
            } catch (error) {
                setError(error.message);
            }
        };

        const fetchSurgeonSkills = async () => {
            try {
                const response = await fetch('http://localhost:9000/api/surgeon-skills');
                if (!response.ok) {
                    throw new Error('Failed to fetch surgeon skills');
                }
                const data = await response.json();
                // console.log(data)
                setSurgeonSkills(data);
            } catch (error) {
                setError(error.message);
            }
        };

        // const fetchNurseSkills = async () => {
        //     try {
        //         const response = await fetch('http://localhost:9000/api/nurse-surgery-skills');
        //         if (!response.ok) {
        //             throw new Error('Failed to fetch nurse skills');
        //         }
        //         const data = await response.json();
        //         setNurseSkills(data);
        //     } catch (error) {
        //         setError(error.message);
        //     }
        // };
        fetchSurgerySkills();
        fetchSurgeonSkills();
        // fetchNurseSkills();
    }, []);

    // Fetch available nurses based on surgery type.
    useEffect(() => {
        const fetchAvailableNurses = async (selectedSurgeryType) => { // Added parameter
            if (selectedSurgeryType) {
                try {
                    setLoading(true);
                    // Assuming you have an endpoint to fetch nurses by surgery type
                    const response = await fetch(
                        `http://localhost:9000/api/nurses/surgeryType/${selectedSurgeryType}` // Use parameter
                    );
                    if (!response.ok) {
                        throw new Error("Failed to fetch available nurses.");
                    }
                    const data = await response.json();
                    setAvailableNurses(data);
                    setLoading(false);
                } catch (error) {
                    setError(error.message);
                    setLoading(false);
                }
            } else {
                setAvailableNurses([]); // Clear nurses if no surgery type is selected
            }
        };
        fetchAvailableNurses(surgeryType); // Call with current surgeryType
    }, [surgeryType]); // Depend on surgeryType

    // Fetch in-patients
    useEffect(() => {
        const fetchInPatients = async () => {
            try {
                const response = await fetch('http://localhost:9000/api/in-patients');
                if (!response.ok) {
                    throw new Error('Failed to fetch in-patients');
                }
                const data = await response.json();
                setInPatients(data);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchInPatients();
    }, []);

    // Update the number of nurses required when the surgery type changes
    useEffect(() => {
        if (surgeryType) {
            const selectedSurgery = surgeryTypeOptions.find((option) => option.id === parseInt(surgeryType, 10));
            if (selectedSurgery) {
                setNumberOfNursesRequired(selectedSurgery.nursesRequired);
            }
        } else {
            setNumberOfNursesRequired(1); // Or your default value
        }
    }, [surgeryType, surgeryTypeOptions]);


    const handleSchedule = async () => {
        setError(null);

        if (!patientName.trim()) {
            setError('Please enter patient name');
            return;
        }
        if (!surgeryType) {
            setError('Please select surgery type');
            return;
        }
        if (!surgeon) {
            setError('Please select a surgeon');
            return;
        }
        if (selectedNurses.length !== numberOfNursesRequired) {
            setError(`Please select exactly ${numberOfNursesRequired} nurses.`);
            return;
        }
        if (!date) {
            setError('Please select a date');
            return;
        }
        if (!operationTheater) {
            setError('Please select an operation theater');
            return;
        }

        const patient = patients.find(p => p.Name === patientName);
        if (!patient) {
            setError('Patient not found');
            return;
        }

        // Check if the patient is an in-patient
        const isPatientInpatient = inPatients.some(
            (inpatient) => inpatient.Patient_ID === patient.Patient_ID
        );

        // if (!isPatientInpatient) {
        //     setError('Patient is not an inpatient and cannot be scheduled for surgery.');
        //     navigate('/patient');
        //     return;
        // }

        // // Check if the selected surgeon has the required skills for the surgery
        // const surgeonHasRequiredSkills = surgeonSkills.some(
        //     (s) =>
        //         s.Surgeon_ID === surgeon && // Make sure you are comparing Surgeon_ID
        //         surgerySkills.some((skill) => skill.Surgery_ID === surgeryType)
        // );

        // if (!surgeonHasRequiredSkills) {
        //     setError('The selected surgeon does not have the required skills for this surgery.');
        //     return;
        // }

        // Check if the selected nurses have the required skills for the surgery
        // const nursesHaveRequiredSkills = selectedNurses.every((nurseId) => {
        //     return nurseSkills.some(
        //         (skill) =>
        //             skill.Nurse_ID === nurseId &&
        //             surgerySkills.some((s) => s.Surgery_ID === surgeryType)
        //     );
        // });

        // if (!nursesHaveRequiredSkills) {
        //     setError('At least one of the selected nurses does not have the required skills for this surgery.');
        //     return;
        // }
        
        try {
            setLoading(true);
            
            const formattedDate =  date.toISOString().split('T')[0];
            const response = await fetch('http://localhost:9000/api/schedule-a-surgery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    surgeryId: surgeryType,
                    patientId: patient.Patient_ID,
                    surgeonId: surgeon,
                    date: formattedDate,
                    operationTheater,
                    nurseIds: selectedNurses, // Include selected nurse IDs in the request
                }),
            });
            console.log('finished post request')
            if (!response.ok) {
                throw new Error('Failed to schedule surgery');
            }

            // const result = await response.json();
            alert('Surgery scheduled successfully!'); // Basic feedback
            navigate('/inpatient'); // Redirect

            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleNurseSelection = (nurseId) => {
        setSelectedNurses((prevSelected) =>
            prevSelected.includes(nurseId)
                ? prevSelected.filter((id) => id !== nurseId)
                : [...prevSelected, nurseId]
        );
    };

    const handlePatientAndSurgerySelection = (selectedSurgeryType) => { // Added parameter
        if (patientName.trim() && selectedSurgeryType) {
            setShowAdditionalFields(true);
            setSurgeryType(selectedSurgeryType); // Update the surgeryType
        } else {
            setShowAdditionalFields(false); // Hide if either is empty
            setSurgeryType('');
        }
    };

    // useEffects to filter surgeons and nurses based on selected surgeryType
    useEffect(() => {
        if (surgeryType) {
            // Fetch surgeons and nurses qualified for the selected surgeryType
            const fetchQualifiedSurgeons = async () => {
                try {
                    setLoading(true);
                    const response = await fetch(`http://localhost:9000/api/surgeons/surgeryType/${surgeryType}`); // Corrected endpoint
                    if (!response.ok) {
                        throw new Error('Failed to fetch qualified surgeons');
                    }
                    const data = await response.json();
                    // console.log(data)
                    setSurgeons(data); // Set qualified surgeons
                    setLoading(false);
                } catch (error) {
                    setError(error.message);
                    setLoading(false);
                }
            };

            const fetchQualifiedNurses = async () => {
                try {
                    setLoading(true);
                    const response = await fetch(`http://localhost:9000/api/nurses/surgeryType/${surgeryType}`);  // Corrected endpoint
                    if (!response.ok) {
                        throw new Error('Failed to fetch qualified nurses');
                    }
                    const data = await response.json();
                    setAvailableNurses(data); // Set qualified nurses
                    setLoading(false);
                } catch (error) {
                    setError(error.message);
                    setLoading(false);
                }
            };

            fetchQualifiedSurgeons();
            fetchQualifiedNurses();

            // Update required number of nurses
             const selectedSurgery = surgeryTypeOptions.find((option) => option.id === parseInt(surgeryType, 10));
            if (selectedSurgery) {
                setNumberOfNursesRequired(selectedSurgery.nursesRequired);
            }

        } else {
            // Reset surgeons and nurses if no surgery type is selected
            setSurgeons([]);
            setAvailableNurses([]);
            setNumberOfNursesRequired(1);
        }
    }, [surgeryType]);


    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="p-4 md:p-8">
                <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-gray-800">Schedule Surgery</h1>

                {/* Patient Selection */}
                <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <FullWidthFormControl className="w-full sm:w-auto" error={!!error && !patientName}>
                        <InputLabel id="patient-name-label">Patient Name</InputLabel>
                        <Select
                            labelId="patient-name-label"
                            id="patient-name-select"
                            value={patientName}
                            onChange={(e) => {
                                setPatientName(e.target.value);
                                handlePatientAndSurgerySelection(surgeryType); // Pass current surgeryType
                            }}
                            label="Patient Name"
                        >
                            <MenuItem value="">Select a Patient</MenuItem>
                            {patients.map((patient) => (
                                <MenuItem key={patient.Patient_ID} value={patient.Name}>
                                    {patient.Name}
                                </MenuItem>
                            ))}
                        </Select>
                        {!!error && !patientName && <FormHelperText>Please select a patient</FormHelperText>}
                    </FullWidthFormControl>
                </div>

                {/* Surgery Type Selection */}
                <div className="mb-4 md:mb-6">
                    <FormControl className="w-full" error={!!error && !surgeryType}>
                        <InputLabel id="surgery-type-label">Surgery Type</InputLabel>
                        <Select
                            labelId="surgery-type-label"
                            id="surgery-type-select"
                            value={surgeryType}
                            onChange={(e) => {
                                const selectedValue = e.target.value;
                                setSurgeryType(selectedValue); // Update local state
                                handlePatientAndSurgerySelection(selectedValue); // Pass selected value
                            }}
                            label="Surgery Type"
                        >
                            <MenuItem value="">Select a Surgery Type</MenuItem>
                            {surgeryTypeOptions.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {!!error && !surgeryType && <FormHelperText>Please select a surgery type</FormHelperText>}
                    </FormControl>
                </div>

                {/* Conditional rendering of additional fields */}
                {showAdditionalFields && (
                    <>
                        {/* Surgeon Selection */}
                        <div className="mb-4 md:mb-6">
                            <FormControl className="w-full" error={!!error && !surgeon}>
                                <InputLabel id="surgeon-label">Surgeon</InputLabel>
                                <Select
                                    labelId="surgeon-label"
                                    id="surgeon-select"
                                    value={surgeon}
                                    onChange={(e) => setSurgeon(e.target.value)}
                                    label="Surgeon"
                                >
                                    <MenuItem value="">Select a Surgeon</MenuItem>
                                    {surgeons.map((s) => (
                                        <MenuItem key={s.Surgeon_ID} value={s.Surgeon_ID}>
                                            {s.Name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {!!error && !surgeon && <FormHelperText>Please select a surgeon</FormHelperText>}
                            </FormControl>
                        </div>

                        {/* Nurse Selection */}
                        <div className="mb-4 md:mb-6">
                            <FormControl className="w-full" error={!!error && selectedNurses.length !== numberOfNursesRequired}>
                                <InputLabel id="nurses-label">Nurses</InputLabel>
                                <Select
                                    labelId="nurses-label"
                                    id="nurses-select"
                                    multiple
                                    value={selectedNurses}
                                    onChange={(e) => {
                                        const value = e.target.value; // Corrected type assertion
                                        setSelectedNurses(value);
                                    }}
                                    renderValue={(selected) => {
                                        const selectedNames = availableNurses
                                            .filter((nurse) => selected.includes(nurse.Nurse_ID))
                                            .map((nurse) => nurse.Name);
                                        return selectedNames.join(", ");
                                    }}
                                    label="Nurses"
                                >
                                    {availableNurses.map((nurse) => (
                                        <MenuItem key={nurse.Nurse_ID} value={nurse.Nurse_ID}>
                                            <Checkbox checked={selectedNurses.includes(nurse.Nurse_ID)} />
                                            {nurse.Name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {!!error && selectedNurses.length !== numberOfNursesRequired && (
                                    <FormHelperText>
                                        {`Please select exactly ${numberOfNursesRequired} nurses.`}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </div>

                        {/* Date and Operation Theater Selection */}
                        <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <DatePicker
                                label="Date"
                                value={date}
                                onChange={(newValue) => setDate(newValue)}
                                className="w-full sm:w-auto"
                                error={!!error && !date}

                            />
                            <FormControl className="w-full sm:w-auto" error={!!error && !operationTheater}>
                                <InputLabel id="operation-theater-label">Operation Theater</InputLabel>
                                <Select
                                    labelId="operation-theater-label"
                                    id="operation-theater-select"
                                    value={operationTheater}
                                    onChange={(e) => setOperationTheater(e.target.value)}
                                    label="Operation Theater"
                                >
                                    <MenuItem value="">Select a Theater</MenuItem>
                                    {getOperationTheaters().map((theater) => (
                                        <MenuItem key={theater.id} value={theater.id}>
                                            {theater.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {!!error && !operationTheater && <FormHelperText>Please select an operation theater</FormHelperText>}
                            </FormControl>
                        </div>
                    </>
                )}

                {error && (
                    <Alert severity="error" className="mb-4">
                        <AlertTitle>Error</AlertTitle>
                        {/* <AlertDescription>{error}</AlertDescription> */}
                    </Alert>
                )}

                <Button onClick={handleSchedule} variant="contained" disabled={loading || !showAdditionalFields} className="w-full sm:w-auto">
                    {loading ? 'Scheduling...' : 'Schedule Surgery'}
                </Button>
            </div>
        </LocalizationProvider>
    );
};

export default ScheduleSurgery;