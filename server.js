const mysql = require('mysql2');
const fs = require("fs");
const inquirer = require('inquirer');

require('dotenv').config();
require('console.table');



const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "employee_db"
})

connection.connect(function (err) {
    if (err) {
        console.log(err);
    }
})

function mainMenu() {

    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
                "View All Departments",
                "View All Roles",
                "view All Employees",
                "Add a Department",
                "Add a Role",
                "Add an Employee",
                "Update ab Employee Role",
                "Exit"
            ]
        }
    ])
        .then((answer) => {

            switch (answer.action) {

                case "View All Departments":
                    // view all the departments!
                    console.log("Viewing all departments")
                    viewAllDepartments()
                    break;
                case "View All Roles":
                    // view all the Roles!
                    console.log("View all roles")
                    viewAllRoles()
                    break;
                case "View All Employees":
                    // view all the Roles!
                    console.log("View all employees")
                    viewAllEmployees()
                    break;
                case "Add a Department":
                    // start asking for the info about the new department
                    console.log("Adding a new department")
                    addDepartment()
                    break;
                case "Add a role":
                    // start asking for the info about the new role
                    console.log("Adding a new role")
                    addRole()
                    break;
                case "Add a Department":
                    // start asking for the info about the new department
                    console.log("Adding a new department")
                    addDepartment()
                    break;

                default:
                    return;
            }
        })
}

function viewAllDepartments() {
    connection.query("SELECT * FROM department;", function (err, data) {
        console.table(data)
        mainMenu();
    })
}
function viewAllRoles() {
    connection.query("SELECT * FROM role;", function (err, data) {
        console.table(data)
        mainMenu();
})
}
function viewAllEmployees() {
    connection.query("SELECT * FROM employee;", function (err, data) {
        console.table(data)
        mainMenu();
})
}
function addDepartment() {

    inquirer.prompt([
        {
            type: "input",
            name: "department_name",
            message: "What is the name of this new department?"
        }
    ])
        .then(answer => {
            connection.query(`INSERT INTO department (name) VALUES ("${answer.department_name}");`, function (err, data) {
                console.log("Department added successfully!");
                mainMenu();
            })
        })


}
function addRole() {

    inquirer.prompt([
        {
            type: "input",
            name: "role_title",
            message: "What is the title of this new role?"
        },
        {
            type: "input",
            name: "role_salary",
            message: "What is the salary of this new role?"
        },
        {
            type: "input",
            name: "role_department",
            message: "What is the department of this new role?"
        },
    ])
        .then(answer => {
            connection.query(
                `
                INSERT INTO role (title) VALUES ("${answer.role_title}"); 
                INSERT INTO role (salary) VALUES ("${answer.role_salary}");
                INSERT INTO role (department) VALUES ("${answer.role_department}"); 
                `
                , function (err, data) {
                console.log("Role added successfully!");
                mainMenu();
            })
        })


}




mainMenu();