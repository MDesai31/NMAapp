CREATE SCHEMA `newarkmedicalapp` ;
use `newarkmedicalapp`
CREATE TABLE Patient (
Patient_ID INT PRIMARY KEY,
Name VARCHAR(100),
Gender CHAR(1),
Date_of_birth DATE,
Address VARCHAR(255),
Phone_Number VARCHAR(20),
SSN VARCHAR(15),
Consultation_Req BOOLEAN,
Hospitalization_Req BOOLEAN
);
INSERT INTO Patient (Patient_ID, Name, Gender, Date_of_birth, Address, Phone_Number, SSN,
Consultation_Req, Hospitalization_Req)
VALUES
(1, 'John Doe', 'M', '1985-04-15', '123 Elm St, Springfield, IL', '555-1234', '123-45-6789', TRUE, TRUE),
(2, 'Jane Smith', 'F', '1990-08-22', '456 Oak Rd, Lincoln, NE', '555-2345', '234-56-7890', FALSE, TRUE),
(3, 'Samuel Johnson', 'M', '1975-01-30', '789 Pine Ln, Madison, WI', '555-3456', '345-67-8901', TRUE,
FALSE),
(4, 'Emily Davis', 'F', '1995-02-10', '234 Maple Ave, Orlando, FL', '555-4567', '456-78-9012', TRUE,
FALSE),
(5, 'Michael Brown', 'M', '1988-11-12', '567 Birch Blvd, Dallas, TX', '555-5678', '567-89-0123', FALSE,
TRUE),
(6, 'Sophia Wilson', 'F', '1992-07-03', '890 Cedar Dr, Tampa, FL', '555-6789', '678-90-1234', FALSE,
FALSE),
(7, 'William Moore', 'M', '1980-12-14', '123 Pine St, Chicago, IL', '555-7890', '789-01-2345', TRUE,
TRUE),
(8, 'Olivia Taylor', 'F', '2000-04-02', '456 Elm Rd, Austin, TX', '555-8901', '890-12-3456', TRUE, FALSE),
(9, 'Liam Martinez', 'M', '1997-09-18', '789 Oak Ave, Seattle, WA', '555-9012', '901-23-4567', FALSE,
TRUE),
(10, 'Ava Anderson', 'F', '1983-06-25', '234 Maple Blvd, Miami, FL', '555-0123', '012-34-5678', TRUE,
TRUE);

CREATE TABLE Personnel (
Employee_ID INT PRIMARY KEY,
Name VARCHAR(100),
Gender CHAR(1),
Address VARCHAR(255),
Phone_Number VARCHAR(20),
SSN VARCHAR(15),
Personnel_Type VARCHAR(50),
Is_Chief_Of_Staff BOOLEAN,
Job_Shift VARCHAR(20)
);
INSERT INTO Personnel (Employee_ID, Name, Gender, Address, Phone_Number, SSN,
Personnel_Type, Is_Chief_Of_Staff, Job_Shift)
VALUES
(1, 'Dr. John Adams', 'M', '321 Pine St, Chicago, IL', '555-2222', '123-45-6789', 'Physician', 1, 'Day'),
(2, 'Nurse Sarah Lee', 'F', '456 Birch Blvd, Dallas, TX', '555-3333', '234-56-7890', 'Nurse', 0, 'Night'),
(3, 'Dr. Mark Peterson', 'M', '789 Oak Dr, San Francisco, CA', '555-4444', '345-67-8901', 'Surgeon', 0,
'Day'),

