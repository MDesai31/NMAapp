CREATE DATABASE sampleapp;
USE sampleapp;

CREATE TABLE authentication (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);