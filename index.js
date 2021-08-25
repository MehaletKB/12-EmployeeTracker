const inquirer = require("inquirer");
const db = require("./db/index.js");
const logo = require("asciiart-logo");
require("console.table");

init();

function init(){
  const empLogo = logo({ name: "Employee Manager"}).render();
  console.log(empLogo);
  displayQuestions();
}

function displayQuestions() {
  inquirer
  .prompt([
    {
      type: "list",
      name: "choices",
      message: "Please select from the list below:",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role",
        "Exit"
      ],
    }
  ]).then((answers) => {
    switch(answers.choices) {
      case "View All Departments":
        viewAllDepartments();
        break;
      case "View All Roles":
        viewAllRoles();
        break;
      case "View All Employees":
        viewAllEmployees();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Add Role":
        addRole();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Update Employee Role":
        updateEmployeeRole();
        break;
      default:;
        finishUp()
    }
  })
};

function viewAllDepartments() {
  db.findAllDepartments().then(([response]) => {
    let departments = response;
    console.log(departments)
  }).then(() => displayQuestions());
}

function viewAllRoles() {
  db.findAllRoles().then(([response]) => {
    let roles = response;
    console.log(roles)
  }).then(() => displayQuestions)
}

function viewAllEmployees() {
  db.findAllEmployees().then(([response]) => {
    let employees = response;
    console.log(employees)
  }).then(() => displayQuestions)
}


function addDepartment() {
  inquirer.prompt([
    {
      message: "What's the department name?",
      name: "department_name"
    },
  ]).then((response) => {
    let newDepartment = response.department_name;
    db.createDepartment(newDepartment)
    .then(() => console.log("You've added a new department."))
    .then(() => displayQuestions())
  })
}

function addRole() {
  db.findAllDepartments().then(([response]) => {
    let departments = response;
    const departmentChoices = departments.map(({ id, department_name }) => ({
        name: department_name,
        value: id,
    }));

  inquirer.prompt([
    {
      type: "input",
      message: "What is the new role name?",
      name: "role_name"
    },
    {
      type: "input",
      message: "What is the new role salary?",
      name: "role_salary"
    },
    {
      type: "list",
      message: "Which department does this role belong to?",
      choices: departmentChoices,
      name: "role_department"
    },
  ]).then((response) => {
    db.createRole(response.role_name, response.role_salary, response.role_department)
    .then(() => console.log("You've added a new role."))
    .then(() => displayQuestions())
    })
  })
}

function addEmployee() {
  inquirer.prompt([
    {
      type: "input",
      message: "What is the first name of the new employee?",
      name: "first_name"
    },
    {
      type: "input",
      message: "What is the last name of the new employee?",
      name: "last_name"
    }
  ]).then((response) => {
    let empFirstName = response.first_name;
    let empLastName = response.last_name;

    db.findAllRoles()
    .then(([response]) => {
      let roles = response;
      const roleChoices = roles.map(({id, role_name}) => ({
        name: role_name,
        value: id
      }));

      inquirer.prompt([
        {
          type: "input",
          message: "What is the new employee's role?",
          name: "role",
          choices: roleChoices
        }
      ])
    })
    .then((response) => {
      let empRole = response.role;

      db.findAllEmployees()
      .then(([response]) => {
        let employees = response
        const managerChoices = employees.map(({id, first_name, last_name}) => ({
          name: `${first_name} ${last_name}`,
          value: id
        }));
      
      inquirer.prompt([
        {
          type: "list",
          message: "Who manages the new employee?",
          name: "manager",
          choices: managerChoices
        }
      ])
      })
      .then(response => {
        let empManager = response.manager
        db.createEmployee(empFirstName, empLastName, empRole, empManager)
      })
      .then(() => displayQuestions())
    })
  })
}

function updateEmployeeRole(){
  db.findAllEmployees()
    .then(([response])=>{
      const employees = response.map(({id,first_name, last_name})=>({
        name: `${first_name} ${last_name}`,
        value: id
      }))

      inquirer.prompt(
        [{
          type: "list",
          message: "What is the name of the Employee?",
          choices: employees,
          name: "employee",
        },])
    .then((response)=>{
      let selectedEmployee = response.employee;
      db.findAllRoles()
      .then(([response])=>{
        const roles = response.map(({id,title})=>({
          name: title,
          value: id
        }))
        inquirer.prompt(
          [{
            type: "list",
            message: "What is the new role for the employee?",
            choices: roles,
            name: "role",
          }]
        )
        .then((response) =>
          db.queryUpdateEmployeeRole(selectedEmployee,response.role))
        .then(()=>displayQuestions());
      });
    })
  })
}

function finishUp(){
  console.log("Thank you!");
  process.exit()
}