(4, 'Nurse Julia Carter', 'F', '123 Cedar Ave, Miami, FL', '555-5555', '456-78-9012', 'Nurse', 0, 'Day'),
(5, 'Dr. Anna White', 'F', '234 Maple Rd, New York, NY', '555-6666', '567-89-0123', 'Physician', 1,
'Night'),
(6, 'Dr. David Smith', 'M', '567 Pine Ln, Austin, TX', '555-7777', '678-90-1234', 'Surgeon', 0, 'Day'),
(7, 'Nurse Linda Green', 'F', '890 Oak Blvd, Boston, MA', '555-8888', '789-01-2345', 'Nurse', 0, 'Night'),
(8, 'Dr. James Turner', 'M', '234 Cedar Blvd, Phoenix, AZ', '555-9999', '890-12-3456', 'Physician', 0,
'Night'),
(9, 'Nurse Emma Scott', 'F', '123 Birch Rd, Denver, CO', '555-0000', '901-23-4567', 'Nurse', 0, 'Day'),
(10, 'Dr. Michael Harris', 'M', '456 Pine St, Salt Lake City, UT', '555-1111', '012-34-5678', 'Surgeon', 1,
'Day');

CREATE TABLE Surgeon (
Surgeon_ID INT,
Employee_id INT,
Specialty VARCHAR(100),
Contract_type VARCHAR(50),
Contract_length INT,
Surgery_id INT,
Surgery_skill_id INT,
PRIMARY KEY (Surgeon_ID ),
FOREIGN KEY (Employee_id) REFERENCES Personnel(Employee_id)
);
INSERT INTO Surgeon (Surgeon_ID, Employee_id, Specialty, Contract_type, Contract_length,
Surgery_id, Surgery_skill_id)
VALUES
(1, 3, 'Cardiothoracic', 'Full-Time', 24, 101, 201),
(2, 6, 'Neurosurgery', 'Part-Time', 12, 102, 202),
(3, 10, 'Orthopedic', 'Full-Time', 36, 103, 203);

CREATE TABLE Physician (
Physician_ID INT,
Employee_id INT,
Specialty VARCHAR(100),
Salary DECIMAL(10, 2) CHECK (Salary BETWEEN 25000 AND 300000),
Has_Ownership BOOLEAN,
PRIMARY KEY (Physician_ID),
FOREIGN KEY (Employee_id) REFERENCES Personnel(Employee_ID)
);

INSERT INTO Physician (Physician_ID, Employee_id, Specialty, Salary, Has_Ownership)
VALUES
(1, 1, 'Internal Medicine', 175000.00, TRUE),
(2, 5, 'Pediatrics', 165000.00, TRUE),
(3, 8, 'Family Medicine', 150000.00, FALSE);

CREATE TABLE Nurse (
Nurse_ID INT PRIMARY KEY,
Employee_id INT,
Grade VARCHAR(10),
YOE INT,
Surgery_Skill_ID INT,
Salary DECIMAL(10, 2) CHECK (Salary BETWEEN 25000 AND 300000),

FOREIGN KEY (Employee_id) REFERENCES Personnel(Employee_ID)
);
INSERT INTO Nurse (Nurse_ID, Employee_id, Grade, YOE, surgery_skill_id, Salary)
VALUES
(1, 2, 'A', 5, 101, 75000.00),
(2, 4, 'B', 3, 102, 70000.00),
(3, 7, 'A', 7, 103, 80000.00),
(4, 9, 'C', 2, 101, 68000.00);

CREATE TABLE Surgery (
Surgery_ID INT PRIMARY KEY,
Name VARCHAR(100),
Category VARCHAR(50),
Anatomical_Location VARCHAR(100)
);

INSERT INTO Surgery (Surgery_ID, Name, Category, Anatomical_Location)
VALUES
(1, 'Appendectomy', 'H', 'Abdomen'),
(2, 'Knee Arthroscopy', 'O', 'Knee'),
(3, 'Cataract Surgery', 'O', 'Eye'),
(4, 'Coronary Artery Bypass Grafting', 'H', 'Heart'),
(5, 'Hip Replacement', 'H', 'Hip'),
(6, 'Tonsillectomy', 'O', 'Throat'),
(7, 'Hernia Repair', 'H', 'Abdomen'),
(8, 'Laparoscopic Gallbladder Surgery', 'O', 'Gallbladder'),
(9, 'Spinal Fusion', 'H', 'Spine'),
(10, 'Mastectomy', 'H', 'Breast');

