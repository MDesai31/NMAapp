CREATE SCHEMA `newarkmedicalapp` ;
USE `newarkmedicalapp`;

-- --------------------------------------
CREATE TABLE Illness (
    Illness_ID INT PRIMARY KEY AUTO_INCREMENT,
    Description TEXT
);

CREATE TABLE Allergies (
    Allergy_ID INT PRIMARY KEY AUTO_INCREMENT,
    Description TEXT
);

CREATE TABLE Medication (
    Medication_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100),
    Quantity_Available INT,
    Quantity_on_Order INT,
    Unit_Cost DECIMAL(10,2),
    Year_to_date_usage INT
);

CREATE TABLE Medication_Interaction (
    Medication_Interaction_ID INT PRIMARY KEY AUTO_INCREMENT,
    Medication_ID INT,
    Medication_Type VARCHAR(50),
    Severity VARCHAR(20),
    FOREIGN KEY (Medication_ID) REFERENCES Medication(Medication_ID)
);

CREATE TABLE Clinic_Ownership (
    Clinic_ID INT PRIMARY KEY AUTO_INCREMENT,
    Corporation_Name VARCHAR(100),
    Headquarters VARCHAR(100),
    Percentage_Ownership DECIMAL(5,2)
);

CREATE TABLE Time_Slots (
    slot_number INT PRIMARY KEY AUTO_INCREMENT,
    time TIME NOT NULL,
    shift_type VARCHAR(20) NOT NULL,
    UNIQUE (time, shift_type)
);

CREATE TABLE Personnel (
    Employee_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100),
    Gender CHAR(1),
    Address VARCHAR(255),
    Phone_Number VARCHAR(20),
    SSN VARCHAR(15),
    Personnel_Type VARCHAR(50),
    Is_Chief_Of_Staff BOOLEAN,
    Job_Shift VARCHAR(20)
);

CREATE TABLE Physician (
    Physician_ID INT PRIMARY KEY AUTO_INCREMENT,
    Employee_ID INT,
    Specialty VARCHAR(100),
    Salary DECIMAL(10, 2) CHECK (Salary BETWEEN 25000 AND 300000),
    Has_Ownership BOOLEAN,
    FOREIGN KEY (Employee_ID) REFERENCES Personnel(Employee_ID)
);

CREATE TABLE Nurse (
    Nurse_ID INT PRIMARY KEY AUTO_INCREMENT,
    Employee_ID INT,
    Grade VARCHAR(10),
    YOE INT,
    Salary DECIMAL(10, 2) CHECK (Salary BETWEEN 25000 AND 300000),
    FOREIGN KEY (Employee_ID) REFERENCES Personnel(Employee_ID)
);

CREATE TABLE Surgeon (
    Surgeon_ID INT PRIMARY KEY AUTO_INCREMENT,
    Employee_ID INT,
    Specialty VARCHAR(100),
    Contract_type VARCHAR(50),
    Contract_length INT,
    Surgery_id INT,
    Surgery_skill_id INT,
    FOREIGN KEY (Employee_ID) REFERENCES Personnel(Employee_ID) ON DELETE RESTRICT
);

CREATE TABLE Surgery (
    Surgery_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100),
    Category VARCHAR(50),
    Anatomical_Location VARCHAR(100),
    Number_of_Nurses_required INT
);

CREATE TABLE Patient (
    Patient_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100),
    Gender CHAR(1),
    Date_of_birth DATE,
    Address VARCHAR(255),
    Phone_Number VARCHAR(20),
    SSN VARCHAR(15),
    Consultation_Req BOOLEAN,
    Hospitalization_Req BOOLEAN,
    Primary_Physician_ID INT,
    FOREIGN KEY (Primary_Physician_ID) REFERENCES Physician(Physician_ID)
);


