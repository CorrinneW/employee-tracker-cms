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

module.exports