CREATE TABLE Illness (
Illness_ID INT PRIMARY KEY,
Description TEXT
);
INSERT INTO Illness (Illness_ID, Description)
VALUES
(1, 'Type 1: No insulin.'),
(2, 'Type 2: Blood sugar.'),
(3, 'Hypertension: High BP.'),
(4, 'Asthma: Breathing issues.'),
(5, 'Pneumonia: Lung infection.'),
(6, 'Osteoarthritis: Joint pain.'),
(7, 'Influenza: Flu.'),
(8, 'Cancer: Abnormal cells.'),
(9, 'Chronic Kidney: Kidney failure.'),
(10, 'Epilepsy: Seizures.');

CREATE TABLE Allergies (
Allergy_ID INT PRIMARY KEY,
Description TEXT
);

INSERT INTO Allergies (Allergy_ID, Description)
VALUES
(1, 'Peanut: Severe reaction.'),
(2, 'Dust Mite: Asthma.'),
(3, 'Pollen: Hay fever.'),
(4, 'Milk: Reaction to milk.'),
(5, 'Egg: Reaction to eggs.'),
(6, 'Shellfish: Severe reaction.'),
(7, 'Wheat: Wheat reaction.'),
(8, 'Latex: Skin irritation.'),
(9, 'Insect Sting: Severe reaction.'),
(10, 'Soy: Soy reaction.');

CREATE TABLE Medication (
Medication_ID INT PRIMARY KEY,
Name VARCHAR(100),
Quantity_Available INT,
Quantity_on_Order INT,
Unit_Cost DECIMAL(10,2),
Year_to_date_usage INT
);
INSERT INTO Medication (Medication_ID, Name, Quantity_Available, Quantity_on_Order, Unit_Cost,
Year_to_date_usage)
VALUES
(1, 'Aspirin', 500, 200, 10.50, 300),
(2, 'Ibuprofen', 750, 300, 12.75, 500),
(3, 'Acetaminophen', 600, 250, 8.30, 450),
(4, 'Metformin', 400, 150, 15.20, 350),
(5, 'Lisinopril', 300, 100, 20.60, 200),
(6, 'Atorvastatin', 700, 350, 25.00, 550),
(7, 'Omeprazole', 800, 400, 18.00, 600),
(8, 'Simvastatin', 450, 200, 22.50, 400),
(9, 'Gabapentin', 600, 300, 14.90, 350),
(10, 'Losartan', 500, 250, 19.80, 420),
(11, 'Albuterol', 650, 300, 12.00, 470),
(12, 'Prednisone', 300, 150, 30.50, 250),
(13, 'Hydrochlorothiazide', 400, 100, 10.00, 300),
(14, 'Sertraline', 550, 250, 17.00, 400),
(15, 'Furosemide', 350, 150, 13.75, 220),
(16, 'Clopidogrel', 600, 200, 27.30, 370),
(17, 'Warfarin', 500, 200, 18.40, 300),
(18, 'Levothyroxine', 700, 350, 16.60, 550),
(19, 'Cetirizine', 800, 400, 9.50, 600),
(20, 'Loratadine', 750, 300, 11.00, 500);

CREATE TABLE Medication_Interaction (
Medication_Interaction_ID INT,
Medication_ID INT,
Medication_Type VARCHAR(50),
Severity VARCHAR(20),
PRIMARY KEY (Medication_Interaction_ID),
FOREIGN KEY (Medication_ID) REFERENCES Medication(Medication_ID)

);
INSERT INTO Medication_Interaction (Medication_Interaction_ID, Medication_ID, Medication_Type,
Severity)
VALUES
(1, 1, 'Painkiller', 'Moderate'),
(2, 2, 'Painkiller', 'Severe'),
(3, 3, 'Painkiller', 'Low'),
(4, 4, 'Antidiabetic', 'Moderate'),
(5, 5, 'Antihypertensive', 'Low'),
(6, 6, 'Cholesterol Lowering', 'High'),
(7, 7, 'Proton Pump Inhibitor', 'Low'),
(8, 8, 'Cholesterol Lowering', 'Moderate'),
(9, 9, 'Neurological', 'Low'),
(10, 10, 'Antihypertensive', 'Moderate'),
(11, 11, 'Respiratory', 'Low'),
(12, 12, 'Anti-inflammatory', 'Severe'),
(13, 13, 'Diuretic', 'Low'),
(14, 14, 'Antidepressant', 'Low'),
(15, 15, 'Diuretic', 'Low'),
(16, 16, 'Antiplatelet', 'Moderate'),
(17, 17, 'Anticoagulant', 'Severe'),
(18, 18, 'Thyroid', 'Low'),
(19, 19, 'Antihistamine', 'No Interaction'),
(20, 20, 'Antihistamine', 'No Interaction');