CREATE TABLE Room_Arrangement (
    Wing VARCHAR(10),
    Bed_No VARCHAR(1),
    Room_No INT,
    Is_Available BOOLEAN,
    PRIMARY KEY (Wing, Bed_No, Room_No)
);



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
    FOREIGN KEY (Physician_ID) REFERENCES Physician(Physician_ID) ON DELETE CASCADE,
    FOREIGN KEY (Medication_Interaction_ID) REFERENCES Medication_Interaction(Medication_Interaction_ID)
);



CREATE TABLE Surgery_Schedule (
    Schedule_ID INT PRIMARY KEY AUTO_INCREMENT,
    Surgery_ID INT,
    Patient_ID INT,
    Surgeon_ID INT,
    Date DATE,
    Operation_theatre VARCHAR(50),
    FOREIGN KEY (Surgery_ID) REFERENCES Surgery(Surgery_ID),
    FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID),
    FOREIGN KEY (Surgeon_ID) REFERENCES Surgeon(Surgeon_ID)
);

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
    FOREIGN KEY (Wing, Bed_No, Room_No) REFERENCES Room_Arrangement(Wing, Bed_No, Room_No)
);

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



CREATE TABLE Consultation_Schedule (
    Consultation_ID INT PRIMARY KEY AUTO_INCREMENT,
    Patient_ID INT,
    Physician_ID INT,
    Date DATE,
    Time_Slot_Number INT,
    FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID),
    FOREIGN KEY (Physician_ID) REFERENCES Physician(Physician_ID),
    FOREIGN KEY (Time_Slot_Number) REFERENCES Time_Slots(slot_number)
);

CREATE TABLE Surgery_Skills (
    Surgery_Skill_ID INT PRIMARY KEY AUTO_INCREMENT,
    Surgery_ID INT,
    Skill_Name VARCHAR(255),
    FOREIGN KEY (Surgery_ID) REFERENCES Surgery(Surgery_ID)
);

CREATE TABLE Assist_Surgery (
    Schedule_ID INT,
    Nurse_ID INT,
    PRIMARY KEY (Schedule_ID, Nurse_ID),
    FOREIGN KEY (Schedule_ID) REFERENCES Surgery_Schedule(Schedule_ID),
    FOREIGN KEY (Nurse_ID) REFERENCES Nurse(Nurse_ID)
);

CREATE TABLE Nurse_Surgery_Assignment (
    Nurse_ID INT,
    Surgery_ID INT,
    PRIMARY KEY (Nurse_ID, Surgery_ID),
    FOREIGN KEY (Nurse_ID) REFERENCES Nurse(Nurse_ID),
    FOREIGN KEY (Surgery_ID) REFERENCES Surgery(Surgery_ID)
);

CREATE TABLE Surgery_Skills_Required (
    Surgery_ID INT,
    Surgery_Skill_ID INT,
    PRIMARY KEY (Surgery_ID, Surgery_Skill_ID),
    FOREIGN KEY (Surgery_ID) REFERENCES Surgery(Surgery_ID),
    FOREIGN KEY (Surgery_Skill_ID) REFERENCES Surgery_Skills(Surgery_Skill_ID)
);

CREATE TABLE Surgeon_Skills (
    Surgeon_ID INT,
    Surgery_ID INT,
    PRIMARY KEY (Surgeon_ID, Surgery_ID),
    FOREIGN KEY (Surgeon_ID) REFERENCES Surgeon(Surgeon_ID),
    FOREIGN KEY (Surgery_ID) REFERENCES Surgery(Surgery_ID)
);

CREATE TABLE Patient_Allergies (
    Allergy_ID INT,
    Patient_ID INT,
    PRIMARY KEY (Allergy_ID, Patient_ID),
    FOREIGN KEY (Allergy_ID) REFERENCES Allergies(Allergy_ID),
    FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID)
);

CREATE TABLE Patient_Illness (
    Illness_ID INT,
    Patient_ID INT,
    PRIMARY KEY (Illness_ID, Patient_ID),
    FOREIGN KEY (Illness_ID) REFERENCES Illness(Illness_ID),
    FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID)
);

