const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 9000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

// Register new user (with hashed password)
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO authentication (username, password) VALUES (?, ?)";
        db.query(sql, [username, hashedPassword], (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.send("User registered successfully.");
        });
    } catch (err) {
        res.status(500).send("Error hashing password.");
    }
});

// Login user and generate JWT token
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM authentication WHERE username = ?";

    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.log(err.message);
            return res.status(500).send(err);
        }

        if (results.length === 0) {
            return res.status(400).send("Invalid username!");
        }

        // Compare the input password with the hashed password
        const match = await bcrypt.compare(password, results[0].password);

        if (!match) {
            return res.status(401).send("Invalid password");
        }

        // Generate a JWT token
        const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });
    });
});

// Get all patients
app.get('/api/patients', async (req, res) => {
    try {
        const query = 'SELECT * FROM patient';
        db.query(query, (err, results) => {
            if (err) {
                console.log(err.message);
                return res.status(500).send(err);
            }

            if (results.length === 0) {
                return res.status(400).send("No Patients found!");
            } else {
                res.send(results);
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
});

// Get all staff
app.get('/api/staffs', async (req, res) => {
    try {
        const query = 'SELECT * FROM personnel';
        db.query(query, (err, results) => {
            if (err) {
                console.log(err.message);
                return res.status(500).send(err);
            }

            if (results.length === 0) {
                return res.status(400).send("No Staff found!");
            } else {
                res.send(results);
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch staff' });
    }
});

// Get a specific staff by Employee_ID
app.get('/api/staffs/:id', async (req, res) => {
    const employeeId = req.params.id;

    try {
        const query = 'SELECT * FROM personnel WHERE Employee_ID = ?';
        db.query(query, [employeeId], (err, results) => {
            if (err) {
                console.log(err.message);
                return res.status(500).send(err);
            }

            if (results.length === 0) {
                return res.status(404).send("Staff not found");
            }

            res.send(results[0]);
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch staff' });
    }
});

// Update staff's job shift
app.put('/api/staffs/:id/shift', async (req, res) => {
    const employeeId = req.params.id;
    const { Job_Shift } = req.body;

    if (!Job_Shift) {
        return res.status(400).json({ message: 'Job_Shift is required' });
    }

    try {
        const sql = 'UPDATE personnel SET Job_Shift = ? WHERE Employee_ID = ?';
        db.query(sql, [Job_Shift, employeeId], (err, results) => {
            if (err) {
                console.log(err.message);
                return res.status(500).send(err);
            }

            if (results.affectedRows === 0) {
                return res.status(404).send('Staff not found');
            }

            res.send('Job shift updated successfully');
        });
    } catch (err) {
        console.error('Error updating shift:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Route to add a new staff
app.post('/api/addStaff', (req, res) => {
    const { Employee_ID,Name,Gender,Address,Phone_Number,SSN,Personnel_Type,Is_Chief_Of_Staff,Job_Shift
    } = req.body;
  
    const query = `INSERT INTO personnel (Employee_ID,Name,Gender,Address,Phone_Number,SSN,Personnel_Type,Is_Chief_Of_Staff,Job_Shift
) VALUES (?, ?, ?, ?, ?,?,?,?,?)`;
  
    // Execute the query
    db.query(query, [Employee_ID,Name,Gender,Address,Phone_Number,SSN,Personnel_Type,Is_Chief_Of_Staff,Job_Shift], (err, result) => {
      if (err) {
        console.error('Error inserting staff:', err);
        return res.status(500).json({ message: 'Error adding staff.', error: err.message });
      }
      res.status(201).json({ message: 'Staff added successfully!', staffId: result.insertId });
    });
  });
  

  // Delete staff by Employee_ID
app.delete('/api/removeStaff/:id', (req, res) => {
    const employeeId = req.params.id;

    const sql = 'DELETE FROM personnel WHERE Employee_ID = ?';

    db.query(sql, [employeeId], (err, result) => {
        if (err) {
            console.error('Error deleting staff:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        res.status(200).json({ message: 'Staff deleted successfully' });
    });
});

app.post('/api/insert_patient', async (req, res) => {
    try {
        const {
            Name,
            Gender,
            Date_of_birth,
            Address,
            Phone_Number,
            SSN,
            Consultation_Req,
            Hospitalization_Req,
        } = req.body;
        
        // Basic validation
        if (!Name || !Gender || !Date_of_birth || !Address || !Phone_Number || !SSN) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const query = `
            INSERT INTO Patient (
                Name, Gender, Date_of_birth, Address, Phone_Number, SSN, Consultation_Req, Hospitalization_Req
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?
            )
        `;
        const params = [
            Name,
            Gender,
            Date_of_birth,
            Address,
            Phone_Number,
            SSN,
            Consultation_Req,
            Hospitalization_Req,
        ];
        // console.log(params)
        db.query(query, params, (err)=>{
            if(err){
                return res.status(500).send(err)
            }
            res.send("Patient added successfully.")
        })
        // await executeQuery(query, params);
        // res.status(201).json({ message: 'Patient added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add patient', details: error.message });
    }
});

// API endpoint to get a patient's previous diagnoses
app.get('/api/diagnoses/:patientName', async (req, res) => {
    const patientName = req.params.patientName;
    try {
        // Query to find the patient and their diagnoses
        const query = `
            SELECT
                i.Description AS illnessDescription,
                pm.HDL,
                pm.LDL,
                pm.Triglyceride,
                pm.Heart_Risk_Category,
                pm.Cholesterol_HDL_Ratio,
                pm.Total_Cholesterol,
                pm.Blood_Type,
                pm.Blood_Sugar
            FROM Patient p
            JOIN Patient_Illness pi ON p.Patient_ID = pi.Patient_ID
            JOIN Illness i ON pi.Illness_ID = i.Illness_ID
            LEFT JOIN Patient_Medical pm ON p.Patient_ID = pm.Patient_ID  -- Join Patient_Medical
            WHERE p.Name = ?
        `;
        const params = [patientName];
        db.query(query, params, async (err, results)=>{
            if(err){
                return res.status(500).send(err)
            }
            if(results.length == 0){
                return res.status(404).json({ error: `No diagnoses found for patient: ${patientName}` });
            }
            console.log(results)
            res.json(results);
            // res.send("Patient added successfully.")
        })
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch diagnoses', details: error.message });
    }
});

app.listen(port, () =>{
    console.log('Server running on port 9000')
})