CREATE TABLE Clinic_Ownership (
Clinic_ID INT PRIMARY KEY,
Corporation_Name VARCHAR(100),
Headquarters VARCHAR(100),
Percentage_Ownership DECIMAL(5,2)
);
INSERT INTO Clinic_Ownership (Clinic_ID, Corporation_Name, Headquarters, Percentage_Ownership)
VALUES
(1, 'HealthCare Group', 'New York, NY', 55.00),
(2, 'MedCorp', 'Los Angeles, CA', 60.50),
(3, 'LifeCare Systems', 'Chicago, IL', 70.00),
(4, 'Wellness Partners', 'Dallas, TX', 80.25),
(5, 'Healthy Solutions', 'San Francisco, CA', 45.00),
(6, 'CarePlus Health', 'Miami, FL', 65.75),
(7, 'GlobalMed Inc.', 'Boston, MA', 50.00),
(8, 'VitalCare Health', 'Phoenix, AZ', 72.50),
(9, 'CareFirst Medical', 'Houston, TX', 77.30),
(10, 'PrimeMed Health', 'Atlanta, GA', 90.00);

CREATE TABLE Room_Arrangement (
Wing VARCHAR(10),
Bed_No VARCHAR(1),
Room_No INT,
Is_Available BOOLEAN,
PRIMARY KEY (Wing, Bed_No, Room_No)

);
INSERT INTO Room_Arrangement (Wing, Bed_No, Room_No, Is_Available)
VALUES
('Blue', 'A', 101, TRUE),
('Blue', 'B', 101, FALSE),
('Blue', 'A', 102, TRUE),
('Green', 'A', 201, TRUE),
('Green', 'B', 201, FALSE),
('Green', 'A', 202, TRUE),
('Blue', 'A', 103, TRUE),
('Green', 'B', 202, TRUE),
('Blue', 'B', 103, FALSE),
('Green', 'A', 203, TRUE);

CREATE TABLE Patient_Medication (
Patient_ID INT,
Medication_ID INT,
Physician_ID INT,
Medication_Interaction_ID INT,
Dosage VARCHAR(50),
Frequency VARCHAR(50),
PRIMARY KEY (Patient_ID, Medication_ID),
FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID),
FOREIGN KEY (Medication_ID) REFERENCES Medication(Medication_ID),
FOREIGN KEY (Physician_ID) REFERENCES Physician(Physician_ID),
FOREIGN KEY (Medication_Interaction_ID) REFERENCES
Medication_Interaction(Medication_Interaction_ID)
);

INSERT INTO Patient_Medication (Patient_ID, Medication_ID, Physician_ID,
Medication_Interaction_ID, Dosage, Frequency)
VALUES
(1, 1, 1, 1, '100mg', 'Once a day'),
(2, 2, 2, 2, '200mg', 'Twice a day'),
(3, 3, 3, 3, '500mg', 'Once every 6 hours'),
(4, 4, 1, 4, '850mg', 'Twice a day'),
(5, 5, 2, 5, '10mg', 'Once a day'),
(6, 6, 3, 6, '20mg', 'Once daily'),
(7, 7, 1, 7, '40mg', 'At bedtime'),
(8, 8, 2, 8, '20mg', 'Twice daily'),
(9, 9, 3, 9, '300mg', 'Every 8 hours'),
(10, 10, 1, 10, '50mg', 'Once daily');

