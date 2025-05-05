const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
const port = 9000;

require('dotenv').config()
app.use(cors())
app.use(bodyParser.json())

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
})

app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    // console.log('reaches here')
    const sql = "INSERT INTO authentication (username, password) VALUES (?,?)"
    
    db.query(sql, [username, password], (err)=>{
        if(err){
            return res.status(500).send(err)
        }
        res.send("User registered successfully.")
    })
})

app.post('/login', (req, res)=>{
    const {username, password} = req.body;
    const sql = "SELECT * FROM authentication WHERE username = ?"

    db.query(sql, [username], async (err, results)=>{
        if (err){
            console.log(err.message)
            return res.status(500).send(err)
        }
        
        if(results.length === 0){
            return res.status(400).send("Invalid username!")
        }
        
        const match = (password === results[0].password)

        if(!match){
            return res.status(401).send("Invalid password");
        }

        const token = jwt.sign({id: results[0].id }, 'secret_key', { expiresIn: '1h'})
        res.json({token})
    })
})

app.get('/api/patients', async (req, res) => {
    try {
        const query = 'SELECT * FROM patient';
        db.query(query, async (err, results)=>{
            if (err){
                console.log(err.message)
                return res.status(500).send(err)
            }

            if(results.length === 0){
                return res.status(400).send("No Patients!")
            }else{
                res.send(results)
            }
        })
        // const patients = await executeQuery(query);
        // res.json(patients);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
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