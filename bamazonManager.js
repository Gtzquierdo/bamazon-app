var inquirer = require("inquirer");
var mysql = require("mysql");

//link to database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

//establish connection
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    managerMenu();
});

function managerMenu() {
    inquirer.prompt([
        {
            name: "action",
            message: "Please select one action:",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory",
                "Add to Inventory", "Add New Product"]
        }]).then(function (res) {
            console.log("You selected:" + res.action);
            switch (res.action) {
                case "View Products for Sale":
                    return products();

                case "View Low Inventory":
                    return viewLowInventory();

                case "Add to Inventory":
                    return addToInventory();

                case "Add New Product":
                   return addNewProducts();
            }
        })
}

var header = "|#||product_name||department_name||USD||stock|"
var divider = "\n===========================================\n";

//function viewlowinventory
function viewLowInventory() {
    console.log("\n" + header + divider);
     query = connection.query("SELECT * FROM products WHERE stock_quantity < ?", [5], function (err, result) {
        for (var i = 0; i < result.length; i++) {
            console.log("|" + result[i].item_id + "||"
                + result[i].product_name + "||"
                + result[i].department_name + "||"
                + result[i].price + "||"
                + result[i].stock_quantity + "|");
        }
    })
};

//function products
function products() {
     query = connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("\n" + header + divider);
        for (var i = 0; i < res.length; i++) {
            console.log("|" + res[i].item_id + "||"
                + res[i].product_name + "||"
                + res[i].department_name + "||"
                + res[i].price + "||"
                + res[i].stock_quantity + "|")
        }
    })
};


//function addToInventory
function addNewProducts() {
    inquirer.prompt([
    {
        name: "itemToAdd",
        message: "What is the name of the new item?"
    },{
        name: "department",
        message: "Category or department?"
    },{
        name: "price",
        message: "What is the price?"
    },{
        name: "numOfItem",
        message: "How many?"
    }]).then(function (res) {
        console.log("You are about to add: " + res.numOfItem + " " + res.itemToAdd + " .Please wait...");
         query = connection.query("INSERT INTO products SET ?",
            {
                product_name: res.itemToAdd,
                department_name: res.department,
                price: res.price,
                stock_quantity: res.numOfItem
            }, function (err, result) {
                    console.log(result.affectedRows + " rows has been added!")
            })
    })
};

//function addToInventory()
function addToInventory(){
    inquirer.prompt([
        {
            name: "itemToRefill",
            message: "What is the # of the item?"
        },{
            name: "numOfItem",
            message: "How many?"
        }]).then(function (res) {
            console.log("You are about to add: " + res.numOfItem + " of Item # " + res.itemToRefill + ".Please wait...");
             query = connection.query("SELECT * FROM products WHERE item_id =?", [res.itemToRefill], function (err, resu) {
                 query = connection.query("UPDATE products SET ? WHERE ?",
                [{
                    stock_quantity: resu[0].stock_quantity+ parseInt(res.numOfItem)
                },{
                    item_id: res.itemToRefill
                }]
                ,function (err, result) {
                    console.log("Item: "+resu[0].item_id+", "+resu[0].product_name+" has been restocked!")
            })
        })
    })
};