CREATE TABLE Surgery_Schedule (
Schedule_ID INT,
Surgery_ID INT,
Patient_ID INT,
Surgeon_ID INT,
Number_of_Nurses_required INT,
Date DATE,
Operation_theatre VARCHAR(50),
PRIMARY KEY (Schedule_ID),
FOREIGN KEY (Surgery_ID) REFERENCES Surgery(Surgery_ID),

FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID),
FOREIGN KEY (Surgeon_ID) REFERENCES Surgeon(Surgeon_ID)
);

INSERT INTO Surgery_Schedule (Schedule_ID, Surgery_ID, Patient_ID, Surgeon_ID,
Number_of_Nurses_required, Date, Operation_theatre)
VALUES
(1, 1, 1, 1, 3, '2025-05-01', 'OT-101'),
(2, 2, 2, 2, 2, '2025-05-02', 'OT-102'),
(3, 3, 3, 3, 4, '2025-05-03', 'OT-103'),
(4, 4, 4, 1, 3, '2025-05-04', 'OT-101'),
(5, 5, 5, 2, 2, '2025-05-05', 'OT-102'),
(6, 6, 6, 3, 4, '2025-05-06', 'OT-103'),
(7, 7, 7, 1, 3, '2025-05-07', 'OT-101'),
(8, 8, 8, 2, 2, '2025-05-08', 'OT-102'),
(9, 9, 9, 3, 4, '2025-05-09', 'OT-103'),
(10, 10, 10, 1, 3, '2025-05-10', 'OT-101');

CREATE TABLE In_patient (
Patient_ID INT,
Nurse_ID INT,
Admission_Date DATE,
Nursing_Unit INT CHECK (Nursing_Unit BETWEEN 1 AND 7),
Room_No INT,
Bed_No VARCHAR(1),
Wing VARCHAR(10),
PRIMARY KEY (Patient_ID, Nurse_ID),
FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID),
FOREIGN KEY (Nurse_ID) REFERENCES Nurse(Nurse_ID),
FOREIGN KEY (Wing, Bed_No, Room_No) REFERENCES Room_Arrangement(Wing, Bed_No,
Room_No)
);
INSERT INTO In_patient (Patient_ID, Nurse_ID, Admission_Date, Nursing_Unit, Room_No, Bed_No,
Wing)
VALUES
(1, 1, '2025-04-10', 3, 101, 'A', 'Blue'),
(2, 2, '2025-04-09', 5, 201, 'A', 'Green'),
(5, 3, '2025-04-11', 4, 102, 'A', 'Blue'),
(7, 4, '2025-04-08', 6, 202, 'A', 'Green'),
(6, 4, '2025-04-13', 3, 202, 'B', 'Green'),
(3, 1, '2025-04-14', 7, 103, 'A', 'Blue'),
(4, 3, '2025-04-15', 5, 203, 'A', 'Green');

CREATE TABLE Patient_Medical (
Patient_ID INT,
Allergy_ID INT,
Illness_ID INT,
HDL DECIMAL(5,2),
LDL DECIMAL(5,2),

Triglyceride DECIMAL(5,2),
Heart_Risk_Category VARCHAR(10),
Cholesterol_HDL_Ratio DECIMAL(5,2),
Total_Cholesterol DECIMAL(5,2),
Blood_Type VARCHAR(5),
Blood_Sugar DECIMAL(5,2),
PRIMARY KEY (Patient_ID, Allergy_ID, Illness_ID),
FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID),
FOREIGN KEY (Allergy_ID) REFERENCES Allergies(Allergy_ID),
FOREIGN KEY (Illness_ID) REFERENCES Illness(Illness_ID)
);
INSERT INTO Patient_Medical (Patient_ID, Allergy_ID, Illness_ID, HDL, LDL, Triglyceride,
Heart_Risk_Category, Cholesterol_HDL_Ratio, Total_Cholesterol, Blood_Type, Blood_Sugar)
VALUES
(1, 1, 3, 50, 150, 120, 'High', 3.0, 210, 'O+', 110),
(2, 2, 5, 60, 140, 130, 'Moderate', 2.5, 200, 'A-', 95),
(3, 3, 7, 55, 130, 100, 'Low', 4.0, 180, 'B+', 90),
(4, 4, 6, 45, 160, 110, 'High', 3.2, 220, 'AB+', 120),
(5, 5, 8, 65, 120, 115, 'Low', 2.0, 190, 'O-', 85),
(6, 6, 4, 55, 150, 125, 'Moderate', 2.8, 200, 'A+', 100),
(7, 7, 9, 60, 145, 105, 'High', 3.3, 210, 'B-', 115),
(8, 8, 2, 70, 110, 95, 'Low', 1.8, 175, 'AB-', 80),
(9, 9, 1, 50, 140, 120, 'Moderate', 2.7, 195, 'O+', 130),
(10, 10, 10, 60, 135, 110, 'High', 3.1, 205, 'B+', 140);

