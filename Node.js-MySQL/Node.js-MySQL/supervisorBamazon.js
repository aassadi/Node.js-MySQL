var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
})
//--------------------------------------------------------------------
connection.connect(function (err) {
    console.log("conected as id: " + connection.threadId);
    start()
})

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View Product Sales by Department",
                "Create New Department",
            ]
        })
        .then(function (answer) {
            console.log(answer);
            switch (answer.action) {
                case "View Product Sales by Department":
                    viewProduct();
                    break;

                case "Create New Department":
                    addDepartment();
                    break;

                default:
                    break;
            }
        });

};
//----------------------------------------------------------------
function viewProduct() {
    var query = "SELECT d.department_id, d.department_name, d.over_head_costs,p.product_sales FROM departments d inner join products p on d.department_name =p.department_name ";

    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {


            console.log(res[i].department_id + " | " + res[i].department_name + " | " + "$" + res[i].over_head_cost + " | " + "$" + res[i].product_sales);
        }
        console.log("-----------------------------------");
        start()
    });

};


//----------------------------------------------------------------
// if the supervisor want to add to the table.
function addDepartment() {
    inquirer
        .prompt([

            {
                name: "dName",
                type: "input",
                message: "Please,inter the department name?",
            },
            {
                name: "cost",
                type: "input",
                message: "Please,inter the over_head_costs?",
                //to make sure the user input number.
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            // when finished prompting, insert a new department into the colum with that info
            connection.query(
                "INSERT INTO departments SET ?", {

                    department_name: answer.dName,
                    over_head_costs: answer.cost,

                },
                function (err) {
                    if (err) throw err;
                    console.log("You added new item successfully!");
                    // re-prompt the custmer
                    console.log("-----------------------------------");
                    start();
                }
            );
        });
}