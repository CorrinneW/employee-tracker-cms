const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'Ch1m3r@01',
  database: 'employee_tracker_schema',
});

connection.connect((err) => {
  if (err) throw err;
  runAction();
});

//provides opening menu and handles the correspondence between choices and their functions
const runAction = () => {
  console.log('WELCOME TO THE EMPLOYEE MANAGEMENT SYSTEM. PLEASE SELECT ONE OF THE OPTIONS BELOW:');
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'Add a new employee',
        'Add a new role',
        'Add a new department',
        new inquirer.Separator(),
        'Update an employee role',
        new inquirer.Separator(),
        'View all employees',
        'View all roles',
        'View all departments',
        new inquirer.Separator(),
        'Exit',
        new inquirer.Separator()
      ]
    })
    .then((answer) => {
      switch (answer.action) {
        case 'Add a new employee':
          addEmployee();
          break;
        case 'Add a new role':
          addRole();
          break;
        case 'Add a new department':
          addDepartment();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all departments':
          viewDepartments();
          break;
        case 'Exit':
          connection.end();
          break;
        default:
          console.log(`Invalid action ${answer.action}`);
          break;
      }
    })
};

//add a new employee to the employee table
const addEmployee = () => {
  //used to get role_id
  const rolesQuery =
    'SELECT * from role_info';

  connection.query(rolesQuery, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: 'addName',
          type: 'input',
          message: "Please enter employee's full name:"
        },
        {
          name: 'addRole',
          type: 'list',
          message: 'Select employee role:',
          //pulls its choices from role_info.title
          choices: function () {
            return res.map(role => role.title);
          }
        }
      ])
      .then(function (answers) {
        let roleId;
        //finds the entry from the role_info table that matches the answer and gets its id
        for (i = 0; i < res.length; i++) {
          if (answers.addRole === res[i].title) {
            roleId = res[i].role_id
          }
        }
        //takes given data and inserts it as a new row in the employee table
        const query =
          'INSERT INTO employee SET ?'
        connection.query(query, {
          first_name: answers.addName.split(" ")[0],
          last_name: answers.addName.split(" ")[1],
          role_id: roleId
        });
        //returns user to the initial menu
        runAction()
      });
  });
};

const addRole = () => {
  const departmentQuery =
    'SELECT * from department';

  connection.query(departmentQuery, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: 'addTitle',
          type: 'input',
          message: "Please enter role title:"
        },
        {
          name: 'addDepartment',
          type: 'list',
          message: 'Select department for this role:',
          choices: function () {
            return res.map(department => department.name);
          }
        },
        {
          name: 'addSalary',
          type: 'number',
          message: 'Please enter salary (numbers and decimal points only, no commas or symbols):',
        }
      ])
      .then(function (answers) {
        let departmentId;
        for (i = 0; i < res.length; i++) {
          if (answers.addDepartment === res[i].name) {
            departmentId = res[i].department_id
          }
        }
        const query =
          'INSERT INTO role_info SET ?'
        connection.query(query, {
          title: answers.addTitle,
          department_id: departmentId,
          salary: answers.addSalary
        });
        runAction()
      });
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: 'addName',
        type: 'input',
        message: "Please enter new department name:"
      }
    ])
    .then(function (answers) {
      const query =
        'INSERT INTO department SET ?'
      connection.query(query, {
        name: answers.addName
      });
      runAction()
    });
};

//allows user to change an employee's role from a list of currently available roles
const updateEmployeeRole = () => {
  const roleQuery =
    'SELECT * from role_info';

  //saves roles as an array
  let getRoles;

  connection.query(roleQuery, (err, res) => {
    if (err) throw err;
    getRoles = res.map(roles => roles.title);
  });

  //returns a table with combined data from employee and role_info tables
  const updateQuery =
    'SELECT * from employee LEFT JOIN role_info on employee.role_id = role_info.role_id';

  //res is the table generated by updateQuery
  connection.query(updateQuery, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: 'selectEmployee',
          type: 'list',
          message: 'Select employee to update:',
          choices: function () {
            return res.map(employee => employee.first_name + " " + employee.last_name);
          }
        },
        {
          name: 'updateRole',
          type: 'list',
          message: 'Select new employee role:',
          choices: getRoles
        }
      ])
      .then(function (answers) {
        let employeeId;
        //finds the row of the table that matches the selected name and grabs its employee_id
        for (i = 0; i < res.length; i++) {
          if (answers.selectEmployee === res[i].first_name + " " + res[i].last_name) {
            employeeId = res[i].employee_id;
          }
        }

        let roleId;
        //finds the row of the table  that matches the selected role title and grabs its role id
        for (i = 0; i < res.length; i++) {
          if (answers.updateRole === res[i].title) {
            roleId = res[i].role_id;
          }
        }

        //uses the values grabbed above to update the role_id of the selected employee
        const query =
          `UPDATE employee SET role_id = ${roleId} WHERE employee.employee_id = ${employeeId}`

        connection.query(query, {
          role_id: roleId
        })
        runAction();
      })
  });
}; 

//gets all data from employee table, as well as date from the role_info table which is relevant to employee and presents it as a new table.
const viewEmployees = () => {
  const query =
    'SELECT * from employee LEFT JOIN role_info ON employee.role_id = role_info.role_id'
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    runAction();
  })
}; 

const viewRoles = () => {
  const query =
    'SELECT * from role_info LEFT JOIN department ON role_info.department_id = department.department_id'
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    runAction();
  });
}; 

const viewDepartments = () => {
  const query =
    'SELECT * from department'
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    runAction();
  });
};