CREATE TABLE Consultation_Schedule (
Consultation_ID INT,
Physician_ID INT,
Patient_ID INT,
Date DATE,
Surgery_Required BOOLEAN,
Medication_Required BOOLEAN,
PRIMARY KEY (Consultation_ID, Physician_ID, Patient_ID),
FOREIGN KEY (Physician_ID) REFERENCES Physician(Physician_ID),
FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID)
);
INSERT INTO Consultation_Schedule (Consultation_ID, Physician_ID, Patient_ID, Date,
Surgery_Required, Medication_Required)
VALUES
(1, 1, 1, '2025-04-20', TRUE, TRUE),
(2, 2, 2, '2025-04-21', FALSE, TRUE),
(3, 3, 3, '2025-04-22', TRUE, FALSE),
(4, 1, 4, '2025-04-23', FALSE, FALSE),
(5, 2, 5, '2025-04-24', TRUE, TRUE),
(6, 3, 6, '2025-04-25', FALSE, TRUE),
(7, 1, 7, '2025-04-26', TRUE, FALSE),
(8, 2, 8, '2025-04-27', FALSE, FALSE),
(9, 3, 9, '2025-04-28', TRUE, TRUE);

CREATE TABLE Surgery_Skills (
Surgery_Skill_ID INT,
Surgery_ID INT,

Skill_Name VARCHAR(255),
PRIMARY KEY (Surgery_Skill_ID),
FOREIGN KEY (Surgery_ID) REFERENCES Surgery(Surgery_ID)
);
INSERT INTO Surgery_Skills (Surgery_Skill_ID, Surgery_ID, Skill_Name)
VALUES
(1, 1, 'General Anesthesia'),
(2, 1, 'Abdominal Incision'),
(3, 2, 'Knee Arthroscopy'),
(4, 2, 'Knee Joint Manipulation'),
(5, 3, 'Lens Removal'),
(6, 3, 'Intraocular Lens Implantation'),
(7, 4, 'Coronary Artery Dissection'),
(8, 4, 'Graft Harvesting'),
(9, 5, 'Hip Joint Replacement'),
(10, 5, 'Bone Cementing');

CREATE TABLE Assist_Surgery (
Schedule_ID INT,
Nurse_ID INT,
PRIMARY KEY (Schedule_ID, Nurse_ID),
FOREIGN KEY (Schedule_ID) REFERENCES Surgery_Schedule(Schedule_ID),
FOREIGN KEY (Nurse_ID) REFERENCES Nurse(Nurse_ID)
);
INSERT INTO Assist_Surgery (Schedule_ID, Nurse_ID)
VALUES
(1, 2),
(2, 4),
(3, 1),
(4, 3),
(5, 2),
(6, 1),
(7, 3),
(8, 4),
(9, 1),
(10, 2);

