DROP DATABASE IF EXISTS employee_tracker_schema;

CREATE DATABASE employee_tracker_schema;

USE employee_tracker_schema;

CREATE TABLE department (
  department_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NULL,
  PRIMARY KEY (department_id)
);

CREATE TABLE role_info (
  role_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL NULL,
  department_id INT,
  PRIMARY KEY (role_id),
);

CREATE TABLE employee (
  employee_id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  PRIMARY KEY (employee_id),
);

USE employee_tracker_schema;

INSERT INTO department (name)
VALUES ("Marketing"),
("Research and Development"),
("Accounting"),
("Production");

INSERT INTO role_info (title, salary)
VALUES ("Marketing Manager", 80000.00),
("Head of R&D", 100000.00),
("Accounting Manager", 100000.00),
("Production Manager", 80000.00),
("Graphic Designer", 50000.000),
("Research Assistant", 40000.00),
("Accountant", 50000.00),
("Production Line", 30000.00);

INSERT INTO employee (first_name, last_name)
VALUES ("Denzel", "Washington"),
("Betty", "White"),
("Sandra", "Bullock"),
("Keanu", "Reeves"),
("Jackie", "Chan"),
("Mahershala", "Ali"),
("Melissa", "McCarthy"),
("Viola", "Davis");