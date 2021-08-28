const connection = require("../config/connection");

class Database {
  constructor(connection) {
    this.connection = connection;
  }

  findAllDepartments() {
    return this.connection
      .query("SELECT department.id, department.name FROM department;");
  }

  findAllRoles() {
    return this.connection
      .query(
        "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
      );
  }

  findAllEmployees() {
    return this.connection
      .query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
      );
  }

  createDepartment(newDepartment) {
    return this.connection
      .query("INSERT INTO department VALUES(DEFAULT, ?)", newDepartment);
  }

  createRole(role) {
    return this.connection
    .query("INSERT INTO role VALUES(DEFAULT, ?)", role);
  }

  createEmployee(employee) {
    return this.connection
      .query("INSERT INTO employee VALUES(DEFAULT, ?)", employee);
  }

  removeDepartment(departmentId) {
    return this.connection
      .query("DELETE FROM department WHERE id = ?", departmentId);
  }

  
  updateEmployeeRole(employeeId, roleId) {
    return this.connection
    .query("UPDATE employee SET role_id = ? WHERE id = ?", [
      roleId,
      employeeId,
    ]);
  }

  // viewDepartmentBudgets() {
  //   return this.connection
  //     .query(
  //       "SELECT department.id, department.name, SUM(role.salary) AS department_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"
  //     );
  // }

  // removeEmployee(employeeId) {
  //   return this.connection
  //     .query("DELETE FROM employee WHERE id = ?", employeeId);
  // }

  // updateEmployeeManager(employeeId, managerId) {
  //   return this.connection
  //     .query("UPDATE employee SET manager_id = ? WHERE id = ?", [
  //       managerId,
  //       employeeId,
  //     ]);
  // }

  // removeRole(roleId) {
  //   return this.connection
  //     .query("DELETE FROM role WHERE id = ?", roleId);
  // }

  // findAllEmployeesByDepartment(departmentId) {
  //   return this.connection
  //     .query(
  //       "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?;",
  //       departmentId
  //     );
  // }

  // findAllEmployeesByManager(managerId) {
  //   return this.connection
  //     .query(
  //       "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;",
  //       managerId
  //     );
  // }
}

module.exports = new Database(connection);
