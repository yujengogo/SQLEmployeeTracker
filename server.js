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
                "View All Employees",
                "Add a Department",
                "Add a Role",
                "Add an Employee",
                "Update an Employee Role",
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
                case "Add a Role":
                    // start asking for the info about the new role
                    console.log("Adding a new role")
                    addRole()
                    break;
                case "Add an Employee":
                    // start asking for the info about the new employee
                    console.log("Adding a new employee")
                    addEmployee()
                    break;
                case "Update an Employee Role":
                    // updating employee role
                    console.log("Updating employee role")
                    updateEmployee()
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

    connection.query("SELECT * FROM department;", function (err, res) {
        let departmentChoice = res.map(function (res) {
            // return res['name'];
            return {
                value: res["id"],
                name: res["name"]
            }
        })

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
            // need to double check
            {
                type: "list",
                name: "role_department",
                message: "What is the department of this new role?",
                choices: departmentChoice

            },
        ])
            .then(answer => {
                connection.query(
                    `
            INSERT INTO role (title, salary, department_id) VALUES ("${answer.role_title}","${answer.role_salary}","${answer.role_department}" ); 
       
            `
                    , function (err, data) {
                        if (err) console.log(err);
                        console.log("Role added successfully!");
                        mainMenu();
                    })
            })
    });


}
function addEmployee() {

    connection.query(`SELECT*FROM role;`, function (err, res) {
        let roleChoice = res.map(function (res) {
            // return res['title'];
            return {
                value: res["id"],
                name: res["title"]
            }
        });
        let roles = res;
        connection.query(`SELECT * FROM employee WHERE manager_id IS NULL;`, function (err, res) {
            let managerChoices = [
                {
                    name: "no manager found!",
                    value: null
                }
            ]
            console.log(res)
            if (res) {
                managerChoices = res.map(function (res) {
                    return { name: res.first_name + ' ' + res.last_name + ": ", value: res.id };
                });
            }


            inquirer.prompt([
                {
                    type: "input",
                    name: "employee_first_name",
                    message: "What is the first name of the new employee?"
                },
                {
                    type: "input",
                    name: "employee_last_name",
                    message: "What is the last name of the new employee?"
                },
                // need to double check.
                {
                    type: "list",
                    name: "employee_role_id",
                    message: "What is the role id of the new employee?",
                    choices: roleChoice
                },
                // need to double check.
                {
                    type: "list",
                    name: "employee_manager_id",
                    message: "What is the manager id of the new employee?",
                    choices: managerChoices
                },
            ])
                .then(answer => {
                    connection.query(
                        `
                INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.employee_first_name}","${answer.employee_last_name}","${answer.employee_role_id}",${answer.employee_manager_id}); 
                
                `
                        , function (err, data) {
                            if (err) console.log(err)
                            else {
                                console.log("Employee added successfully!");
                                mainMenu();
                            }
                        })
                })


        });
    });
}
function updateEmployee() {

    inquirer.prompt([
        {
            type: "input",
            name: "role_id",
            message: "What is the new role id?"
        },
        {
            type: "input",
            name: "id",
            message: "What is the id of the employee?"
        },

    ])


        .then(answer => {
            connection.query(
                `
            UPDATE employee SET role_id = ${answer.role_id} WHERE id= ${answer.id};  
    
    `
                , function (err, data) {
                    if (err) console.log(err)
                    else {
                        console.log("Role update successfully!");
                        mainMenu();
                    }
                })
        })

}


mainMenu();