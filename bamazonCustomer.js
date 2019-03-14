var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Giselle0702!",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  products();
});

function products() {
    connection.query("SELECT * FROM products ", function(err, res){
      if (err) throw err;

      console.log("Act now, Supplies won't last long! ")

      for (var i = 0; i < res.length; i++) {
        console.log("Item id: " + res[i].item_id + " || Product name: " + res[i].product_name + " || Department name: " + res[i].department_name + " || Price: " + res[i].price + " ||   Stock: " + res[i].stock_quantity)
      };
      // start();
    })
}

function start() {
  inquirer.prompt({
    name: "selectId",
    type: "input",
    message: "What is the id of the product you'd like to purchase today?"
  }).then(function(answer){
    var query = "SELECT * FROM products WHERE ?";
    connection.query(query, {
      item_id: answers.selectId
    }, function(err, res) {
      var inStock = res[0].stock_quantity;
      var itemBought = answers.amountBought;

      
    })
  })
}
