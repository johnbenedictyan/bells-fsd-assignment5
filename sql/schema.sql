DROP DATABASE IF EXISTS erm;

CREATE DATABASE IF NOT EXISTS erm;

USE erm;

CREATE TABLE Companies(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE Employees(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    bio TEXT,
    company_id INT,
    FOREIGN KEY (company_id) REFERENCES Companies (id)
);

CREATE TABLE Payroll(
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL,
    employee_id INT,
    FOREIGN KEY (employee_id) REFERENCES Employees (id),
    company_id INT,
    FOREIGN KEY (company_id) REFERENCES Companies (id)
)