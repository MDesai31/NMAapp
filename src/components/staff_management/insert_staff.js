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

const InsertStaff = () => {
    const [formData, setFormData] = useState({
        Name: '',
        Gender: '',
        Address: '',
        Phone_Number: '',
        SSN: '',
        Personnel_Type: '',
        SSN: '',
        Is_Chief_Of_Staff: false,
        Job_Shift: '',
    });
    const [errors, setErrors] = useState({
        Name: '',
        Gender: '',
        Phone_Number: '',
        SSN: '',
    });
    const navigate = useNavigate();
}