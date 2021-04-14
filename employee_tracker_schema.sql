DROP DATABASE IF EXISTS employee_tracker_schema;

CREATE DATABASE employee_tracker_schema;

USE employee_tracker_schema;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  department VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role_info (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL NULL,
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id)
	REFERENCES department(id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id)
	REFERENCES role_info(id)
);