CREATE TABLE Check_Availability (
    Patient_ID INT,
    Medication_ID INT,
    PRIMARY KEY (Patient_ID, Medication_ID),
    FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID),
    FOREIGN KEY (Medication_ID) REFERENCES Medication(Medication_ID)
);

CREATE TABLE Interaction_Outcomes (
    Patient_ID INT,
    Medication_Interaction_ID INT,
    PRIMARY KEY (Patient_ID, Medication_Interaction_ID),
    FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID),
    FOREIGN KEY (Medication_Interaction_ID) REFERENCES Medication_Interaction(Medication_Interaction_ID)
);

CREATE TABLE Patient_Physician (
    Patient_ID INT,
    Physician_ID INT,
    PRIMARY KEY (Patient_ID, Physician_ID),
    FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID),
    FOREIGN KEY (Physician_ID) REFERENCES Physician(Physician_ID)
);

CREATE TABLE staff_shifts (
    Employee_ID INT,
    shift_date DATE,
    shift_type VARCHAR(20),
    FOREIGN KEY (Employee_ID) REFERENCES personnel(Employee_ID) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------------------------------------------------

DELIMITER //  -- Change the delimiter to something other than ';'
CREATE TRIGGER Physician_Leave_Trigger
BEFORE DELETE ON Physician
FOR EACH ROW
BEGIN
    UPDATE Patient
    SET Primary_Physician_ID = (SELECT Employee_ID FROM Personnel WHERE Is_Chief_Of_Staff = TRUE)
    WHERE Primary_Physician_ID = OLD.Physician_ID;
END //
DELIMITER ;  -- Change the delimiter back to ';'

-- ---------------------------------------------------------------------------------------------------------------------
-- Populate tables
-- ---------------------------------------------------------------------------------------------------------------------
-- Populate the Illness table
INSERT INTO Illness (Description)
VALUES
    ('Type 1 Diabetes: No insulin production.'),
    ('Type 2 Diabetes: Insulin resistance.'),
    ('Hypertension: High blood pressure.'),
    ('Asthma: Chronic respiratory disease.'),
    ('Pneumonia: Lung infection.'),
    ('Osteoarthritis: Joint degeneration.'),
    ('Influenza: Viral respiratory infection.'),
    ('Cancer: Uncontrolled cell growth.'),
    ('Chronic Kidney Disease: Gradual loss of kidney function.'),
    ('Epilepsy: Seizures and neurological disorder.');

-- Populate the Allergies table
INSERT INTO Allergies (Description)
VALUES
    ('Peanut allergy: Severe allergic reaction.'),
    ('Dust mite allergy: Respiratory symptoms.'),
    ('Pollen allergy: Seasonal allergic rhinitis.'),
    ('Milk allergy: Reaction to milk proteins.'),
    ('Egg allergy: Reaction to egg proteins.'),
    ('Shellfish allergy: Allergy to crustaceans and mollusks.'),
    ('Wheat allergy: Allergy to wheat gluten.'),
    ('Latex allergy: Reaction to natural rubber latex.'),
    ('Insect sting allergy: Allergic reaction to insect venom.'),
    ('Soy allergy: Allergy to soy products.');

-- Populate the Medication table
INSERT INTO Medication (Name, Quantity_Available, Quantity_on_Order, Unit_Cost, Year_to_date_usage)
VALUES
    ('Aspirin', 500, 200, 10.50, 300),
    ('Ibuprofen', 750, 300, 12.75, 500),
    ('Acetaminophen', 600, 250, 8.30, 450),
    ('Metformin', 400, 150, 15.20, 350),
    ('Lisinopril', 300, 100, 20.60, 200),
    ('Atorvastatin', 700, 350, 25.00, 550),
    ('Omeprazole', 800, 400, 18.00, 600),
    ('Simvastatin', 450, 200, 22.50, 400),
    ('Gabapentin', 600, 300, 14.90, 350),
    ('Losartan', 500, 250, 19.80, 420),
    ('Albuterol', 650, 300, 12.00, 470),
    ('Prednisone', 300, 150, 30.50, 250),
    ('Hydrochlorothiazide', 400, 100, 10.00, 300),
    ('Sertraline', 550, 250, 17.00, 400),
    ('Furosemide', 350, 150, 13.75, 220),
    ('Clopidogrel', 600, 200, 27.30, 370),
    ('Warfarin', 500, 200, 18.40, 300),
    ('Levothyroxine', 700, 350, 16.60, 550),
    ('Cetirizine', 800, 400, 9.50, 600),
    ('Loratadine', 750, 300, 11.00, 500);

-- Populate the Medication_Interaction table
INSERT INTO Medication_Interaction (Medication_ID, Medication_Type, Severity)
VALUES
    (1, 'Painkiller', 'Moderate'),
    (2, 'Painkiller', 'Severe'),
    (3, 'Painkiller', 'Low'),
    (4, 'Antidiabetic', 'Moderate'),
    (5, 'Antihypertensive', 'Low'),
    (6, 'Cholesterol Lowering', 'High'),
    (7, 'Proton Pump Inhibitor', 'Low'),
    (8, 'Cholesterol Lowering', 'Moderate'),
    (9, 'Neurological', 'Low'),
    (10, 'Antihypertensive', 'Moderate'),
    (11, 'Respiratory', 'Low'),
    (12, 'Anti-inflammatory', 'Severe'),
    (13, 'Diuretic', 'Low'),
    (14, 'Antidepressant', 'Low'),
    (15, 'Diuretic', 'Low'),
    (16, 'Antiplatelet', 'Moderate'),
    (17, 'Anticoagulant', 'Severe'),
    (18, 'Thyroid', 'Low'),
    (19, 'Antihistamine', 'No Interaction'),
    (20, 'Antihistamine', 'No Interaction');

-- Populate the Clinic_Ownership table
INSERT INTO Clinic_Ownership (Corporation_Name, Headquarters, Percentage_Ownership)
VALUES
    ('HealthCare Group', 'New York, NY', 55.00),
    ('MedCorp', 'Los Angeles, CA', 60.50),
    ('LifeCare Systems', 'Chicago, IL', 70.00),
    ('Wellness Partners', 'Dallas, TX', 80.25),
    ('Healthy Solutions', 'San Francisco, CA', 45.00),
    ('CarePlus Health', 'Miami, FL', 65.75),
    ('GlobalMed Inc.', 'Boston, MA', 50.00),
    ('VitalCare Health', 'Phoenix, AZ', 72.50),
    ('CareFirst Medical', 'Houston, TX', 77.30),
    ('PrimeMed Health', 'Atlanta, GA', 90.00);

-- Populate Time_Slots table
INSERT INTO Time_Slots (time, shift_type) VALUES
('09:00:00', 'Day'),
('10:00:00', 'Day'),
('11:00:00', 'Day'),
('13:00:00', 'Night'),
('14:00:00', 'Night'),
('15:00:00', 'Night');

INSERT INTO Personnel (Name, Gender, Address, Phone_Number, SSN, Personnel_Type, Is_Chief_Of_Staff, Job_Shift)
VALUES
    ('Dr. John Adams', 'M', '321 Pine St, Chicago, IL', '555-2222', '123-45-6789', 'Physician', 1, 'Day'),
    ('Nurse Sarah Lee', 'F', '456 Birch Blvd, Dallas, TX', '555-3333', '234-56-7890', 'Nurse', 0, 'Night'),
    ('Dr. Mark Peterson', 'M', '789 Oak Dr, San Francisco, CA', '555-4444', '345-67-8901', 'Surgeon', 0, 'Day'),
    ('Nurse Julia Carter', 'F', '123 Cedar Ave, Miami, FL', '555-5555', '456-78-9012', 'Nurse', 0, 'Day'),
    ('Dr. Anna White', 'F', '234 Maple Rd, New York, NY', '555-6666', '567-89-0123', 'Physician', 0, 'Night'),
    ('Dr. David Smith', 'M', '567 Pine Ln, Austin, TX', '555-7777', '678-90-1234', 'Surgeon', 0, 'Day'),
    ('Nurse Linda Green', 'F', '890 Oak Blvd, Boston, MA', '555-8888', '789-01-2345', 'Nurse', 0, 'Night'),
    ('Dr. James Turner', 'M', '234 Cedar Blvd, Phoenix, AZ', '555-9999', '890-12-3456', 'Physician', 0, 'Night'),
    ('Nurse Emma Scott', 'F', '123 Birch Rd, Denver, CO', '555-0000', '901-23-4567', 'Nurse', 0, 'Day'),
    ('Dr. Michael Harris', 'M', '456 Pine St, Salt Lake City, UT', '555-1111', '012-34-5678', 'Surgeon', 0, 'Day'),
    ('Nurse Emily Carter', 'F', '789 Pine Ln, Austin, TX', '555-9876', '987-65-4321', 'Nurse', 0, 'Day'),
    ('Nurse David Rodriguez', 'M', '894 James St, Los Angeles, CA', '897-4578', '123-87-9864', 'Nurse', 0, 'Night'),
    ('Nurse Thelma Louise', 'F', '4697 St.Jose Blvd, Orlando, FL', '164-9000', '972-46-6431', 'Nurse', 0, 'Day');

INSERT INTO Physician (Employee_ID, Specialty, Salary, Has_Ownership)
VALUES
    (1, 'Internal Medicine', 175000.00, TRUE),  -- Dr. John Adams
    (5, 'Pediatrics', 165000.00, TRUE),       -- Dr. Anna White
    (8, 'Family Medicine', 150000.00, FALSE);     -- Dr. James Turner

INSERT INTO Nurse (Employee_ID, Grade, YOE, Salary)
VALUES
    (2, 'Senior', 5, 75000.00),
    (4, 'Senior', 3, 70000.00),
    (7, 'Senior', 7, 80000.00),
    (9, 'Junior', 2, 68000.00),
    (11, 'Junior', 5, 60000.00),
    (12, 'Junior', 2, 35000.00),
    (13, 'Senior', 7, 70000.00);


INSERT INTO Surgeon (Employee_ID, Specialty, Contract_type, Contract_length)
VALUES
    (3, 'Cardiothoracic', 'Full-Time', 24), -- Dr. Mark Peterson
    (6, 'Neurosurgery', 'Part-Time', 12),   -- Dr. David Smith
    (10, 'Orthopedic', 'Full-Time', 36);     -- Dr. Michael Harris

INSERT INTO Surgery (Name, Category, Anatomical_Location, Number_of_Nurses_required)
VALUES
    ('Appendectomy', 'H', 'Abdomen', 3),
    ('Knee Arthroscopy', 'O', 'Knee', 2),
    ('Cataract Surgery', 'O', 'Eye', 4),
    ('Coronary Artery Bypass Grafting', 'H', 'Heart', 3),
    ('Hip Replacement', 'H', 'Hip', 2),
    ('Tonsillectomy', 'O', 'Throat', 4),
    ('Hernia Repair', 'H', 'Abdomen', 3),
    ('Laparoscopic Gallbladder Surgery', 'O', 'Gallbladder', 2),
    ('Spinal Fusion', 'H', 'Spine', 4),
    ('Mastectomy', 'H', 'Breast', 3);

INSERT INTO Patient (Name, Gender, Date_of_birth, Address, Phone_Number, SSN, Consultation_Req, Hospitalization_Req, Primary_Physician_ID)
VALUES
    ('John Doe', 'M', '1985-04-15', '123 Elm St, Springfield, IL', '555-1234', '123-45-6789', TRUE, TRUE, 1),
    ('Jane Smith', 'F', '1990-08-22', '456 Oak Rd, Lincoln, NE', '555-2345', '234-56-7890', FALSE, TRUE, 2),
    ('Samuel Johnson', 'M', '1975-01-30', '789 Pine Ln, Madison, WI', '555-3456', '345-67-8901', TRUE, FALSE, 3),
    ('Emily Davis', 'F', '1995-02-10', '234 Maple Ave, Orlando, FL', '555-4567', '456-78-9012', TRUE, FALSE, 1),
    ('Michael Brown', 'M', '1988-11-12', '567 Birch Blvd, Dallas, TX', '555-5678', '567-89-0123', FALSE, TRUE, 2),
    ('Sophia Wilson', 'F', '1992-07-03', '890 Cedar Dr, Tampa, FL', '555-6789', '678-90-1234', FALSE, FALSE, 3),
    ('William Moore', 'M', '1980-12-14', '123 Pine St, Chicago, IL', '555-7890', '789-01-2345', TRUE, TRUE, 1),
    ('Olivia Taylor', 'F', '2000-04-02', '456 Elm Rd, Austin, TX', '555-8901', '890-12-3456', TRUE, FALSE, 2),
    ('Liam Martinez', 'M', '1997-09-18', '789 Oak Ave, Seattle, WA', '555-9012', '901-23-4567', FALSE, TRUE, 3),
    ('Ava Anderson', 'F', '1983-06-25', '234 Maple Blvd, Miami, FL', '555-0123', '012-34-5678', TRUE, TRUE, 1);

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

INSERT INTO Patient_Medication (Patient_ID, Medication_ID, Physician_ID, Medication_Interaction_ID, Dosage, Frequency)
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

INSERT INTO Surgery_Schedule (Surgery_ID, Patient_ID, Surgeon_ID, Date, Operation_theatre)
VALUES
    (1, 1, 1, '2025-05-01', 'OT-101'),
    (2, 2, 2, '2025-05-02', 'OT-102'),
    (3, 3, 3, '2025-05-03', 'OT-103'),
    (4, 4, 1, '2025-05-04', 'OT-101'),
    (5, 5, 2, '2025-05-05', 'OT-102'),
    (6, 6, 3, '2025-05-06', 'OT-103'),
    (7, 7, 1, '2025-05-07', 'OT-101'),
    (8, 8, 2, '2025-05-08', 'OT-102'),
    (9, 9, 3, '2025-05-09', 'OT-103'),
    (10, 10, 1, '2025-05-10', 'OT-101');

INSERT INTO In_patient (Patient_ID, Nurse_ID, Admission_Date, Nursing_Unit, Room_No, Bed_No, Wing)
VALUES
    (1, 1, '2025-04-10', 3, 101, 'A', 'Blue'),
    (2, 2, '2025-04-09', 5, 201, 'A', 'Green'),
    (5, 3, '2025-04-11', 4, 102, 'A', 'Blue'),
    (7, 4, '2025-04-08', 6, 202, 'A', 'Green'),
    (6, 4, '2025-04-13', 3, 202, 'B', 'Green'),
    (3, 1, '2025-04-14', 7, 103, 'A', 'Blue'),
    (4, 3, '2025-04-15', 5, 203, 'A', 'Green');

INSERT INTO Patient_Medical (Patient_ID, Allergy_ID, Illness_ID, HDL, LDL, Triglyceride, Heart_Risk_Category, Cholesterol_HDL_Ratio, Total_Cholesterol, Blood_Type, Blood_Sugar)
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

INSERT INTO Consultation_Schedule (Patient_ID, Physician_ID, Date, Time_Slot_Number)
VALUES
    (1, 1, '2025-05-01', 1),
    (2, 2, '2025-05-02', 2),
    (3, 3, '2025-05-03', 3),
    (4, 1, '2025-05-04', 4),
    (5, 2, '2025-05-05', 5),
    (6, 3, '2025-05-06', 6),
    (7, 1, '2025-05-07', 1),
    (8, 2, '2025-05-08', 2),
    (9, 3, '2025-05-09', 3),
    (10, 1, '2025-05-10', 4);

INSERT INTO Surgery_Skills (Surgery_ID, Skill_Name)
VALUES
    (1, 'General Anesthesia'),
    (1, 'Abdominal Incision'),
    (2, 'Knee Arthroscopy'),
    (2, 'Knee Joint Manipulation'),
    (3, 'Lens Removal'),
    (3, 'Intraocular Lens Implantation'),
    (4, 'Coronary Artery Dissection'),
    (4, 'Graft Harvesting'),
    (5, 'Hip Joint Replacement'),
    (5, 'Bone Cementing');

INSERT INTO Assist_Surgery (Schedule_ID, Nurse_ID)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 4),
    (2, 5),
    (3, 6),
    (3, 1),
    (3, 2),
    (3, 3),
    (4, 4),
    (4, 5),
    (4, 6),
    (5, 1),
    (5, 2),
    (6, 3),
    (6, 4),
    (6, 5),
    (6, 6),
    (7, 1),
    (7, 2),
    (7, 3),
    (8, 4),
    (8, 5),
    (9, 6),
    (9, 1),
    (9, 2),
    (9, 3),
    (10, 4),
    (10, 5),
    (10, 6);

