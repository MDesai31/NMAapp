import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { FormHelperText } from '@mui/material'; // Import FormHelperText
import { Alert, AlertTitle} from '@mui/material'; // Import Alert for error display

const InsertPatient = () => {
    const [formData, setFormData] = useState({
        Name: '',
        Gender: '',
        Date_of_birth: '',
        Address: '',
        Phone_Number: '',
        SSN: '',
        Consultation_Req: false,
        Hospitalization_Req: false,
    });
    const [errors, setErrors] = useState({}); // State for storing validation errors
    const [submissionStatus, setSubmissionStatus] = useState({ type: null, message: '' }); // Track submission status
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error message for the field being changed
        setErrors(prevErrors => ({ ...prevErrors, [name]: undefined }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.Name.trim()) {
            newErrors.Name = 'Name is required';
            isValid = false;
        }
        if (!formData.Gender) {
            newErrors.Gender = 'Gender is required';
            isValid = false;
        }
        if (!formData.Date_of_birth) {
            newErrors.Date_of_birth = 'Date of Birth is required';
            isValid = false;
        }
        if (!formData.Address.trim()) {
            newErrors.Address = 'Address is required';
            isValid = false;
        }
        if (!formData.Phone_Number.trim()) {
            newErrors.Phone_Number = 'Phone Number is required';
            isValid = false;
        }
        if (!formData.SSN.trim()) {
            newErrors.SSN = 'SSN is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Stop submission if form is invalid
        }

        setSubmissionStatus({ type: null, message: '' }); // Reset status
        try {
            const response = await fetch('http://localhost:9000/api/insert_patient', { // Replace with your server URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmissionStatus({ type: 'success', message: 'Patient added successfully!' });
                // Reset the form
                setFormData({
                    Name: '',
                    Gender: '',
                    Date_of_birth: '',
                    Address: '',
                    Phone_Number: '',
                    SSN: '',
                    Consultation_Req: false,
                    Hospitalization_Req: false,
                });
                setErrors({}); // Clear any previous errors
                // Redirect to view patients or show a success message
                setTimeout(() => {
                    navigate('/patient'); // Or any other route
                }, 2000);

            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error || 'Failed to add patient'; // Default error
                setSubmissionStatus({ type: 'error', message: errorMessage });
            }
        } catch (error) {
            setSubmissionStatus({ type: 'error', message: error.message || 'An unexpected error occurred' });
        }
    };

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-gray-800">Insert New Patient</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                    fullWidth
                    label="Name"
                    name="Name"
                    value={formData.Name}
                    onChange={handleChange}
                    error={!!errors.Name}
                    helperText={errors.Name}
                />
                <FormControl fullWidth error={!!errors.Gender}>
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                        labelId="gender-label"
                        name="Gender"
                        value={formData.Gender}
                        onChange={handleChange}
                    >
                        <MenuItem value="">Select Gender</MenuItem>
                        <MenuItem value="M">Male</MenuItem>
                        <MenuItem value="F">Female</MenuItem>
                        <MenuItem value="O">Other</MenuItem>
                    </Select>
                    {errors.Gender && <FormHelperText>{errors.Gender}</FormHelperText>}
                </FormControl>

                <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    name="Date_of_birth"
                    value={formData.Date_of_birth}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }} // Ensure label doesn't overlap with date
                    error={!!errors.Date_of_birth}
                    helperText={errors.Date_of_birth}
                />

                <TextField
                    fullWidth
                    label="Address"
                    name="Address"
                    value={formData.Address}
                    onChange={handleChange}
                    error={!!errors.Address}
                    helperText={errors.Address}
                />

                <TextField
                    fullWidth
                    label="Phone Number"
                    name="Phone_Number"
                    value={formData.Phone_Number}
                    onChange={handleChange}
                    error={!!errors.Phone_Number}
                    helperText={errors.Phone_Number}
                />

                <TextField
                    fullWidth
                    label="SSN"
                    name="SSN"
                    value={formData.SSN}
                    onChange={handleChange}
                    error={!!errors.SSN}
                    helperText={errors.SSN}
                />

                <FormControl fullWidth>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="Consultation_Req"
                            checked={formData.Consultation_Req}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                        />
                        Consultation Required
                    </label>
                </FormControl>

                <FormControl fullWidth>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="Hospitalization_Req"
                            checked={formData.Hospitalization_Req}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                        />
                        Hospitalization Required
                    </label>
                </FormControl>

                <Button type="submit" variant="contained" color="primary">
                    Insert Patient
                </Button>
            </form>

            {submissionStatus.type === 'success' && (
                <Alert severity="success" className="mt-4">
                    <AlertTitle>Success</AlertTitle>
                    {/* <AlertDescription>{submissionStatus.message}</AlertDescription> */}
                </Alert>
            )}
            {submissionStatus.type === 'error' && (
                <Alert severity="error" className="mt-4">
                    <AlertTitle>Error</AlertTitle>
                    {/* <AlertDescription>{submissionStatus.message}</AlertDescription> */}
                </Alert>
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

export default InsertPatient;