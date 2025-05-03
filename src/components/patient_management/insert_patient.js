import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    FormHelperText,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

const InsertPatient = () => {
    const [formData, setFormData] = useState({
        Name: '',
        Gender: '',
        Date_of_birth: null,
        Address: '',
        Phone_Number: '',
        SSN: '',
        Consultation_Req: false,
        Hospitalization_Req: false,
    });
    const [errors, setErrors] = useState({
        Name: '',
        Gender: '',
        Date_of_birth: '',
        Phone_Number: '',
        SSN: '',
    });
    const navigate = useNavigate();
}