CREATE TABLE Nurse_Skills_Needed (
Nurse_ID INT,
Surgery_Skill_ID INT,
PRIMARY KEY (Nurse_ID, Surgery_Skill_ID),
FOREIGN KEY (Nurse_ID) REFERENCES Nurse(Nurse_ID),
FOREIGN KEY (Surgery_Skill_ID) REFERENCES Surgery_Skills(Surgery_Skill_ID)
);
INSERT INTO Nurse_Skills_Needed (Nurse_ID, Surgery_Skill_ID)
VALUES
(2, 1),
(4, 2),
(1, 3),
(3, 4),
(1, 5),

(1, 6),
(1, 7),
(3, 8),
(4, 9),
(1, 10);

CREATE TABLE Surgery_Skills_Required (
Surgery_ID INT,
Surgery_Skill_ID INT,
PRIMARY KEY (Surgery_ID, Surgery_Skill_ID),
FOREIGN KEY (Surgery_ID) REFERENCES Surgery(Surgery_ID),
FOREIGN KEY (Surgery_Skill_ID) REFERENCES Surgery_Skills(Surgery_Skill_ID)
);
INSERT INTO Surgery_Skills_Required (Surgery_ID, Surgery_Skill_ID)
VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 5),
(3, 6),
(4, 7),
(4, 8),
(5, 9),
(5, 10);

CREATE TABLE Surgeon_Skills (
Surgeon_ID INT,
Surgery_ID INT,
PRIMARY KEY (Surgeon_ID, Surgery_ID),
FOREIGN KEY (Surgeon_ID) REFERENCES Surgeon(Surgeon_ID),
FOREIGN KEY (Surgery_ID) REFERENCES Surgery(Surgery_ID)
);
INSERT INTO Surgeon_Skills (Surgeon_ID, Surgery_ID)
VALUES
(1, 1),
(2, 2),
(3, 3),
(1, 4),
(2, 5),
(3, 6),
(1, 7),
(2, 8),
(3, 9),
(1, 10);

CREATE TABLE Patient_Allergies (
Allergy_ID INT,
Patient_ID INT,
PRIMARY KEY (Allergy_ID, Patient_ID),
FOREIGN KEY (Allergy_ID) REFERENCES Allergies(Allergy_ID),
FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID)

);
INSERT INTO Patient_Allergies (Allergy_ID, Patient_ID)
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

CREATE TABLE Patient_Illness (
Illness_ID INT,
Patient_ID INT,
PRIMARY KEY (Illness_ID, Patient_ID),
FOREIGN KEY (Illness_ID) REFERENCES Illness(Illness_ID),
FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID)
);
INSERT INTO Patient_Illness (Illness_ID, Patient_ID)
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

CREATE TABLE Check_Availability (
Patient_ID INT,
Medication_ID INT,
PRIMARY KEY (Patient_ID, Medication_ID),
FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID),
FOREIGN KEY (Medication_ID) REFERENCES Medication(Medication_ID)
);
INSERT INTO Check_Availability (Patient_ID, Medication_ID)
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),

(10, 10);

CREATE TABLE Interaction_Outcomes (
Patient_ID INT,
Medication_Interaction_ID INT,
PRIMARY KEY (Patient_ID, Medication_Interaction_ID),
FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID),
FOREIGN KEY (Medication_Interaction_ID) REFERENCES
Medication_Interaction(Medication_Interaction_ID)
);
INSERT INTO Interaction_Outcomes (Patient_ID, Medication_Interaction_ID)
VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 6),
(6, 7),
(7, 8),
(8, 9),
(9, 10),
(10, 11),
(2, 12),
(3, 13),
(4, 14),
(5, 15),
(6, 16),
(7, 17),
(8, 18),
(9, 19),
(10, 20);

CREATE TABLE Patient_Physician (
Patient_ID INT,
Physician_ID INT,
PRIMARY KEY (Patient_ID, Physician_ID),
FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID),
FOREIGN KEY (Physician_ID) REFERENCES Physician(Physician_ID)
);
INSERT INTO Patient_Physician (Patient_ID, Physician_ID)
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 1),
(5, 2),
(6, 3),
(7, 1),
(8, 2),
(9, 3),
(10, 1);