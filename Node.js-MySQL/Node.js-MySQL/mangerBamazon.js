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
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
            ]
        })
        .then(function (answer) {
            // console.log(answer);
            switch (answer.action) {
                case "View Products for Sale":
                    viewProducts();
                    break;

                case "View Low Inventory":
                    viewLow();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addNew();
                    break;
                default:
                    break;
            }
        });
};
//first choice.
function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log(res);
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-----------------------------------");
        start();
    });
};
//-------------------------------------------------------------------------------
//second choice.
function viewLow() {
    connection.query("SELECT * FROM products WHERE stock_quantity<50", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price + " | " + res[i].stock_quantity);


        }
        start();
    });
};
//---------------------------------------------------------------------------
//third choice.
function addInventory() {
    inquirer
        .prompt([{
            name: "select",
            type: "input",
            message: "which item you want to add more?"
        }, {
            name: "add",
            type: "input",
            message: "How many item you want to add?"

        }]).then(function (answer) {
            connection.query("UPDATE products SET ? WHERE ?", [{
                    //set new quantity
                    stock_quantity: answer.add
                },
                {
                    //the id of the item that we want to set.
                    id: answer.select
                }
            ], function (err, res) {
                if (err) throw err;

                console.log("you add ( " + answer.add + " )more to the item ID ( " + answer.select + " )");
                console.log("-----------------------------------");
                start();
            });
        });
};
//-----------------------------------------------------------------------------------------
// forth choice.
function addNew() {

    // prompt for info about the item being put up for products
    inquirer
        .prompt([

            {
                name: "name",
                type: "input",
                message: "What is the item you would like to submit?"
            },
            {
                name: "dName",
                type: "input",
                message: "Please,inter the department name?",

            },
            {
                name: "price",
                type: "input",
                message: "Please,inter the price?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }, {
                name: "quantity",
                type: "input",
                message: "Please,inter the quantity?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the colum with that info
            connection.query(
                "INSERT INTO products SET ?", {

                    product_name: answer.name,
                    department_name: answer.dName,
                    price: answer.price,
                    stock_quantity: answer.quantity
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