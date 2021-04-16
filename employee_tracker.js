const mysql = require('mysql');
const inquirer = require('inquirer');

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

const runAction = () => {
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
        'Exit'
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
        case 'Update employee role':
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

const addEmployee = () => {
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
          choices: function () {
            return res.map(role => role.title);
          }
        }
      ])
      .then(function (answers) {
        let roleId;
        for (i = 0; i < res.length; i++) {
          if (answers.addRole === res[i].title) {
            roleId = res[i].id
          }
        }
        const query =
          'INSERT INTO employee SET ?'
        connection.query(query, {
          first_name: answers.addName.split(" ")[0],
          last_name: answers.addName.split(' ')[1],
          role_id: roleId
        });
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
          type: 'input',
          message: "Please enter department of role:"
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
          if (answers.addDepartment === res[i].title) {
            departmentId = res[i].id
          }
        }
        const query =
          'INSERT INTO department SET ?'
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

const updateEmployeeRole = () => {
  runAction();
} //update query

const viewEmployees = () => {
  const query =
    'SELECT * from employee LEFT JOIN role_info ON employee.role_id = role_info.id'
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    runAction();
  })
}; //join query with department and role tables

const viewRoles = () => {
  runAction();
}; //join with department

const viewDepartments = () => {
  runAction();
};