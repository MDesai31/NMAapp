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
                        db.query('DELETE FROM staff_shifts WHERE Employee_ID = ?', [staffId], (err5, result5) => {
                            if (err5) console.error('❌ Error deleting from staff_shifts:', err5);
                            
                    if (result4.affectedRows === 0) {
                        return res.status(404).json({ message: 'Staff not found' });
                    }

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
    db.query('SELECT shift_date, shift_type FROM staff_shifts WHERE Employee_ID = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching staff shift' });
        res.status(200).json(results); // <-- direct array
    });
});

app.post('/api/staff/:id/Addshift-schedule', (req, res) => {
    const { shift_type, shift_date } = req.body;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(shift_date)) {
        return res.status(400).json({ message: 'Invalid date format (expected YYYY-MM-DD)' });
    }

    db.query('INSERT INTO staff_shifts (Employee_ID, shift_type, shift_date) VALUES (?, ?, ?)', [req.params.id, shift_type, shift_date], (err) => {
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
        WHERE Employee_ID = ? AND shift_date = ?
    `;

    db.query(query, [id, shift_date], (err, result) => {
        if (err) {
            console.error('❌ Failed to delete shift:', err);
            return res.status(500).json({ error: 'Failed to delete shift' });
        }
        res.status(200).json({ message: 'Shift deleted successfully' });
    });
});


// --------------------------- INPATIENT  ROUTES ---------------------------

app.get('/api/inpatients', (req, res) => {
   
    db.query(`SELECT 
    q.Name AS PatientName,
    q.Gender AS Gender,
    DATE(q.Date_of_birth) AS Date_of_birth,
    q.Address AS Address,
    q.Phone_Number AS Phone_Number,
    phy.Name AS PhysicianName,
    nurPer.Name AS NurseName,
    I.*, 
    P.Physician_ID
FROM in_patient I
JOIN patient_physician P ON I.Patient_ID = P.Patient_ID
JOIN patient q ON q.Patient_ID = I.Patient_ID
JOIN physician r ON P.Physician_ID = r.Physician_ID
JOIN personnel phy ON r.Employee_ID = phy.Employee_ID 
JOIN nurse n ON I.Nurse_ID = n.Nurse_ID
JOIN personnel nurPer ON n.Employee_ID = nurPer.Employee_ID `, (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send("No INPATIENT found!");
        res.send(results);
    });
});


app.get('/api/inpatients/:id', (req, res) => {
    const id = req.params.id;
    db.query(`SELECT 
    q.Name AS PatientName,
    q.Gender AS Gender,
    DATE(q.Date_of_birth) AS Date_of_birth,
    q.Address AS Address,
    q.Phone_Number AS Phone_Number,
    phy.Name AS PhysicianName,
    nur.Name AS NurseName,
    I.*, P.Physician_ID
FROM in_patient I
JOIN patient_physician P ON I.Patient_ID = P.Patient_ID
JOIN patient q ON q.Patient_ID = I.Patient_ID
JOIN physician r ON P.Physician_ID = r.Physician_ID
JOIN personnel phy ON r.Employee_ID = phy.Employee_ID
JOIN personnel nur ON I.Nurse_ID = nur.Employee_ID
where I.Patient_ID = ? `, [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send("INPATIENT not found");
        res.send(results[0]);
    });
});

// --------------------------- Room  ROUTES ---------------------------

app.get('/api/inpatients/:id/room', async (req, res) => {
    const Patient_ID = req.params.id;

    db.query('SELECT Room_No, Bed_No, Wing FROM in_patient WHERE Patient_ID = ? and Room_No is not null', [Patient_ID], (err, results) => {
        if (err) {
            console.error('Database error:', err);  // Debug: Log database error
            return res.status(500).send(err);
        }

        if (results.length === 0) {
            return res.status(404).send("INPATIENT not found");
        }

        res.send(results[0]);  // Send only the first result (assuming it's a single room history record)
    });
});



app.put('/api/inpatients/:id/room', async (req, res) => {
    const Patient_ID = req.params.id;
    const { Room_No, Bed_No, Wing } = req.body;

    if (!Room_No || !Bed_No || !Wing) {
        return res.status(400).json({ message: 'roomNo, bedNo, and wing are required to identify the row' });
    }

    // Step 1: Update the in_patient table with room details
    db.query(
        'UPDATE in_patient SET Room_No = NULL, Bed_No = NULL, Wing = NULL WHERE Patient_ID = ? AND Room_No = ? AND Bed_No = ? AND Wing = ? ',
        [Patient_ID,Room_No, Bed_No, Wing ],
        (err, results) => {
            if (err) {
                console.error('Database error (in_patient):', err);
                return res.status(500).send(err);
            }

            if (results.affectedRows === 0) {
                return res.status(404).send("Room Not Updated for Inpatient");
            }

            // Step 2: Mark the room as available in the room_arrangement table
            db.query(
                'UPDATE room_arrangement SET Is_Available = TRUE WHERE Room_No = ? AND Bed_No = ? AND Wing = ?',
                [Room_No, Bed_No, Wing],
                (err1, results1) => {
                    if (err1) {
                        console.error('Database error (room_arrangement):', err1);
                        return res.status(500).send(err1);
                    }

                    if (results1.affectedRows === 0) {
                        return res.status(404).send("Room Not Marked as available");
                    }

                    // Success: Respond that both the room has been deleted and marked available
                    return res.status(200).json({ message: 'Room details deleted successfully and room marked available' });
                }
            );
        }
    );
});


app.put('/api/inpatients/:id/addroom', async (req, res) => {
    const Patient_ID = req.params.id;
    const { Room_No, Bed_No, Wing } = req.body;

    if (!Room_No || !Bed_No || !Wing) {
        return res.status(400).json({ message: 'roomNo, bedNo, and wing are required to identify the row' });
    }

    // Step 1: Update the in_patient table with room details
    db.query(
        'UPDATE in_patient SET Room_No = ?, Bed_No = ?, Wing = ? WHERE Patient_ID = ?',
        [Room_No, Bed_No, Wing, Patient_ID],
        (err, results) => {
            if (err) {
                console.error('Database error (in_patient):', err);
                return res.status(500).send(err);
            }

            if (results.affectedRows === 0) {
                return res.status(404).send("Room Not Added for Inpatient");
            }

            // Step 2: Mark the room as unavailable in the room_arrangement table
            db.query(
                'UPDATE room_arrangement SET Is_Available = FALSE WHERE Room_No = ? AND Bed_No = ? AND Wing = ?',
                [Room_No, Bed_No, Wing],
                (err1, results1) => {
                    if (err1) {
                        console.error('Database error (room_arrangement):', err1);
                        return res.status(500).send(err1);
                    }

                    if (results1.affectedRows === 0) {
                        return res.status(404).send("Room Not Marked as Unavailable");
                    }

                    // Success: Respond that both the room has been added and marked unavailable
                    return res.status(200).json({ message: 'Room assigned successfully and marked unavailable' });
                }
            );
        }
    );
});


// --------------------------- Nurse  ROUTES ---------------------------
app.get('/api/inpatients/:id/nurses', (req, res) => {
    const Patient_ID = req.params.id;

    const sql = `
        SELECT N.Nurse_ID, q.Name, N.Grade, N.YOE, 
       GROUP_CONCAT(DISTINCT S.Name SEPARATOR ', ') AS Specialities
FROM Nurse N
JOIN personnel q ON N.Employee_ID = q.Employee_ID
JOIN in_patient I ON I.Nurse_ID = N.Nurse_ID
JOIN nurse_surgery_skills R ON N.Nurse_ID = R.Nurse_ID
JOIN surgery S ON R.Surgery_ID = S.Surgery_ID
WHERE I.Patient_ID = ?
GROUP BY N.Nurse_ID, q.Name, N.Grade, N.YOE
    `;

    db.query(sql, [Patient_ID], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send(err);
        }

        if (results.length === 0) {
            return res.status(404).send("INPATIENT not found");
        }

        res.send(results);  // send all nurses assigned, if multiple
    });
});


app.get('/api/nurses', (req, res) => {
    db.query(`
        SELECT P.Nurse_ID, 
               q.Name, 
               P.Grade, 
               P.YOE, 
               GROUP_CONCAT(DISTINCT S.Name SEPARATOR ', ') AS Specialities, 
               7 - IFNULL((
                   SELECT COUNT(*) 
                   FROM in_patient I  
                   WHERE I.Nurse_ID = P.Nurse_ID 
                   GROUP BY I.Nurse_ID
               ), 0) AS AvailableSlot 
        FROM Nurse P 
        JOIN personnel q ON P.Employee_ID = q.Employee_ID 
        JOIN nurse_surgery_skills R ON P.Nurse_ID = R.Nurse_ID 
        JOIN surgery S ON R.Surgery_ID = S.Surgery_ID 
        GROUP BY P.Nurse_ID, q.Name, P.Grade, P.YOE;
    `, (err, results) => {
        if (err) {
            console.error('Database error:', err);  // Debug: Log error
            return res.status(500).send(err);
        }
        if (results.length === 0) {
            console.warn("No nurses found!");  // Debug: Log when no results are found
            return res.status(404).send("No Nurses found!");
        }
        res.send(results);
    });
});



app.put('/api/inpatients/:id/deletenurse', async (req, res) => {
    const Patient_ID = req.params.id;
    const { Nurse_ID } = req.body;

    const deleteQuery = `
        Update in_patient set Nurse_ID = NULL
        WHERE Nurse_ID = ? AND Patient_ID = ?
    `;

    db.query(deleteQuery, [Nurse_ID, Patient_ID], (err, results) => {
        if (err) {
            console.error('Database error (inpatient_nurse):', err);
            return res.status(500).send(err);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send("Nurse Not Deleted for Inpatient");
        }

        res.status(200).send("Nurse successfully removed from inpatient.");
    });
});

app.put('/api/inpatients/:id/addnurse', async (req, res) => {
    const Patient_ID = req.params.id;
    const { Nurse_ID } = req.body;

    const deleteQuery = ` Update in_patient set Nurse_ID = ?  WHERE Patient_ID = ? `;

    db.query(deleteQuery, [Nurse_ID, Patient_ID], (err, results) => {
        if (err) {
            console.error('Database error (inpatient_nurse):', err);
            return res.status(500).send(err);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send("Nurse Not Added for Inpatient");
        }

        res.status(200).send("Nurse successfully Added from inpatient.");
    });
});

// --------------------------- Doctor  ROUTES ---------------------------
app.get('/api/inpatients/:id/doctor', (req, res) => {
    const Patient_ID = req.params.id;

    const sql = `
 SELECT 
    P.Primary_Physician_ID,     q.Name, 
    q.phone_number, 
    r.Specialty  
FROM patient P 
JOIN physician r ON r.Physician_ID = P.Primary_Physician_ID
JOIN personnel q ON r.Employee_ID = q.Employee_ID
WHERE P.Patient_ID = ?    `;

    db.query(sql, [Patient_ID], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send(err);
        }

        if (results.length === 0) {
            return res.status(404).send("INPATIENT Doctor details not found");
            console.log('INPATIENT Doctor details not found:', results);

        }

        res.send(results);  // send all Doctor assigned, if multiple
    });
});

app.get('/api/doctors', (req, res) => {
    db.query(`
         SELECT 
    P.Physician_ID, 
    q.Name, 
    q.phone_number, 
    P.Specialty,
    7 - IFNULL((
        SELECT COUNT(*) 
        FROM patient I  
        WHERE I.Primary_Physician_ID = P.Physician_ID
    ), 0) AS AvailableSlot 
FROM physician P 
JOIN personnel q ON P.Employee_ID = q.Employee_ID 
GROUP BY P.Physician_ID, q.Name, q.phone_number, P.Specialty ;
    `, (err, results) => {
        if (err) {
            console.error('Database error:', err);  // Debug: Log error
            return res.status(500).send(err);
        }
        if (results.length === 0) {
            console.warn("No Doctors found!");  // Debug: Log when no results are found
            return res.status(404).send("No Dcotors found!");
        }
        res.send(results);
    });
});

app.put('/api/inpatients/:id/removedoctor', async (req, res) => {
    const Patient_ID = req.params.id;
    const { Primary_Physician_ID } = req.body;

    const deleteQuery1 = `
        Update patient set Primary_Physician_ID = NULL
        WHERE Patient_ID = ? AND Primary_Physician_ID = ?
    `;
    const deleteQuery2 = `
    update  patient_physician set Physician_ID = ?
    WHERE Patient_ID = ?
`;
    db.query(deleteQuery1, [Patient_ID, Primary_Physician_ID ], (err, results) => {
        if (err) {
            console.error('Database error (inpatient_nurse):', err);
            return res.status(500).send(err);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send("Doctor Not Deleted for Inpatient");
        }
    db.query(deleteQuery2, [Primary_Physician_ID, Patient_ID  ], (err, results) => {
        if (err) {
            console.error('Database error (inpatient_nurse):', err);
            return res.status(500).send(err);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send("Doctor Not Deleted for Inpatient");
        }
        res.status(200).send("Doctor successfully removed from inpatient.");
    });
});
});

app.put('/api/inpatients/:id/adddoctor', async (req, res) => {
    const Patient_ID = req.params.id;
    const { Primary_Physician_ID } = req.body;

    const deleteQuery1 = ` Update patient set Primary_Physician_ID = ?  WHERE Patient_ID = ? `;
    const deleteQuery2 = ` insert into  patient_physician values(?,?) `;

    db.query(deleteQuery1, [Primary_Physician_ID, Patient_ID], (err, results) => {
        if (err) {
            console.error('Database error (inpatient_nurse):', err);
            return res.status(500).send(err);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send("Doctor Not Added for Inpatient");
        }
    db.query(deleteQuery2, [Patient_ID, Primary_Physician_ID], (err, results) => {
        if (err) {
            console.error('Database error (inpatient_nurse):', err);
            return res.status(500).send(err);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send("Doctor Not Added for Inpatient");
        }
        res.status(200).send("Doctor successfully Added from inpatient.");
    });
});
// API endpoint to get physician schedule per day
app.get('/api/schedule/physicians/:date', async (req, res) => {
    const { date } = req.params;

    try {
        // Validate the date format (optional, but recommended)
        const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateFormatRegex.test(date)) {
            return res.status(400).json({ error: 'Invalid date format. Please use YYYY-MM-DD' });
        }
        
        const query = `
            SELECT
                p.Employee_ID,
                p.Name,
                s.shift_type
            FROM Personnel p
            JOIN staff_shifts s ON p.Employee_ID = s.Employee_ID
            WHERE s.shift_date = ? AND p.Personnel_Type = 'Physician'
        `;
        const params = [date];
        // console.log(params)
        // const physicians = await executeQuery(query, params);
        db.query(query, params, (err, results) => {
            if (err) return res.status(500).send(err);
            if (results.length === 0) return res.status(404).json({ error: `No schedule available for this day!` });
            console.log(results)
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch physician schedule', details: error.message });
    }
});

// API endpoint to get physician schedule by Name
app.get('/api/schedule/doctorName/:doctorName', async (req, res) => {
    const doctorName = req.params.doctorName;

    try {
        // Join Personnel and staff_shifts tables to get the schedule for a specific doctor
        const query = `
            SELECT
                s.shift_date,
                s.shift_type
            FROM Personnel p
            JOIN staff_shifts s ON p.Employee_ID = s.employee_id
            WHERE p.Name = ? AND p.Personnel_Type = 'Physician'
        `;
        const params = [doctorName];
        // const schedule = await executeQuery(query, params);

        db.query(query, params, (err, results) => {
            if (err) return res.status(500).send(err);
            if (results.length === 0) return res.status(404).json({ error: `No schedule found for Doctor Name: ${doctorName}` });
            console.log(results)
            res.json(results);
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch doctor schedule', details: error.message });
    }
});
// API endpoint to get all physicians
app.get('/api/physicians', async (req, res) => {
    try {
        const query = `
            SELECT
                Employee_ID,
                Name
            FROM personnel
            WHERE Personnel_Type = 'Physician'
        `;
        // console.log('reaches here!')
        // const physicians = await executeQuery(query);
        db.query(query, (err, results) => {
            // console.log(results)
            if (err) return res.status(500).send(err);
            if (results.length === 0) return res.status(404).json({ error: `No Doctors Found!` });
            // console.log(results)
            res.json(results);
        });
        // res.json(physicians);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch physicians', details: error.message });
    }
});

//New API endpoint to check the patient by name
app.get('/api/checkPatient/:patientName', async (req, res) => {
    const patientName = req.params.patientName;
    try {
        const query = 'SELECT Patient_ID FROM patient WHERE Name = ?';
        const params = [patientName];
        // const result = await executeQuery(query, params);
        db.query(query, params, (err, results) => {
            // console.log(results)
            if (results.length > 0) {
                res.json({ exists: true });
            } else {
                res.status(404).json({ exists: false, error: `Patient "${patientName}" not found` }); //Explicit 404
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error checking patient', details: error.message });
    }
});

// Function to get available time slots for a given date, shift, and physician
const getAvailableTimeSlots = async (date, shiftType, physicianName) => {
  // In a real application, this would come from your database
  //  You'd have a table that stores scheduled appointments and their details
  console.log("reaches here")
      const query = `
      SELECT
          s.time,
          CASE
              WHEN a.Consultation_ID IS NULL THEN TRUE
              ELSE FALSE
          END AS available,
          s.slot_number
      FROM Time_Slots s  -- Assumed table name
      LEFT JOIN Consultation_Schedule a ON s.slot_number = a.Time_Slot_Number AND a.Date = ?
      LEFT JOIN Personnel p ON a.Physician_ID = p.Employee_ID
      WHERE s.shift_type = ? 
      AND NOT EXISTS (
          SELECT 1 FROM Consultation_Schedule cs
          WHERE cs.Date = ? AND cs.Physician_ID = (SELECT Employee_ID FROM Personnel WHERE Name = ?)
      )
      ORDER BY s.slot_number;
    `;
    const params = [date, shiftType, date, physicianName];
    db.query(query, params, (err, results) => {
        // console.log(results)
        return results;
    });
//   const slots = await executeQuery(query, params);
    // return slots;
};

app.get('/api/appointments/slots', async (req, res) => {
    const { date, shiftType, physicianName } = req.query;

    if (!date || !shiftType || !physicianName) {
        return res.status(400).json({ error: 'Date, shiftType, and physicianName are required' });
    }
    const query = `
      SELECT
          s.time,
          CASE
              WHEN a.Consultation_ID IS NULL THEN TRUE
              ELSE FALSE
          END AS available,
          s.slot_number
      FROM Time_Slots s 
      LEFT JOIN Consultation_Schedule a ON s.slot_number = a.Time_Slot_Number AND a.Date = ?
      LEFT JOIN Personnel p ON a.Physician_ID = p.Employee_ID
      WHERE s.shift_type = ? 
      AND NOT EXISTS (
          SELECT 1 FROM Consultation_Schedule cs
          WHERE cs.Date = ? AND cs.Physician_ID = (SELECT Employee_ID FROM Personnel WHERE Name = ?)
      )
      ORDER BY s.slot_number;
    `;
    try {
        const params = [date, shiftType, date, physicianName];
        db.query(query, params, (err, results) => {
            console.log(results)
            res.json(results);    
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch available slots', details: error.message });
    }
});

// API endpoint to schedule an appointment
app.post('/api/appointments', async (req, res) => {
    const { patientName, date, shiftType, timeSlot, physicianName } = req.body;
    console.log(req.body)
    if (!patientName || !date || !shiftType || timeSlot === null || !physicianName) {
        return res.status(400).json({ error: 'Patient name, date, shift type, time slot, and physician name are required' });
    }

    try {
        // 1. Get Patient ID
        const getPatientIdQuery = 'SELECT Patient_ID FROM Patient WHERE Name = ?';
        const patientParams = [patientName];
        var patientId = null;
        db.query(getPatientIdQuery, patientParams, (err, results) => {
            if (results.length === 0) {
                return res.status(400).json({ error: `Patient "${patientName}" not found.  Please add the patient.` });
            }
            console.log("Patient ID: ")
            // console.log(results[0].Patient_ID)
            patientId = results[0].Patient_ID;
            console.log(patientId)
        
        
            // console.log(patientId)
            // 2. Get Physician ID
            const getPhysicianIdQuery = 'SELECT Employee_ID FROM Personnel WHERE Name = ? AND Personnel_Type = "Physician"';
            const physicianParams = [physicianName];
            var physicianId = null;
            db.query(getPhysicianIdQuery, physicianParams, (err, results) => {
                if (results.length === 0) {
                    return res.status(400).json({ error: `Physician "${physicianName}" not found.` });
                }
                physicianId = results[0].Employee_ID;
            
        
                // 3. Insert into Consultation_Schedule
                const insertAppointmentQuery = `
                    INSERT INTO Consultation_Schedule (
                        Patient_ID, Physician_ID, Date,  Time_Slot_Number
                    ) VALUES (?, ?, ?, ?)`;
                const insertParams = [patientId, physicianId, date,  timeSlot]; // Changed to Consultation_Schedule
                console.log(insertParams)
                db.query(insertAppointmentQuery, insertParams, (err, results) => {
                    if(err){
                        console.log(err)
                    }
                });
            });
            // await executeQuery(insertAppointmentQuery, insertParams);
            res.status(200).json({ message: 'Appointment scheduled successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to schedule appointment', details: error.message });
    }
});

// API endpoint to get surgeons
app.get('/api/surgeons', async (req, res) => {
    try {
        const query = `
            SELECT
                Employee_ID,
                Name
            FROM Personnel
            WHERE Personnel_Type = 'Surgeon'
        `;
        // const surgeons = await executeQuery(query);
        db.query(query, (err, results) => {
            if(err){
                console.log(err)
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch surgeons', details: error.message });
    }
});

// API endpoint to get surgery schedule with filtering
app.get('/api/surgerySchedule', async (req, res) => {
    const { date, surgeonName, patientName } = req.query;

    let query = `
        SELECT
            s.Surgery_ID,
            p.Name AS Patient_Name,
            per.Name AS Surgeon_Name,
            GROUP_CONCAT(pers.Name SEPARATOR ', ') AS Nurse_Names,  -- Changed to pers.Name
            s.Date,
            s.Operation_theatre
        FROM Surgery_Schedule s
        JOIN Patient p ON s.Patient_ID = p.Patient_ID
        JOIN Surgeon sur ON s.Surgeon_ID = sur.Surgeon_ID
        JOIN Personnel per ON sur.Employee_id = per.Employee_ID
        LEFT JOIN Assist_Surgery ass ON s.Schedule_ID = ass.Schedule_ID
        LEFT JOIN Nurse n ON ass.Nurse_ID = n.Nurse_ID  
        LEFT JOIN Personnel pers ON n.Employee_id = pers.Employee_ID -- Join Personnel to get Nurse Name
        WHERE 1=1
    `;
    const params = [];

    if (date) {
        query += ' AND s.Date = ?';
        params.push(date);
    }
    if (surgeonName) {
        query += ' AND per.Name = ?';
        params.push(surgeonName);
    }
    if (patientName) {
        query += ' AND p.Name = ?';
        params.push(patientName);
    }

    query += ' GROUP BY s.Schedule_ID';

    try {
        // const schedule = await executeQuery(query, params);
        db.query(query, params, (err, results) => {
            if(err){
                console.log(err)
            }
            res.json(results);
        });
        // res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch surgery schedule', details: error.message });
    }
});
});
// --------------------------- SERVER START ---------------------------

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
