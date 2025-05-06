const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
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

// --------------------------- AUTH ROUTES ---------------------------

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO authentication (username, password) VALUES (?, ?)";
        db.query(sql, [username, hashedPassword], (err) => {
            if (err) return res.status(500).send(err);
            res.send("User registered successfully.");
        });
    } catch (err) {
        res.status(500).send("Error hashing password.");
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM authentication WHERE username = ?";

    db.query(sql, [username], async (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(400).send("Invalid username!");

        const match = await bcrypt.compare(password, results[0].password);
        if (!match) return res.status(401).send("Invalid password");

        res.json({ message: "Login successful" });
    });
});

// --------------------------- PATIENT ROUTES ---------------------------

app.get('/api/patients', (req, res) => {
    db.query('SELECT * FROM patient', (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send("No Patients found!");
        res.send(results);
    });
});

app.post('/api/insert_patient', (req, res) => {
    const { Name, Gender, Date_of_birth, Address, Phone_Number, SSN, Consultation_Req, Hospitalization_Req } = req.body;
    if (!Name || !Gender || !Date_of_birth || !Address || !Phone_Number || !SSN)
        return res.status(400).json({ error: 'All fields are required' });

    const query = `INSERT INTO Patient (Name, Gender, Date_of_birth, Address, Phone_Number, SSN, Consultation_Req, Hospitalization_Req) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [Name, Gender, Date_of_birth, Address, Phone_Number, SSN, Consultation_Req, Hospitalization_Req];
    
    db.query(query, params, (err) => {
        if (err) return res.status(500).send(err);
        res.send("Patient added successfully.");
    });
});

app.get('/api/diagnoses/:patientName', (req, res) => {
    const patientName = req.params.patientName;
    const query = `
        SELECT i.Description AS illnessDescription, pm.HDL, pm.LDL, pm.Triglyceride,
               pm.Heart_Risk_Category, pm.Cholesterol_HDL_Ratio, pm.Total_Cholesterol,
               pm.Blood_Type, pm.Blood_Sugar
        FROM Patient p
        JOIN Patient_Illness pi ON p.Patient_ID = pi.Patient_ID
        JOIN Illness i ON pi.Illness_ID = i.Illness_ID
        LEFT JOIN Patient_Medical pm ON p.Patient_ID = pm.Patient_ID
        WHERE p.Name = ?`;
    db.query(query, [patientName], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).json({ error: `No diagnoses found for patient: ${patientName}` });
        res.json(results);
    });
});

// --------------------------- STAFF ROUTES ---------------------------

app.get('/api/staffs', (req, res) => {
    db.query('SELECT * FROM personnel', (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send("No staff found!");
        res.send(results);
    });
});

app.get('/api/staff/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM personnel WHERE Employee_ID = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send("Staff not found");
        res.send(results[0]);
    });
});

app.post('/api/addstaff', (req, res) => {
    const { Name, Gender, Address, Phone_Number, SSN, Personnel_Type, Is_Chief_Of_Staff, Job_Shift } = req.body;
    const query = `INSERT INTO personnel (Name, Gender, Address, Phone_Number, SSN, Personnel_Type, Is_Chief_Of_Staff, Job_Shift) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [Name, Gender, Address, Phone_Number, SSN, Personnel_Type, Is_Chief_Of_Staff, Job_Shift], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error adding staff.', error: err.message });
        res.status(201).json({ message: 'Staff added successfully!', staffId: result.insertId });
    });
});

app.put('/api/staff/:id/job-shift', (req, res) => {
    const { Job_Shift } = req.body;
    if (!Job_Shift) return res.status(400).json({ message: 'Job_Shift is required' });

    db.query('UPDATE personnel SET Job_Shift = ? WHERE Employee_ID = ?', [Job_Shift, req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Staff not found');
        res.send('Job shift updated successfully');
    });
});



app.delete('/api/removestaff/:id', (req, res) => {
    const staffId = req.params.id;
    console.log(`🧹 Attempting to remove staff with ID: ${staffId}`);

    // Delete from nurse
    db.query('DELETE FROM nurse WHERE Employee_id = ?', [staffId], (err, result1) => {
        if (err) console.error('❌ Error deleting from nurse:', err);

        // Delete from physician
        db.query('DELETE FROM physician WHERE Employee_id = ?', [staffId], (err2, result2) => {
            if (err2) console.error('❌ Error deleting from physician:', err2);

            // Delete from surgeon
            db.query('DELETE FROM surgeon WHERE Employee_id = ?', [staffId], (err3, result3) => {
                if (err3) console.error('❌ Error deleting from surgeon:', err3);

                // Finally, delete from personnel
                db.query('DELETE FROM personnel WHERE Employee_ID = ?', [staffId], (err4, result4) => {
                    if (err4) {
                        console.error('❌ Error deleting from personnel:', err4);
                        return res.status(500).json({ error: 'Failed to delete personnel' });
                    }
                        // Delete from staff_shifts
                        db.query('DELETE FROM staff_shifts WHERE staff_id = ?', [staffId], (err5, result5) => {
                            if (err5) console.error('❌ Error deleting from staff_shifts:', err5);
                            
                    if (result4.affectedRows === 0) {
                        return res.status(404).json({ message: 'Staff not found' });
                    }

                    console.log('✅ Staff successfully deleted');
                    res.status(200).json({ message: 'Staff deleted successfully' });
                });
            });
            });
        });
    });
});


// --------------------------- ROOM ROUTES ---------------------------

app.get('/api/rooms', (req, res) => {
    db.query('SELECT * FROM Room_Arrangement', (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send("No Room found!");
        res.send(results);
    });
});

// --------------------------- SHIFT ROUTES ---------------------------

app.get('/api/staff/:id/getshift-schedule', (req, res) => {
    db.query('SELECT shift_date, shift_type FROM staff_shifts WHERE staff_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching staff shift' });
        res.status(200).json(results); // <-- direct array
    });
});

app.post('/api/staff/:id/Addshift-schedule', (req, res) => {
    const { shift_type, shift_date } = req.body;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(shift_date)) {
        return res.status(400).json({ message: 'Invalid date format (expected YYYY-MM-DD)' });
    }

    db.query('INSERT INTO staff_shifts (Staff_ID, shift_type, shift_date) VALUES (?, ?, ?)', [req.params.id, shift_type, shift_date], (err) => {
        if (err) return res.status(500).json({ message: 'Internal server error' });
        res.status(201).json({ message: 'Shift added successfully' });
    });
});

app.get('/api/shifts', (req, res) => {
    db.query('SELECT DISTINCT job_shift FROM staff_shifts', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching shifts' });
        const shifts = results.map(row => row.job_shift);
        res.status(200).json(shifts);
    });
});

app.get('/api/shifts/:shift/staffs', (req, res) => {
    db.query('SELECT * FROM staff_shifts WHERE LOWER(shift_type) = LOWER(?)', [req.params.shift], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching staff for shift' });
        res.status(200).json(results);
    });
});

app.delete('/api/staff/:id/deleteshift', (req, res) => {
    const { id } = req.params;
    const { shift_date } = req.query;

    const query = `
        DELETE FROM staff_shifts
        WHERE staff_id = ? AND shift_date = ?
    `;

    db.query(query, [id, shift_date], (err, result) => {
        if (err) {
            console.error('❌ Failed to delete shift:', err);
            return res.status(500).json({ error: 'Failed to delete shift' });
        }
        res.status(200).json({ message: 'Shift deleted successfully' });
    });
});

// --------------------------- SERVER START ---------------------------

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