INSERT INTO Nurse_Surgery_Assignment (Nurse_ID, Surgery_ID)
VALUES
    (1, 1),
    (2, 1),
    (3, 1),
    (4, 2),
    (5, 2),
    (1, 3),
    (2, 3),
    (3, 3),
    (6, 3),
    (4, 4),
    (5, 4),
    (6, 4),
    (1, 5),
    (2, 5),
    (3, 6),
    (4, 6),
    (5, 6),
    (6, 6),
    (1, 7),
    (2, 7),
    (3, 7),
    (4, 8),
    (5, 8),
    (1, 9),
    (2, 9),
    (3, 9),
    (6, 9),
    (4, 10),
    (5, 10),
    (6, 10);

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

INSERT INTO staff_shifts (Employee_ID, shift_date, shift_type)
VALUES
    (1, '2025-05-06', 'Day'),
    (5, '2025-05-06', 'Night'),
    (8, '2025-05-07', 'Day'),
    (1, '2025-05-07', 'Night'),
    (3, '2025-05-08', 'Day'),
    (6, '2025-05-08', 'Night'),
    (10, '2025-05-09', 'Day'),
    (3, '2025-05-09', 'Night'),
    (1, '2025-05-10', 'Day'),
    (5, '2025-05-10', 'Night'),
    (8, '2025-05-11', 'Day'),
    (1, '2025-05-11', 'Night'),
    (3, '2025-05-12', 'Day'),
    (6, '2025-05-12', 'Night'),
    (10, '2025-05-13', 'Day'),
    (3, '2025-05-13', 'Night'),

    -- Nurses on same shift
    (2, '2025-05-06', 'Day'),
    (4, '2025-05-06', 'Day'),
    (7, '2025-05-06', 'Night'),
    (9, '2025-05-06', 'Night'),
    (2, '2025-05-07', 'Day'),
    (4, '2025-05-07', 'Day'),
    (7, '2025-05-07', 'Night'),
    (9, '2025-05-07', 'Night'),
    (2, '2025-05-08', 'Day'),
    (4, '2025-05-08', 'Day'),
    (7, '2025-05-08', 'Night'),
    (9, '2025-05-08', 'Night'),
    (2, '2025-05-09', 'Day'),
    (4, '2025-05-09', 'Day'),
    (7, '2025-05-09', 'Night'),
    (9, '2025-05-09', 'Night'),
    (2, '2025-05-10', 'Day'),
    (4, '2025-05-10', 'Day'),
    (7, '2025-05-10', 'Night'),
    (9, '2025-05-10', 'Night'),
    (2, '2025-05-11', 'Day'),
    (4, '2025-05-11', 'Day'),
    (7, '2025-05-11', 'Night'),
    (9, '2025-05-11', 'Night'),
    (2, '2025-05-12', 'Day'),
    (4, '2025-05-12', 'Day'),
    (7, '2025-05-12', 'Night'),
    (9, '2025-05-12', 'Night'),
    (2, '2025-05-13', 'Day'),
    (4, '2025-05-13', 'Day'),
    (7, '2025-05-13', 'Night'),
    (9, '2025-05-13', 'Night');