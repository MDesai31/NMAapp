import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel
} from '@mui/material';

const AddStaff = () => {
  // State hooks
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ssn, setSsn] = useState('');
  const [personnelType, setPersonnelType] = useState('');
  const [isChiefOfStaff, setIsChiefOfStaff] = useState(false);
  const [jobShift, setJobShift] = useState('');
  const [yearsOfExperience, setyearsOfExperience] = useState('');
  const [contractEndDate, setContractEndDate] = useState('');
  const [Speciality, setSpeciality] = useState('');
  const [Salary, setSalary] = useState('');
  const [Grade, setGrade] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare payload
    const payload = {
      Name: name,
      Gender: gender,
      Address: address,
      Phone_Number: phoneNumber,
      SSN: ssn,
      Personnel_Type: personnelType,
      Is_Chief_Of_Staff: isChiefOfStaff,
      Job_Shift: jobShift,
      Contract_End_Date: contractEndDate,
      Years_Of_Experience:yearsOfExperience,
      Speciality:Speciality,
      Salary:Salary,
      Grade:Grade,
    };

    // Add conditional fields based on personnel type
    if (personnelType === 'Surgeon') {
      payload.Contract_End_Date = contractEndDate;
      payload.Speciality = Speciality;

    } else if (personnelType === 'Physician') {
      payload.Speciality = Speciality;
      payload.Salary = Salary;

    }else if (personnelType === 'Nurse' || personnelType === 'Physician') {
      payload.Years_Of_Experience = yearsOfExperience;
      payload.Speciality = Speciality;
      payload.Salary = Salary;
    }

    try {
      await axios.post('http://localhost:9000/api/addStaff', payload);
      alert('Staff added successfully!');
      navigate('/view_staff');  // Redirect to staff list
    } catch (err) {
      console.error(err);
      alert('Error adding staff!');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Add New Staff</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>

          {/* Gender Radio Buttons */}
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                row
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <FormControlLabel value="M" control={<Radio />} label="Male" />
                <FormControlLabel value="F" control={<Radio />} label="Female" />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              multiline
              rows={4}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Grid>

          {/* Phone Number */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Grid>

          {/* SSN */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="SSN"
              variant="outlined"
              value={ssn}
              onChange={(e) => setSsn(e.target.value)}
            />
          </Grid>

          {/* Chief of Staff Checkbox */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isChiefOfStaff}
                  onChange={(e) => setIsChiefOfStaff(e.target.checked)}
                />
              }
              label="Is Chief of Staff?"
            />
          </Grid>

          {/* Job Shift */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Job Shift"
              variant="outlined"
              value={jobShift}
              onChange={(e) => setJobShift(e.target.value)}
            />
          </Grid>

          {/* Personnel Type Radio Buttons */}
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Personnel Type</FormLabel>
              <RadioGroup
                row
                value={personnelType}
                onChange={(e) => setPersonnelType(e.target.value)}
              >
                <FormControlLabel value="Surgeon" control={<Radio />} label="Surgeon" />
                <FormControlLabel value="Nurse" control={<Radio />} label="Nurse" />
                <FormControlLabel value="Physician" control={<Radio />} label="Physician" />
                <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Conditional Fields based on Personnel Type */}
          {personnelType && (
            <Grid item xs={12}>
              <br />
            </Grid>
          )}

          {personnelType === 'Surgeon' && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Speciality"
                  variant="outlined"
                  value={Speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Contract End Date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={contractEndDate}
                  onChange={(e) => setContractEndDate(e.target.value)}
                />
              </Grid>
            </>
          )}

          {personnelType === 'Physician' ? (
           <>
           <Grid item xs={12} sm={6}>
             <TextField
               fullWidth
               label="Speciality"
               variant="outlined"
               value={Speciality}
               onChange={(e) => setSpeciality(e.target.value)}
             />
           </Grid>

           <Grid item xs={12} sm={6}>
             <TextField
               fullWidth
               label="Salary"
               variant="outlined"
               value={Salary}
               onChange={(e) => setSalary(e.target.value)}
             />
           </Grid>
         </>
          ) : null}
          {personnelType === 'Nurse' ? (
           <>
           <Grid item xs={12} sm={6}>
             <TextField
               fullWidth
               label="Grade"
               variant="outlined"
               value={Grade}
               onChange={(e) => setGrade(e.target.value)}
             />
           </Grid>

           <Grid item xs={12} sm={6}>
             <TextField
               fullWidth
               label="yearsOfExperience"
               variant="outlined"
               value={yearsOfExperience}
               onChange={(e) => setyearsOfExperience(e.target.value)}
             />
           </Grid>
           <Grid item xs={12} sm={6}>
             <TextField
               fullWidth
               label="Salary"
               variant="outlined"
               value={Salary}
               onChange={(e) => setSalary(e.target.value)}
             />
           </Grid>
         </>
          ) : null}
          {/* Submit Button */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Add Staff
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddStaff;
